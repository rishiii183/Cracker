import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'ws_sahil';
    const channel = searchParams.get('channel');
    const stage = searchParams.get('stage');
    const search = searchParams.get('search') || '';

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const in14Days = new Date(startOfToday.getTime() + 14 * 24 * 60 * 60 * 1000);

    const leadWhere: any = {
      workspaceId,
      archived: false,
    };

    if (channel && channel !== 'All' && channel !== 'All channels') {
      leadWhere.channel = channel;
    }
    if (stage && stage !== 'All' && stage !== 'All stages') {
      leadWhere.stage = stage;
    }
    if (search) {
      leadWhere.OR = [
        { companyName: { contains: search } },
        { contactName: { contains: search } },
        { emails: { some: { email: { contains: search } } } },
      ];
    }

    const allFollowUps = await prisma.followUp.findMany({
      where: {
        sent: false,
        dueDate: { not: null },
        lead: leadWhere,
      },
      include: {
        lead: {
          include: {
            emails: true,
            tags: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    const overdue = allFollowUps.filter((f) => f.dueDate && new Date(f.dueDate) < startOfToday);
    const dueToday = allFollowUps.filter(
      (f) => f.dueDate && new Date(f.dueDate) >= startOfToday && new Date(f.dueDate) <= endOfToday
    );
    const upcoming = allFollowUps.filter(
      (f) => f.dueDate && new Date(f.dueDate) > endOfToday && new Date(f.dueDate) <= in14Days
    );

    return NextResponse.json({
      overdue,
      dueToday,
      upcoming,
      totalCount: allFollowUps.length,
      overdueCount: overdue.length,
      dueTodayCount: dueToday.length,
      upcomingCount: upcoming.length,
    });
  } catch (error: any) {
    console.error('Error fetching follow-ups:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, followUpId, leadId, snoozeDays, newDate } = body;

    if (!followUpId && !leadId) {
      return NextResponse.json({ error: 'Missing followUpId or leadId' }, { status: 400 });
    }

    if (action === 'markSent') {
      const fup = await prisma.followUp.update({
        where: { id: followUpId },
        data: {
          sent: true,
          sentAt: new Date(),
          sentBy: body.sentBy || 'User',
        },
        include: { lead: true },
      });

      // Update lead
      await prisma.lead.update({
        where: { id: fup.leadId },
        data: {
          lastContacted: new Date(),
          lastActivity: new Date(),
          stage: fup.lead.stage === 'New' || fup.lead.stage === 'Contacted' ? 'Following up' : fup.lead.stage,
        },
      });

      // Activity entry
      await prisma.activityEntry.create({
        data: {
          workspaceId: fup.lead.workspaceId,
          leadId: fup.leadId,
          type: 'Follow up sent',
          category: 'Outreach',
          text: `${fup.lead.companyName} · Follow up #${fup.stepNumber} sent via ${fup.channel || fup.lead.channel}`,
          authorName: body.sentBy || 'User',
        },
      });

      return NextResponse.json({ success: true, followUp: fup });
    }

    if (action === 'snooze') {
      const days = snoozeDays || 1;
      const targetDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      const fup = await prisma.followUp.update({
        where: { id: followUpId },
        data: { dueDate: targetDate },
      });
      return NextResponse.json({ success: true, followUp: fup });
    }

    if (action === 'setDate') {
      const fup = await prisma.followUp.update({
        where: { id: followUpId },
        data: { dueDate: newDate ? new Date(newDate) : null },
      });
      return NextResponse.json({ success: true, followUp: fup });
    }

    if (action === 'stop' && leadId) {
      await prisma.followUp.deleteMany({
        where: { leadId, sent: false },
      });
      return NextResponse.json({ success: true, message: 'Follow ups stopped' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating follow-up:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, stepNumber, dueDate, channel, templateId, notes } = body;

    const followUp = await prisma.followUp.upsert({
      where: {
        leadId_stepNumber: { leadId, stepNumber: stepNumber || 1 },
      },
      update: {
        dueDate: dueDate ? new Date(dueDate) : null,
        channel: channel || null,
        templateId: templateId || null,
        notes: notes || null,
        sent: false,
      },
      create: {
        leadId,
        stepNumber: stepNumber || 1,
        dueDate: dueDate ? new Date(dueDate) : null,
        channel: channel || null,
        templateId: templateId || null,
        notes: notes || null,
        sent: false,
      },
    });

    return NextResponse.json(followUp);
  } catch (error: any) {
    console.error('Error creating follow-up:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
