import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'ws_sahil';

    // Parallel fetch for overview and control data
    const [
      workspaces,
      users,
      totalLeads,
      leadsByStage,
      leadsByChannel,
      totalActivities,
      stages,
      channels,
      settings,
      recentLeads,
    ] = await Promise.all([
      prisma.workspace.findMany({
        include: {
          _count: {
            select: { leads: true, members: true },
          },
        },
      }),
      prisma.user.findMany({
        include: {
          memberships: {
            include: { workspace: true },
          },
          _count: {
            select: { todosAssigned: true, activityLogs: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.lead.count({ where: { workspaceId } }),
      prisma.lead.groupBy({
        by: ['stage'],
        where: { workspaceId },
        _count: { id: true },
      }),
      prisma.lead.groupBy({
        by: ['channel'],
        where: { workspaceId },
        _count: { id: true },
      }),
      prisma.activityEntry.count({ where: { workspaceId } }),
      prisma.stage.findMany({ where: { workspaceId }, orderBy: { order: 'asc' } }),
      prisma.channelConfig.findMany({ where: { workspaceId } }),
      prisma.setting.findUnique({ where: { workspaceId } }),
      prisma.lead.findMany({
        where: { workspaceId },
        take: 10,
        orderBy: { lastActivity: 'desc' },
        select: {
          id: true,
          leadCode: true,
          companyName: true,
          contactName: true,
          channel: true,
          stage: true,
          priority: true,
          lastActivity: true,
        },
      }),
    ]);

    const activeWorkspace = workspaces.find((w) => w.id === workspaceId) || workspaces[0];

    return NextResponse.json({
      activeWorkspace,
      workspaces,
      users,
      stats: {
        totalLeads,
        totalActivities,
        leadsByStage: leadsByStage.map((s) => ({ stage: s.stage, count: s._count.id })),
        leadsByChannel: leadsByChannel.map((c) => ({ channel: c.channel, count: c._count.id })),
      },
      stages,
      channels,
      settings,
      recentLeads,
    });
  } catch (error: any) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, workspaceId = 'ws_sahil' } = body;

    // Update User Role
    if (action === 'updateUserRole') {
      const { userId, role } = body;
      if (!userId || !role) {
        return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { role },
      });

      await prisma.workspaceMember.updateMany({
        where: { userId, workspaceId },
        data: { role },
      });

      return NextResponse.json({ success: true, message: `Role updated to ${role}` });
    }

    // Rename Workspace
    if (action === 'updateWorkspaceName') {
      const { name } = body;
      if (!name) {
        return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });
      }

      const updated = await prisma.workspace.update({
        where: { id: workspaceId },
        data: { name },
      });

      return NextResponse.json({ success: true, workspace: updated });
    }

    // Bulk Update Leads
    if (action === 'bulkUpdateLeads') {
      const { leadIds, updates } = body;
      if (!Array.isArray(leadIds) || leadIds.length === 0) {
        return NextResponse.json({ error: 'No lead IDs provided' }, { status: 400 });
      }

      const count = await prisma.lead.updateMany({
        where: {
          id: { in: leadIds },
          workspaceId,
        },
        data: {
          stage: updates.stage !== undefined ? updates.stage : undefined,
          priority: updates.priority !== undefined ? updates.priority : undefined,
          archived: updates.archived !== undefined ? updates.archived : undefined,
          senderAccount: updates.senderAccount !== undefined ? updates.senderAccount : undefined,
        },
      });

      return NextResponse.json({ success: true, updatedCount: count.count });
    }

    // Update Stage
    if (action === 'updateStage') {
      const { stageId, name, color, order } = body;
      const updated = await prisma.stage.update({
        where: { id: stageId },
        data: {
          name: name !== undefined ? name : undefined,
          color: color !== undefined ? color : undefined,
          order: order !== undefined ? order : undefined,
        },
      });
      return NextResponse.json({ success: true, stage: updated });
    }

    return NextResponse.json({ error: 'Unknown PATCH action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in admin PATCH:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, workspaceId = 'ws_sahil' } = body;

    // Create New User
    if (action === 'createUser') {
      const { name, email, role = 'Member', avatarUrl } = body;
      if (!name || !email) {
        return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
      }

      // Check if user already exists
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            role,
            avatarUrl: avatarUrl || null,
          },
        });
      }

      // Add to workspace membership
      await prisma.workspaceMember.upsert({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId: user.id,
          },
        },
        update: { role },
        create: {
          workspaceId,
          userId: user.id,
          role,
        },
      });

      return NextResponse.json({ success: true, user });
    }

    // Delete User
    if (action === 'deleteUser') {
      const { userId } = body;
      if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }

      // Remove from workspace
      await prisma.workspaceMember.deleteMany({
        where: { userId, workspaceId },
      });

      return NextResponse.json({ success: true, message: 'User removed from workspace' });
    }

    // Create New Workspace
    if (action === 'createWorkspace') {
      const { name, ownerId } = body;
      if (!name) {
        return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });
      }

      const newWs = await prisma.workspace.create({
        data: {
          name,
        },
      });

      if (ownerId) {
        await prisma.workspaceMember.create({
          data: {
            workspaceId: newWs.id,
            userId: ownerId,
            role: 'Admin',
          },
        });
      }

      return NextResponse.json({ success: true, workspace: newWs });
    }

    // Bulk Delete Leads
    if (action === 'bulkDeleteLeads') {
      const { leadIds } = body;
      if (!Array.isArray(leadIds) || leadIds.length === 0) {
        return NextResponse.json({ error: 'No lead IDs provided' }, { status: 400 });
      }

      // Delete dependencies
      await prisma.activityEntry.deleteMany({ where: { leadId: { in: leadIds } } });
      await prisma.followUp.deleteMany({ where: { leadId: { in: leadIds } } });
      await prisma.outreachMark.deleteMany({ where: { leadId: { in: leadIds } } });
      await prisma.leadTag.deleteMany({ where: { leadId: { in: leadIds } } });
      await prisma.leadEmail.deleteMany({ where: { leadId: { in: leadIds } } });
      await prisma.leadPerson.deleteMany({ where: { leadId: { in: leadIds } } });
      await prisma.leadNote.deleteMany({ where: { leadId: { in: leadIds } } });
      await prisma.todo.deleteMany({ where: { leadId: { in: leadIds } } });

      const res = await prisma.lead.deleteMany({
        where: {
          id: { in: leadIds },
          workspaceId,
        },
      });

      return NextResponse.json({ success: true, deletedCount: res.count });
    }

    // Create Stage
    if (action === 'createStage') {
      const { name, color, order } = body;
      if (!name) {
        return NextResponse.json({ error: 'Stage name is required' }, { status: 400 });
      }
      const stage = await prisma.stage.create({
        data: {
          workspaceId,
          name,
          color: color || '#6366f1',
          order: order || 99,
        },
      });
      return NextResponse.json({ success: true, stage });
    }

    // Toggle Channel
    if (action === 'toggleChannel') {
      const { channelName, enabled } = body;
      const channel = await prisma.channelConfig.upsert({
        where: {
          workspaceId_name: {
            workspaceId,
            name: channelName,
          },
        },
        update: { enabled },
        create: {
          workspaceId,
          name: channelName,
          enabled,
        },
      });
      return NextResponse.json({ success: true, channel });
    }

    return NextResponse.json({ error: 'Unknown POST action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in admin POST:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
