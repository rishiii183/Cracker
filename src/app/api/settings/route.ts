import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'ws_sahil';

    const [settings, stages, channels, outreachTemplates, followUpTemplates, members] =
      await Promise.all([
        prisma.setting.findUnique({ where: { workspaceId } }),
        prisma.stage.findMany({ where: { workspaceId }, orderBy: { order: 'asc' } }),
        prisma.channelConfig.findMany({ where: { workspaceId } }),
        prisma.outreachTemplate.findMany({ where: { workspaceId } }),
        prisma.followUpTemplate.findMany({ where: { workspaceId } }),
        prisma.workspaceMember.findMany({
          where: { workspaceId },
          include: { user: true },
        }),
      ]);

    return NextResponse.json({
      settings,
      stages,
      channels,
      outreachTemplates,
      followUpTemplates,
      members,
    });
  } catch (error: any) {
    console.error('Error in settings API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const workspaceId = body.workspaceId || 'ws_sahil';

    if (body.settings) {
      const {
        defaultLeadView,
        defaultLandingModule,
        theme,
        googleSheetUrl,
        googleDriveFolder,
        notificationPreferences,
        sectionVisibility,
      } = body.settings;

      const updated = await prisma.setting.update({
        where: { workspaceId },
        data: {
          defaultLeadView: defaultLeadView !== undefined ? defaultLeadView : undefined,
          defaultLandingModule: defaultLandingModule !== undefined ? defaultLandingModule : undefined,
          theme: theme !== undefined ? theme : undefined,
          googleSheetUrl: googleSheetUrl !== undefined ? googleSheetUrl : undefined,
          googleDriveFolder: googleDriveFolder !== undefined ? googleDriveFolder : undefined,
          notificationPreferences:
            notificationPreferences !== undefined ? JSON.stringify(notificationPreferences) : undefined,
          sectionVisibility:
            sectionVisibility !== undefined ? JSON.stringify(sectionVisibility) : undefined,
        },
      });

      return NextResponse.json(updated);
    }

    if (body.createTemplate) {
      const { name, channel, messageTemplate } = body.createTemplate;
      const t = await prisma.outreachTemplate.create({
        data: {
          workspaceId,
          name,
          channel,
          messageTemplate,
        },
      });
      return NextResponse.json(t);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, confirmationText, workspaceId } = body;
    const wsId = workspaceId || 'ws_sahil';

    if (action === 'clearSampleData') {
      if (confirmationText !== 'DELETE') {
        return NextResponse.json({ error: 'Please type DELETE to confirm' }, { status: 400 });
      }
      await prisma.activityEntry.deleteMany({ where: { workspaceId: wsId } });
      await prisma.followUp.deleteMany({ where: { lead: { workspaceId: wsId } } });
      await prisma.outreachMark.deleteMany({ where: { lead: { workspaceId: wsId } } });
      await prisma.leadTag.deleteMany({ where: { lead: { workspaceId: wsId } } });
      await prisma.leadEmail.deleteMany({ where: { lead: { workspaceId: wsId } } });
      await prisma.leadPerson.deleteMany({ where: { lead: { workspaceId: wsId } } });
      await prisma.leadNote.deleteMany({ where: { lead: { workspaceId: wsId } } });
      await prisma.lead.deleteMany({ where: { workspaceId: wsId } });
      await prisma.todo.deleteMany({ where: { workspaceId: wsId } });

      return NextResponse.json({ success: true, message: 'Sample data cleared successfully' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in settings action:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
