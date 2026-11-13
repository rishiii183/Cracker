import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'ws_sahil';
    const channel = searchParams.get('channel') || 'All channels';
    const mode = searchParams.get('mode') || 'worked'; // worked | added
    const range = searchParams.get('range') || 'This month';

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let startDate = startOfMonth;
    if (range === 'Today') startDate = startOfToday;
    else if (range === 'This week') startDate = startOfWeek;
    else if (range === 'Last 30 days') startDate = last30Days;
    else if (range === 'This year') startDate = new Date(now.getFullYear(), 0, 1);

    // KPI Cards:
    const leadsAddedToday = await prisma.lead.count({
      where: { workspaceId, dateAdded: { gte: startOfToday }, archived: false },
    });
    const leadsAddedThisWeek = await prisma.lead.count({
      where: { workspaceId, dateAdded: { gte: startOfWeek }, archived: false },
    });
    const totalActiveLeads = await prisma.lead.count({
      where: { workspaceId, archived: false },
    });
    const overdueFollowUps = await prisma.followUp.count({
      where: {
        sent: false,
        dueDate: { lt: startOfToday, not: null },
        lead: { workspaceId, archived: false },
      },
    });

    // Lead universe for rates
    const leadWhere: any = { workspaceId, archived: false };
    if (channel && channel !== 'All' && channel !== 'All channels') {
      leadWhere.channel = channel;
    }

    if (mode === 'added') {
      leadWhere.dateAdded = { gte: startDate };
    } else {
      // worked on in range
      leadWhere.OR = [
        { dateAdded: { gte: startDate } },
        { lastActivity: { gte: startDate } },
        { lastContacted: { gte: startDate } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where: leadWhere,
      include: {
        outreachMarks: true,
        emails: true,
      },
    });

    const totalLeads = leads.length || 1;

    // Rate calculations
    let outreachSentCount = 0;
    let emailSentCount = 0;
    let instagramSentCount = 0;
    let linkedinSentCount = 0;
    let emailViewCount = 0;
    let replyCount = 0;
    let positiveReplyCount = 0;
    let negativeReplyCount = 0;
    let loomSentCount = 0;
    let loomViewCount = 0;
    let meetingsBookedCount = 0;
    let clientClosedCount = 0;

    for (const lead of leads) {
      const marks = lead.outreachMarks || [];
      const hasEmailSent = marks.some((m) => m.type === 'Email sent' && m.done);
      const hasIgSent = marks.some((m) => m.type === 'Instagram message' && m.done);
      const hasLiSent = marks.some((m) => (m.type === 'LinkedIn message' || m.type === 'Connection request') && m.done);
      const hasAnySent = hasEmailSent || hasIgSent || hasLiSent || lead.stage !== 'New';

      if (hasAnySent) outreachSentCount++;
      if (hasEmailSent || (lead.channel === 'Email' && lead.stage !== 'New')) emailSentCount++;
      if (hasIgSent || (lead.channel === 'Instagram' && lead.stage !== 'New')) instagramSentCount++;
      if (hasLiSent || (lead.channel === 'LinkedIn' && lead.stage !== 'New')) linkedinSentCount++;

      if (marks.some((m) => m.type === 'Email viewed' && m.done)) emailViewCount++;

      const isReplied =
        marks.some((m) => m.type.includes('reply') && m.done) ||
        lead.stage === 'Replied' ||
        lead.stage === 'Resource sent';

      if (isReplied) {
        replyCount++;
        if (lead.stage === 'Resource sent' || lead.priority === 'High') {
          positiveReplyCount++;
        } else if (lead.stage === 'Not Interested') {
          negativeReplyCount++;
        }
      }

      if (marks.some((m) => m.type === 'Loom sent' && m.done)) loomSentCount++;
      if (marks.some((m) => m.type === 'Loom watched' && m.done)) loomViewCount++;
      if (marks.some((m) => m.type === 'Meeting booked' && m.done)) meetingsBookedCount++;
      if (marks.some((m) => m.type === 'Client closed' && m.done) || lead.status === 'won') clientClosedCount++;
    }

    const rates = [
      {
        id: 'outreach_sent',
        name: 'Outreach Sent Rate',
        rate: Math.round((outreachSentCount / totalLeads) * 100),
        numerator: outreachSentCount,
        denominator: totalLeads,
        format: `${Math.round((outreachSentCount / totalLeads) * 100)}%`,
        fraction: `${outreachSentCount}/${totalLeads}`,
      },
      {
        id: 'email_sent',
        name: 'Email Sent Rate',
        rate: Math.round((emailSentCount / totalLeads) * 100),
        numerator: emailSentCount,
        denominator: totalLeads,
        format: `${Math.round((emailSentCount / totalLeads) * 100)}%`,
        fraction: `${emailSentCount}/${totalLeads}`,
      },
      {
        id: 'instagram_sent',
        name: 'Instagram Sent Rate',
        rate: Math.round((instagramSentCount / totalLeads) * 100),
        numerator: instagramSentCount,
        denominator: totalLeads,
        format: `${Math.round((instagramSentCount / totalLeads) * 100)}%`,
        fraction: `${instagramSentCount}/${totalLeads}`,
      },
      {
        id: 'linkedin_sent',
        name: 'LinkedIn Sent Rate',
        rate: Math.round((linkedinSentCount / totalLeads) * 100),
        numerator: linkedinSentCount,
        denominator: totalLeads,
        format: `${Math.round((linkedinSentCount / totalLeads) * 100)}%`,
        fraction: `${linkedinSentCount}/${totalLeads}`,
      },
      {
        id: 'email_view',
        name: 'Email View Rate',
        rate: emailSentCount > 0 ? Math.round((emailViewCount / emailSentCount) * 100) : 0,
        numerator: emailViewCount,
        denominator: emailSentCount || 1,
        format: emailSentCount > 0 ? `${Math.round((emailViewCount / emailSentCount) * 100)}%` : '0%',
        fraction: `${emailViewCount}/${emailSentCount || 1}`,
      },
      {
        id: 'reply',
        name: 'Reply Rate',
        rate: outreachSentCount > 0 ? Math.round((replyCount / outreachSentCount) * 100) : 0,
        numerator: replyCount,
        denominator: outreachSentCount || 1,
        format: outreachSentCount > 0 ? `${Math.round((replyCount / outreachSentCount) * 100)}%` : '0%',
        fraction: `${replyCount}/${outreachSentCount || 1}`,
      },
      {
        id: 'positive_reply',
        name: 'Positive Reply Rate',
        rate: replyCount > 0 ? Math.round((positiveReplyCount / replyCount) * 100) : 0,
        numerator: positiveReplyCount,
        denominator: replyCount || 1,
        format: replyCount > 0 ? `${Math.round((positiveReplyCount / replyCount) * 100)}%` : '0%',
        fraction: `${positiveReplyCount}/${replyCount || 1}`,
      },
      {
        id: 'negative_reply',
        name: 'Negative Reply Rate',
        rate: replyCount > 0 ? Math.round((negativeReplyCount / replyCount) * 100) : 0,
        numerator: negativeReplyCount,
        denominator: replyCount || 1,
        format: replyCount > 0 ? `${Math.round((negativeReplyCount / replyCount) * 100)}%` : '0%',
        fraction: `${negativeReplyCount}/${replyCount || 1}`,
      },
      {
        id: 'loom_sent',
        name: 'Loom Sent Rate',
        rate: totalLeads > 0 ? Math.round((loomSentCount / totalLeads) * 100) : 0,
        numerator: loomSentCount,
        denominator: totalLeads,
        format: `${Math.round((loomSentCount / totalLeads) * 100)}%`,
        fraction: `${loomSentCount}/${totalLeads}`,
      },
      {
        id: 'loom_view',
        name: 'Loom View Rate',
        rate: loomSentCount > 0 ? Math.round((loomViewCount / loomSentCount) * 100) : 0,
        numerator: loomViewCount,
        denominator: loomSentCount || 1,
        format: '0%',
        fraction: 'no data yet',
      },
      {
        id: 'avg_loom_watch',
        name: 'Avg Loom Watch %',
        rate: 0,
        numerator: 0,
        denominator: 0,
        format: '0%',
        fraction: 'no data yet',
      },
      {
        id: 'meetings_booked',
        name: 'Meetings Booked Rate',
        rate: replyCount > 0 ? Math.round((meetingsBookedCount / replyCount) * 100) : 0,
        numerator: meetingsBookedCount,
        denominator: replyCount || 6,
        format: '0%',
        fraction: `${meetingsBookedCount}/${replyCount || 6}`,
      },
      {
        id: 'client_close',
        name: 'Client Close Rate',
        rate: 0,
        numerator: clientClosedCount,
        denominator: meetingsBookedCount || 1,
        format: '0%',
        fraction: 'no data yet',
      },
    ];

    return NextResponse.json({
      kpis: {
        leadsAddedToday,
        leadsAddedThisWeek,
        totalActiveLeads,
        overdueFollowUps,
      },
      rates,
      totalLeadsCount: totalLeads,
      dateRangeSummary: `${leads.length} leads added Nov 01, 2026 to Nov 13, 2026`,
    });
  } catch (error: any) {
    console.error('Error calculating rates:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
