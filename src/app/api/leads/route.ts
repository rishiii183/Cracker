import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'ws_sahil';
    const archived = searchParams.get('archived') === 'true';
    const search = searchParams.get('search') || '';
    const stage = searchParams.get('stage');
    const channel = searchParams.get('channel');
    const status = searchParams.get('status');
    const country = searchParams.get('country');
    const sender = searchParams.get('sender');
    const addedBy = searchParams.get('addedBy');
    const tag = searchParams.get('tag');
    const hasReplied = searchParams.get('hasReplied');
    const loomSent = searchParams.get('loomSent');
    const emailCheck = searchParams.get('emailCheck');
    const sortBy = searchParams.get('sortBy') || 'dateAdded';
    const sortDirection = (searchParams.get('sortDirection') || 'desc') as 'asc' | 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const where: any = {
      workspaceId,
      archived,
    };

    if (search) {
      where.OR = [
        { companyName: { contains: search } },
        { contactName: { contains: search } },
        { leadCode: { contains: search } },
        { emails: { some: { email: { contains: search } } } },
        { tags: { some: { tag: { contains: search } } } },
      ];
    }

    if (stage && stage !== 'All') {
      where.stage = stage;
    }

    if (channel && channel !== 'All') {
      where.channel = channel;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    if (country && country !== 'All') {
      where.country = country;
    }

    if (sender && sender !== 'All') {
      where.senderAccount = sender;
    }

    if (addedBy && addedBy !== 'All') {
      where.addedBy = addedBy;
    }

    if (tag && tag !== 'All') {
      where.tags = { some: { tag } };
    }

    if (hasReplied && hasReplied !== 'All') {
      const isReplied = hasReplied === 'Yes';
      where.outreachMarks = {
        some: {
          type: { in: ['Instagram reply', 'LinkedIn reply', 'Email reply'] },
          done: isReplied,
        },
      };
    }

    if (loomSent && loomSent !== 'All') {
      const isLoom = loomSent === 'Yes';
      where.outreachMarks = {
        some: {
          type: 'Loom sent',
          done: isLoom,
        },
      };
    }

    if (emailCheck && emailCheck !== 'All') {
      if (emailCheck === 'No email') {
        where.emails = { none: {} };
      } else if (emailCheck === 'At least one verified') {
        where.emails = { some: { verificationStatus: 'Deliverable' } };
      } else if (emailCheck === 'None verified yet') {
        where.emails = { every: { verificationStatus: { not: 'Deliverable' } } };
      }
    }

    // Determine order
    let orderBy: any = {};
    if (sortBy === 'companyName') orderBy = { companyName: sortDirection };
    else if (sortBy === 'lastActivity') orderBy = { lastActivity: sortDirection };
    else if (sortBy === 'lastContacted') orderBy = { lastContacted: sortDirection };
    else if (sortBy === 'addedBy') orderBy = { addedBy: sortDirection };
    else orderBy = { dateAdded: sortDirection };

    const total = await prisma.lead.count({ where });

    const leads = await prisma.lead.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        emails: true,
        people: true,
        tags: true,
        followUps: {
          orderBy: { stepNumber: 'asc' },
        },
        outreachMarks: true,
      },
    });

    return NextResponse.json({
      leads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const workspaceId = body.workspaceId || 'ws_sahil';

    // Strictly ensure lead is only created when user submits valid form
    if (!body.companyName && !body.contactName && !body.email && !body.website) {
      return NextResponse.json({ error: 'Lead identifier is required' }, { status: 400 });
    }

    // Generate lead code
    const count = await prisma.lead.count({ where: { workspaceId } });
    const leadCode = `LEAD-${String(count + 831).padStart(4, '0')}`;

    const leadName = body.companyName || body.contactName || body.email || 'Untitled lead';

    const lead = await prisma.lead.create({
      data: {
        workspaceId,
        leadCode,
        companyName: leadName,
        contactName: body.contactName || null,
        country: body.country || null,
        location: body.location || null,
        industry: body.industry || null,
        employeeCount: body.employeeCount || null,
        revenue: body.revenue || null,
        foundedYear: body.foundedYear || null,
        website: body.website || null,
        channel: body.channel || 'Instagram',
        stage: body.stage || 'Contacted',
        status: body.status || 'new',
        priority: body.priority || 'Medium',
        addedBy: body.addedBy || 'Sahil',
        senderAccount: body.senderAccount || 'None',
        dateAdded: new Date(),
        lastActivity: new Date(),
        lastContacted: body.outreachSent ? new Date() : null,
      },
    });

    // Add email if provided
    if (body.email) {
      await prisma.leadEmail.create({
        data: {
          leadId: lead.id,
          email: body.email,
          isMain: true,
          verificationStatus: body.emailVerified ? 'Deliverable' : 'Unverified',
        },
      });
    }

    // Add person if provided
    if (body.contactName) {
      await prisma.leadPerson.create({
        data: {
          leadId: lead.id,
          name: body.contactName,
          email: body.email || null,
          titleRole: body.titleRole || null,
          linkedin: body.website?.includes('linkedin') ? body.website : null,
          isMain: true,
        },
      });
    }

    // Add tags if provided
    if (Array.isArray(body.tags) && body.tags.length > 0) {
      for (const t of body.tags) {
        await prisma.leadTag.create({
          data: {
            leadId: lead.id,
            tag: typeof t === 'string' ? t : t.tag,
          },
        });
      }
    }

    // Follow up step 1
    if (body.nextFollowUpDays || body.nextFollowUpDate) {
      let dueDate: Date | null = null;
      if (body.nextFollowUpDate) {
        dueDate = new Date(body.nextFollowUpDate);
      } else if (body.nextFollowUpDays) {
        dueDate = new Date(Date.now() + body.nextFollowUpDays * 24 * 60 * 60 * 1000);
      }

      if (dueDate) {
        await prisma.followUp.create({
          data: {
            leadId: lead.id,
            stepNumber: 1,
            dueDate,
            channel: lead.channel,
            templateId: body.followUpTemplateId || null,
            sent: false,
          },
        });
      }
    }

    // Outreach Marks
    if (body.outreachSent) {
      const markType =
        lead.channel === 'Email'
          ? 'Email sent'
          : lead.channel === 'LinkedIn'
          ? 'LinkedIn message'
          : 'Instagram message';

      await prisma.outreachMark.create({
        data: {
          leadId: lead.id,
          type: markType,
          done: true,
          doneAt: new Date(),
        },
      });
    }

    // Activity log entry
    await prisma.activityEntry.create({
      data: {
        workspaceId,
        leadId: lead.id,
        type: 'Lead created',
        category: 'Stage and status',
        text: `${lead.companyName} · Lead created`,
        authorName: body.addedBy || 'Sahil',
      },
    });

    if (body.outreachSent) {
      const eventText =
        lead.channel === 'Email'
          ? 'Email sent'
          : lead.channel === 'LinkedIn'
          ? 'LinkedIn message sent'
          : 'Instagram message sent';

      await prisma.activityEntry.create({
        data: {
          workspaceId,
          leadId: lead.id,
          type: eventText,
          category: 'Outreach',
          text: `${lead.companyName} · ${eventText}`,
          authorName: body.addedBy || 'Sahil',
        },
      });
    }

    const fullLead = await prisma.lead.findUnique({
      where: { id: lead.id },
      include: {
        emails: true,
        people: true,
        tags: true,
        followUps: true,
        outreachMarks: true,
      },
    });

    return NextResponse.json(fullLead, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, leadIds, data } = body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: 'No leads specified' }, { status: 400 });
    }

    if (action === 'changeStage' && data?.stage) {
      await prisma.lead.updateMany({
        where: { id: { in: leadIds } },
        data: { stage: data.stage, lastActivity: new Date() },
      });
    } else if (action === 'changeStatus' && data?.status) {
      await prisma.lead.updateMany({
        where: { id: { in: leadIds } },
        data: { status: data.status, lastActivity: new Date() },
      });
    } else if (action === 'archive') {
      await prisma.lead.updateMany({
        where: { id: { in: leadIds } },
        data: { archived: true, archivedAt: new Date() },
      });
    } else if (action === 'restore') {
      await prisma.lead.updateMany({
        where: { id: { in: leadIds } },
        data: { archived: false, archivedAt: null },
      });
    } else if (action === 'addTag' && data?.tag) {
      for (const id of leadIds) {
        try {
          await prisma.leadTag.upsert({
            where: { leadId_tag: { leadId: id, tag: data.tag } },
            update: {},
            create: { leadId: id, tag: data.tag },
          });
        } catch {
          // ignore duplicate
        }
      }
    }

    return NextResponse.json({ success: true, count: leadIds.length });
  } catch (error: any) {
    console.error('Error updating leads:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
