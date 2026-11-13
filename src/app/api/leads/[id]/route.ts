import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        emails: true,
        people: true,
        tags: true,
        followUps: {
          orderBy: { stepNumber: 'asc' },
        },
        outreachMarks: true,
        notes: true,
        todos: {
          include: {
            assignee: true,
            comments: true,
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error: any) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if updating basic lead fields
    const updateData: any = {
      lastActivity: new Date(),
    };

    if (body.companyName !== undefined) updateData.companyName = body.companyName;
    if (body.contactName !== undefined) updateData.contactName = body.contactName;
    if (body.stage !== undefined) updateData.stage = body.stage;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.industry !== undefined) updateData.industry = body.industry;
    if (body.employeeCount !== undefined) updateData.employeeCount = body.employeeCount;
    if (body.revenue !== undefined) updateData.revenue = body.revenue;
    if (body.foundedYear !== undefined) updateData.foundedYear = body.foundedYear;
    if (body.website !== undefined) updateData.website = body.website;
    if (body.channel !== undefined) updateData.channel = body.channel;
    if (body.checked !== undefined) {
      updateData.checked = body.checked;
      updateData.checkedAt = body.checked ? new Date() : null;
      updateData.checkedBy = body.checked ? body.checkedBy || 'User' : null;
    }
    if (body.archived !== undefined) {
      updateData.archived = body.archived;
      updateData.archivedAt = body.archived ? new Date() : null;
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
    });

    // Update note if provided
    if (body.note) {
      const { type, text, author } = body.note;
      const existing = await prisma.leadNote.findFirst({
        where: { leadId: id, type },
      });
      if (existing) {
        await prisma.leadNote.update({
          where: { id: existing.id },
          data: { text, updatedBy: author || 'User', updatedAt: new Date() },
        });
      } else {
        await prisma.leadNote.create({
          data: { leadId: id, type, text, updatedBy: author || 'User' },
        });
      }
    }

    // Toggle or update Outreach Mark
    if (body.outreachMark) {
      const { type, done } = body.outreachMark;
      await prisma.outreachMark.upsert({
        where: { leadId_type: { leadId: id, type } },
        update: { done, doneAt: done ? new Date() : null },
        create: { leadId: id, type, done, doneAt: done ? new Date() : null },
      });

      // Record activity entry
      if (done) {
        await prisma.activityEntry.create({
          data: {
            workspaceId: updatedLead.workspaceId,
            leadId: id,
            type,
            category: type.includes('reply') ? 'Replies' : 'Outreach',
            text: `${updatedLead.companyName} · ${type}`,
            authorName: body.authorName || 'User',
          },
        });
      }
    }

    // Tag additions or removals
    if (body.addTag) {
      try {
        await prisma.leadTag.create({
          data: { leadId: id, tag: body.addTag },
        });
      } catch {
        // already exists
      }
    }
    if (body.removeTag) {
      await prisma.leadTag.deleteMany({
        where: { leadId: id, tag: body.removeTag },
      });
    }

    // Return the fresh lead
    const fullLead = await prisma.lead.findUnique({
      where: { id },
      include: {
        emails: true,
        people: true,
        tags: true,
        followUps: { orderBy: { stepNumber: 'asc' } },
        outreachMarks: true,
        notes: true,
        todos: true,
        activities: { orderBy: { createdAt: 'desc' } },
      },
    });

    return NextResponse.json(fullLead);
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.lead.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
