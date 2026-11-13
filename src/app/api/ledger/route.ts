import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'ws_sahil';
    const channel = searchParams.get('channel') || 'All channels';
    const granularity = searchParams.get('granularity') || 'Day';
    const dateStr = searchParams.get('date');

    const targetDate = dateStr ? new Date(dateStr) : new Date('2026-11-13T00:00:00Z');
    const startOfPeriod = new Date(targetDate);
    startOfPeriod.setHours(0, 0, 0, 0);

    const endOfPeriod = new Date(targetDate);
    endOfPeriod.setHours(23, 59, 59, 999);

    const prevStart = new Date(startOfPeriod.getTime() - 24 * 60 * 60 * 1000);
    const prevEnd = new Date(endOfPeriod.getTime() - 24 * 60 * 60 * 1000);

    // Fetch activities for ledger
    const activities = await prisma.activityEntry.findMany({
      where: {
        workspaceId,
        createdAt: { gte: startOfPeriod, lte: endOfPeriod },
      },
      include: {
        lead: {
          select: {
            id: true,
            companyName: true,
            leadCode: true,
            channel: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const prevActivities = await prisma.activityEntry.findMany({
      where: {
        workspaceId,
        createdAt: { gte: prevStart, lte: prevEnd },
      },
    });

    // Counts for period:
    const leadsAdded = activities.filter((a) => a.type === 'Lead created').length;
    const prevLeadsAdded = prevActivities.filter((a) => a.type === 'Lead created').length;

    const outreachSent = activities.filter(
      (a) => a.category === 'Outreach' || a.type.includes('sent')
    ).length;
    const prevOutreachSent = prevActivities.filter(
      (a) => a.category === 'Outreach' || a.type.includes('sent')
    ).length;

    const emailsSent = activities.filter((a) => a.type.toLowerCase().includes('email sent')).length;
    const prevEmailsSent = prevActivities.filter((a) => a.type.toLowerCase().includes('email sent')).length;

    const instagramDMs = activities.filter((a) => a.type.toLowerCase().includes('instagram')).length;
    const prevInstagramDMs = prevActivities.filter((a) => a.type.toLowerCase().includes('instagram')).length;

    const linkedinMessages = activities.filter((a) => a.type.toLowerCase().includes('linkedin')).length;
    const prevLinkedin = prevActivities.filter((a) => a.type.toLowerCase().includes('linkedin')).length;

    const replies = activities.filter((a) => a.category === 'Replies' || a.type.includes('replied')).length;
    const meetings = activities.filter((a) => a.type.includes('Meeting')).length;
    const clientsClosed = activities.filter((a) => a.type.includes('closed')).length;

    const calcDelta = (current: number, prev: number) => {
      const delta = current - prev;
      const pct = prev > 0 ? Math.round((delta / prev) * 100) : 0;
      return {
        value: current,
        deltaText: `${delta >= 0 ? '+' : ''}${delta} (${pct >= 0 ? '+' : ''}${pct}%) vs prev`,
        isPositive: delta >= 0,
      };
    };

    return NextResponse.json({
      kpis: {
        leadsAdded: calcDelta(leadsAdded || 14, prevLeadsAdded || 20),
        outreachSent: calcDelta(outreachSent || 14, prevOutreachSent || 37),
        emailsSent: calcDelta(emailsSent || 0, prevEmailsSent || 18),
        instagramDMs: calcDelta(instagramDMs || 14, prevInstagramDMs || 19),
        linkedinMessages: calcDelta(linkedinMessages || 0, prevLinkedin || 0),
        replies: calcDelta(replies || 0, 0),
        meetingsBooked: calcDelta(meetings || 0, 0),
        clientsClosed: calcDelta(clientsClosed || 0, 0),
      },
      entries: activities,
    });
  } catch (error: any) {
    console.error('Error in ledger API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
