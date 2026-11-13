import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'ws_sahil';
    const category = searchParams.get('category') || 'All';
    const author = searchParams.get('author');
    const search = searchParams.get('search') || '';
    const dateRange = searchParams.get('dateRange') || 'Last 30 days';

    const where: any = { workspaceId };

    if (category !== 'All') {
      if (category === 'Outreach') {
        where.category = 'Outreach';
      } else if (category === 'Replies') {
        where.category = 'Replies';
      } else if (category === 'Stage & status' || category === 'Stage and status') {
        where.category = 'Stage and status';
      } else if (category === 'Notes & calls' || category === 'Notes and calls') {
        where.category = { in: ['Notes and calls', 'Call', 'Note'] };
      } else if (category === 'Other') {
        where.category = 'Other';
      }
    }

    if (author && author !== 'Done by anyone' && author !== 'all') {
      where.authorName = author;
    }

    if (search) {
      where.OR = [
        { text: { contains: search } },
        { details: { contains: search } },
        { authorName: { contains: search } },
        { lead: { companyName: { contains: search } } },
      ];
    }

    // Date range filter
    const now = new Date();
    if (dateRange === 'Today') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      where.createdAt = { gte: start };
    } else if (dateRange === 'This week') {
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      where.createdAt = { gte: start };
    } else if (dateRange === 'Last 30 days' || dateRange === 'This month') {
      const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      where.createdAt = { gte: start };
    }

    // Get live category counts
    const [allCount, outreachCount, repliesCount, stageStatusCount, notesCallsCount, otherCount] =
      await Promise.all([
        prisma.activityEntry.count({ where: { workspaceId } }),
        prisma.activityEntry.count({ where: { workspaceId, category: 'Outreach' } }),
        prisma.activityEntry.count({ where: { workspaceId, category: 'Replies' } }),
        prisma.activityEntry.count({ where: { workspaceId, category: 'Stage and status' } }),
        prisma.activityEntry.count({
          where: { workspaceId, category: { in: ['Notes and calls', 'Call', 'Note'] } },
        }),
        prisma.activityEntry.count({ where: { workspaceId, category: 'Other' } }),
      ]);

    const entries = await prisma.activityEntry.findMany({
      where,
      include: {
        lead: {
          select: {
            id: true,
            companyName: true,
            leadCode: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return NextResponse.json({
      entries,
      counts: {
        all: allCount,
        outreach: outreachCount,
        replies: repliesCount,
        stageStatus: stageStatusCount,
        notesCalls: notesCallsCount,
        other: otherCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching activity:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, type, whatHappened, details, dateTime, authorName, workspaceId } = body;

    if (!type || !whatHappened) {
      return NextResponse.json({ error: 'Type and description required' }, { status: 400 });
    }

    // Determine category
    let category = 'Other';
    if (
      type.includes('sent') ||
      type.includes('Outreach') ||
      type === 'Follow up sent' ||
      type === 'Loom sent'
    ) {
      category = 'Outreach';
    } else if (type.includes('replied') || type.includes('reply')) {
      category = 'Replies';
    } else if (type.includes('Stage') || type.includes('status') || type === 'Lead created') {
      category = 'Stage and status';
    } else if (type === 'Call' || type === 'Note') {
      category = 'Notes and calls';
    }

    let leadName = '';
    if (leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });
      if (lead) leadName = lead.companyName;
    }

    const entry = await prisma.activityEntry.create({
      data: {
        workspaceId: workspaceId || 'ws_sahil',
        leadId: leadId || null,
        type,
        category,
        text: leadName ? `${leadName} · ${whatHappened}` : whatHappened,
        details: details || null,
        authorName: authorName || 'Sahil',
        createdAt: dateTime ? new Date(dateTime) : new Date(),
      },
      include: { lead: true },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, text, type, details } = body;

    const updated = await prisma.activityEntry.update({
      where: { id },
      data: {
        text: text !== undefined ? text : undefined,
        type: type !== undefined ? type : undefined,
        details: details !== undefined ? details : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating activity:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.activityEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting activity:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
