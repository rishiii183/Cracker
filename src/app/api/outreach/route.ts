import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'ws_sahil';
    const channel = searchParams.get('channel') || 'All channels';
    const range = searchParams.get('range') || 'Last 30 days';

    // Channel summaries
    const emailSenders = [
      { name: 'sahil@infosized.co', status: 'Active', today: 0, inRange: 19 },
      { name: 'sahillx@infosized.co', status: 'Active', today: 0, inRange: 28 },
      { name: 'saudagar@infosized.co', status: 'Active', today: 0, inRange: 16 },
      { name: 'saudagarxx@infosized.co', status: 'Active', today: 0, inRange: 28 },
    ];

    const instagramSenders = [
      { name: 'sahilsaudagar', status: 'Active', today: 0, inRange: 56 },
      { name: 'Sahilsaudagarr', status: 'Active', today: 0, inRange: 18 },
      { name: 'Sahilsaudagarr', status: 'Active', today: 14, inRange: 91 },
    ];

    const linkedinSenders = [
      { name: 'Sahil saudagar', status: 'Active', today: 0, inRange: 2 },
    ];

    // Daily history over the past 30 days
    const dailyData = [
      { date: 'Nov 13, 2026', email: 0, instagram: 14, linkedin: 0, total: 14 },
      { date: 'Nov 12, 2026', email: 12, instagram: 42, linkedin: 1, total: 55 },
      { date: 'Nov 11, 2026', email: 18, instagram: 24, linkedin: 0, total: 42 },
      { date: 'Nov 10, 2026', email: 15, instagram: 30, linkedin: 1, total: 46 },
      { date: 'Nov 09, 2026', email: 22, instagram: 16, linkedin: 0, total: 38 },
      { date: 'Nov 08, 2026', email: 8, instagram: 20, linkedin: 0, total: 28 },
      { date: 'Nov 07, 2026', email: 14, instagram: 26, linkedin: 0, total: 40 },
    ];

    return NextResponse.json({
      channels: {
        email: {
          today: 0,
          manual: 0,
          target: null,
          senders: emailSenders,
        },
        instagram: {
          today: 14,
          manual: 0,
          target: null,
          senders: instagramSenders,
        },
        linkedin: {
          today: 0,
          manual: 0,
          target: null,
          senders: linkedinSenders,
        },
      },
      chart: {
        totalSent: 263,
        activeDays: 11,
        breakdown: [
          { name: 'Email', count: 89, percentage: 34, color: '#ef4444' },
          { name: 'Instagram', count: 172, percentage: 65, color: '#ec4899' },
          { name: 'LinkedIn', count: 2, percentage: 1, color: '#0ea5e9' },
        ],
      },
      streaks: {
        currentStreak: 4,
        bestStreak: 12,
        daysWithOutreach: '11 of 30',
        averagePerDay: '8.8',
      },
      dailyData,
    });
  } catch (error: any) {
    console.error('Error in outreach API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
