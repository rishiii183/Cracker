import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'ws_sahil';
    const ownerId = searchParams.get('ownerId');
    const search = searchParams.get('search') || '';

    const where: any = { workspaceId };

    if (ownerId && ownerId !== 'all') {
      where.assigneeId = ownerId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { lead: { companyName: { contains: search } } },
      ];
    }

    const todos = await prisma.todo.findMany({
      where,
      include: {
        assignee: true,
        lead: {
          select: {
            id: true,
            companyName: true,
            leadCode: true,
          },
        },
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const overdue = todos.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < startOfToday);
    const dueToday = todos.filter(
      (t) => !t.completed && t.dueDate && new Date(t.dueDate) >= startOfToday && new Date(t.dueDate) <= endOfToday
    );
    const upcoming = todos.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) > endOfToday);
    const noDueDate = todos.filter((t) => !t.completed && !t.dueDate);
    const completed = todos.filter((t) => t.completed);

    return NextResponse.json({
      all: todos,
      overdue,
      dueToday,
      upcoming,
      noDueDate,
      completed,
      counts: {
        overdue: overdue.length,
        dueToday: dueToday.length,
        upcoming: upcoming.length,
        noDueDate: noDueDate.length,
        completed: completed.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, dueDate, assigneeId, leadId, workspaceId, createdBy } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const todo = await prisma.todo.create({
      data: {
        workspaceId: workspaceId || 'ws_sahil',
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId || null,
        leadId: leadId || null,
        createdBy: createdBy || null,
        completed: false,
      },
      include: {
        assignee: true,
        lead: true,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error: any) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, completed, title, description, dueDate, assigneeId, comment, authorId } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (comment && authorId) {
      const newComment = await prisma.todoComment.create({
        data: {
          todoId: id,
          authorId,
          text: comment,
        },
        include: { author: true },
      });
      return NextResponse.json(newComment);
    }

    const updateData: any = {};
    if (completed !== undefined) {
      updateData.completed = completed;
      updateData.completedAt = completed ? new Date() : null;
    }
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId;

    const updated = await prisma.todo.update({
      where: { id },
      data: updateData,
      include: {
        assignee: true,
        lead: true,
        comments: { include: { author: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
