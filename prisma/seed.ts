import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.activityEntry.deleteMany();
  await prisma.todoComment.deleteMany();
  await prisma.todo.deleteMany();
  await prisma.outreachMark.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.leadTag.deleteMany();
  await prisma.leadEmail.deleteMany();
  await prisma.leadPerson.deleteMany();
  await prisma.leadNote.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.stage.deleteMany();
  await prisma.channelConfig.deleteMany();
  await prisma.outreachTemplate.deleteMany();
  await prisma.followUpTemplate.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  console.log('Creating workspace & users...');
  const workspace = await prisma.workspace.create({
    data: {
      id: 'ws_rishi',
      name: "Rishi's workspace",
    },
  });

  const sahil = await prisma.user.create({
    data: {
      id: 'u_sahil',
      name: 'Sahil',
      email: 'sahil@infosized.co',
      role: 'Member',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    },
  });

  const rishi = await prisma.user.create({
    data: {
      id: 'u_rishi',
      name: 'Rishi Ghosh',
      email: 'coderishi183@gmail.com',
      role: 'Admin',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
  });

  const varad = await prisma.user.create({
    data: {
      id: 'u_varad',
      name: 'Varad Nagre',
      email: 'varad@infosized.co',
      role: 'Member',
    },
  });

  await prisma.workspaceMember.createMany({
    data: [
      { workspaceId: workspace.id, userId: rishi.id, role: 'Admin' },
      { workspaceId: workspace.id, userId: sahil.id, role: 'Member' },
      { workspaceId: workspace.id, userId: varad.id, role: 'Member' },
    ],
  });

  console.log('Creating settings, stages, channels & templates...');
  await prisma.setting.create({
    data: {
      workspaceId: workspace.id,
      defaultLeadView: 'Table',
      defaultLandingModule: 'Lead Tracker',
      theme: 'light',
      googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
      notificationPreferences: JSON.stringify({
        followUpComplete: true,
        followUpMissed: false,
        followUpResponse: false,
        dailySummary: false,
        weeklySummary: false,
        weeklyGoalAchieved: false,
        weeklyGoalMissed: false,
        dailyOutreachStreak: false,
      }),
      sectionVisibility: JSON.stringify({
        company: true,
        people: true,
        emails: true,
        todos: true,
        research: true,
        emailLoom: true,
        followups: true,
        outreach: true,
        outcome: true,
        tags: true,
        activity: true,
        personalizedMessage: true,
      }),
    },
  });

  const stagesList = [
    { name: 'New', order: 1, color: '#3b82f6' },
    { name: 'Researching', order: 2, color: '#6366f1' },
    { name: 'Email Drafted', order: 3, color: '#ec4899' },
    { name: 'Contacted', order: 4, color: '#8b5cf6' },
    { name: 'Following up', order: 5, color: '#f59e0b' },
    { name: 'Replied', order: 6, color: '#10b981' },
    { name: 'Resource sent', order: 7, color: '#14b8a6' },
    { name: 'Not Interested', order: 8, color: '#64748b' },
    { name: 'Not in a priority', order: 9, color: '#94a3b8' },
  ];

  for (const st of stagesList) {
    await prisma.stage.create({
      data: {
        workspaceId: workspace.id,
        name: st.name,
        order: st.order,
        color: st.color,
      },
    });
  }

  for (const ch of ['Instagram', 'LinkedIn', 'Email']) {
    await prisma.channelConfig.create({
      data: {
        workspaceId: workspace.id,
        name: ch,
        enabled: true,
      },
    });
  }

  const defaultTags = [
    'High buyer intent',
    'Case Study',
    'IG bubble',
    'IG bubble + case study',
    'Email risky',
    'Online english',
    'Top gainer',
    'facebook group member',
  ];
  for (const t of defaultTags) {
    await prisma.tag.create({
      data: {
        workspaceId: workspace.id,
        name: t,
      },
    });
  }

  await prisma.outreachTemplate.createMany({
    data: [
      {
        workspaceId: workspace.id,
        name: 'Direct dm',
        channel: 'Instagram',
        messageTemplate: 'Hey {first_name}, loved your recent reel on scaling client acquisition! Quick question: are you taking on new clients this month?',
      },
      {
        workspaceId: workspace.id,
        name: 'Blown up',
        channel: 'Instagram',
        messageTemplate: 'Hey {first_name}, saw your post blew up recently. We actually helped a similar brand convert 40+ leads from that exact format. Would you be open to seeing the breakdown?',
      },
      {
        workspaceId: workspace.id,
        name: 'ig long videos',
        channel: 'Instagram',
        messageTemplate: 'Hey {first_name}, your long-form breakdowns are killer. We put together a 2-min Loom specifically reviewing how you can turn viewers into booked calls. Mind if I drop the link here?',
      },
    ],
  });

  await prisma.followUpTemplate.createMany({
    data: [
      {
        workspaceId: workspace.id,
        name: 'Followups',
        isDefault: true,
        stepsJson: JSON.stringify([
          { dayOffset: 1, channel: 'Email', name: 'Email FUP1' },
          { dayOffset: 2, channel: 'Email', name: 'Email FUP2' },
          { dayOffset: 3, channel: 'Email', name: 'Email FUP3' },
          { dayOffset: 4, channel: 'Email', name: 'Email FUP4' },
        ]),
      },
      {
        workspaceId: workspace.id,
        name: 'Ig follow ups',
        isDefault: false,
        stepsJson: JSON.stringify([
          { dayOffset: 1, channel: 'Instagram', name: 'Instagram ask for case study' },
          { dayOffset: 3, channel: 'Instagram', name: 'Instagram share case study' },
        ]),
      },
    ],
  });

  console.log('Creating active and overdue leads...');
  const baseDate = new Date('2026-11-13T00:18:00Z');

  // Leads matching screenshot stream & table
  const instagramLeads = [
    { code: 'LEAD-0830', handle: '@colinboyd', contact: '@colinboyd', sender: 'Sahilsaudagarr', date: new Date('2026-11-13T00:18:00Z') },
    { code: 'LEAD-0829', handle: '@colman_power_organic_fitness', contact: '@colman_power_organic_fitness', sender: 'Sahilsaudagarr', date: new Date('2026-11-13T00:18:00Z') },
    { code: 'LEAD-0828', handle: '@keithwalsh_walsh', contact: '@keithwalsh_walsh', sender: 'Sahilsaudagarr', date: new Date('2026-11-13T00:18:00Z') },
    { code: 'LEAD-0827', handle: '@richienorton_', contact: '@richienorton_', sender: 'Sahilsaudagarr', date: new Date('2026-11-13T00:18:00Z') },
    { code: 'LEAD-0826', handle: '@matthewwelsh', contact: '@matthewwelsh', sender: 'Sahilsaudagarr', date: new Date('2026-11-13T00:18:00Z') },
    { code: 'LEAD-0825', handle: '@coachkav', contact: '@coachkav', sender: 'Sahilsaudagarr', date: new Date('2026-11-13T00:18:00Z') },
    { code: 'LEAD-0824', handle: '@marthamazor_', contact: '@marthamazor_', sender: 'Sahilsaudagarr', date: new Date('2026-11-12T18:00:00Z') },
    { code: 'LEAD-0823', handle: '@tristansteckler', contact: '@tristansteckler', sender: 'Sahilsaudagar', date: new Date('2026-11-12T16:30:00Z') },
    { code: 'LEAD-0822', handle: '@pierceshowe', contact: '@pierceshowe', sender: 'Sahilsaudagar', date: new Date('2026-11-12T15:00:00Z') },
    { code: 'LEAD-0821', handle: '@officially_king', contact: '@officially_king', sender: 'Sahilsaudagarr', date: new Date('2026-11-12T14:00:00Z') },
    { code: 'LEAD-0820', handle: '@lana.k.social', contact: '@lana.k.social', sender: 'Sahilsaudagarr', date: new Date('2026-11-12T12:00:00Z') },
    { code: 'LEAD-0819', handle: '@realjoemccarthy', contact: '@realjoemccarthy', sender: 'Sahilsaudagarr', date: new Date('2026-11-12T10:00:00Z') },
  ];

  for (const item of instagramLeads) {
    const lead = await prisma.lead.create({
      data: {
        workspaceId: workspace.id,
        leadCode: item.code,
        companyName: item.handle,
        contactName: item.contact,
        channel: 'Instagram',
        stage: 'Contacted',
        status: 'new', // displays as "no reply"
        priority: 'Medium',
        addedBy: 'Varad Nagre',
        senderAccount: item.sender,
        dateAdded: item.date,
        lastContacted: item.date,
        lastActivity: item.date,
        tags: {
          create: [{ tag: 'High buyer intent' }],
        },
        followUps: {
          create: [
            {
              stepNumber: 1,
              dueDate: new Date('2026-11-16T10:00:00Z'),
              channel: 'Instagram',
              notes: 'Check if they replied to initial video pitch',
              sent: false,
            },
          ],
        },
        outreachMarks: {
          create: [
            { type: 'Instagram message', done: true, doneAt: item.date },
          ],
        },
        notes: {
          create: [
            { type: 'Research', text: 'Active fitness & lifestyle coach, high engagement on stories.' },
          ],
        },
      },
    });

    // Create activity entries
    await prisma.activityEntry.create({
      data: {
        workspaceId: workspace.id,
        leadId: lead.id,
        type: 'Lead created',
        category: 'Stage and status',
        text: `${lead.companyName} · Lead created`,
        authorName: 'Varad Nagre',
        createdAt: item.date,
      },
    });

    await prisma.activityEntry.create({
      data: {
        workspaceId: workspace.id,
        leadId: lead.id,
        type: 'Instagram message sent',
        category: 'Outreach',
        text: `${lead.companyName} · Instagram message sent`,
        authorName: 'Varad Nagre',
        createdAt: item.date,
      },
    });
  }

  // Overdue Follow-ups (matching Screenshot 1 & 8)
  const overdueLeads = [
    { code: 'LEAD-0801', handle: '@coachedbymillie', contact: 'Millie Vance', due: '2026-11-09T09:00:00Z' },
    { code: 'LEAD-0802', handle: '@alexagruber.ig', contact: 'Alexa Gruber', due: '2026-11-07T10:00:00Z' },
    { code: 'LEAD-0803', handle: '@loriharder', contact: 'Lori Harder', due: '2026-11-08T11:00:00Z' },
    { code: 'LEAD-0804', handle: '@johndarden', contact: 'John Darden', due: '2026-11-06T12:00:00Z' },
    { code: 'LEAD-0805', handle: '@tiamylowe', contact: 'Tia Mylowe', due: '2026-11-06T13:00:00Z' },
    { code: 'LEAD-0806', handle: '@drkatejones', contact: 'Dr. Kate Jones', due: '2026-11-06T14:00:00Z' },
    { code: 'LEAD-0807', handle: '@sandor_carl', contact: 'Carl Sandor', due: '2026-11-06T15:00:00Z' },
    { code: 'LEAD-0808', handle: '@rich_performance_nutritionist', contact: 'Rich Collins', due: '2026-11-06T16:00:00Z' },
    { code: 'LEAD-0809', handle: '@kelseybrennan', contact: 'Kelsey Brennan', due: '2026-11-06T17:00:00Z' },
    { code: 'LEAD-0810', handle: '@alexthiemefitness', contact: 'Alex Thieme', due: '2026-11-06T18:00:00Z' },
    { code: 'LEAD-0811', handle: '@shyambo', contact: 'Shyam Bo', due: '2026-11-06T19:00:00Z' },
  ];

  for (const item of overdueLeads) {
    await prisma.lead.create({
      data: {
        workspaceId: workspace.id,
        leadCode: item.code,
        companyName: item.handle,
        contactName: item.contact,
        channel: 'Instagram',
        stage: 'Contacted',
        status: 'new',
        priority: 'High',
        addedBy: 'Sahil',
        dateAdded: new Date(item.due),
        lastContacted: new Date(item.due),
        followUps: {
          create: [
            {
              stepNumber: 1,
              dueDate: new Date(item.due),
              channel: 'Instagram',
              notes: 'Overdue follow-up sequence step 1',
              sent: false,
            },
          ],
        },
      },
    });
  }

  // Email Leads matching screenshot 7
  const emailLeadsData = [
    {
      code: 'LEAD-0750',
      company: 'Janda Creative Group',
      contact: 'Michael Janda',
      email: 'michael@jandagroup.com',
      stage: 'Contacted',
      status: 'in_progress',
      sender: 'sahil@infosized.co',
      added: new Date('2026-11-10T11:00:00Z'),
    },
    {
      code: 'LEAD-0751',
      company: 'Galli Fitness & Nutrition',
      contact: 'Kate Galli',
      email: 'kate@gallifitness.co',
      stage: 'Researching',
      status: 'new',
      sender: 'sahil@infosized.co',
      added: new Date('2026-11-11T12:00:00Z'),
    },
    {
      code: 'LEAD-0752',
      company: 'NexusFlow AI',
      contact: 'Gabriel Fox',
      email: 'gabriel@nexusflow.ai',
      stage: 'Email Drafted',
      status: 'new',
      sender: 'saudagar@infosized.co',
      added: new Date('2026-11-12T09:00:00Z'),
    },
  ];

  for (const item of emailLeadsData) {
    const l = await prisma.lead.create({
      data: {
        workspaceId: workspace.id,
        leadCode: item.code,
        companyName: item.company,
        contactName: item.contact,
        channel: 'Email',
        stage: item.stage,
        status: item.status,
        senderAccount: item.sender,
        dateAdded: item.added,
        lastActivity: item.added,
        emails: {
          create: [
            {
              email: item.email,
              isMain: true,
              verificationStatus: 'Deliverable',
            },
          ],
        },
        people: {
          create: [
            {
              name: item.contact,
              titleRole: 'Founder / CEO',
              email: item.email,
              emailVerified: true,
              isMain: true,
            },
          ],
        },
        tags: {
          create: [{ tag: 'Email risky' }],
        },
        outreachMarks: {
          create: [
            { type: 'Email sent', done: true, doneAt: item.added },
            { type: 'Email viewed', done: true, doneAt: item.added },
          ],
        },
      },
    });

    await prisma.activityEntry.create({
      data: {
        workspaceId: workspace.id,
        leadId: l.id,
        type: 'Email sent',
        category: 'Outreach',
        text: `${item.company} · Email sent to ${item.email}`,
        authorName: 'Sahil',
        createdAt: item.added,
      },
    });
  }

  // LinkedIn Leads matching screenshot 6
  const linkedinLeadsData = [
    {
      code: 'LEAD-0740',
      company: 'ScaleGrowth Studio',
      contact: 'Alex Morgan',
      linkedin: 'https://www.linkedin.com/in/alex-morgan',
      stage: 'Contacted',
      status: 'in_progress',
      added: new Date('2026-11-09T14:00:00Z'),
    },
    {
      code: 'LEAD-0741',
      company: 'Chen Capital Partners',
      contact: 'David Chen',
      linkedin: 'https://www.linkedin.com/in/david-chen',
      stage: 'New',
      status: 'new',
      added: new Date('2026-11-12T15:00:00Z'),
    },
  ];

  for (const item of linkedinLeadsData) {
    await prisma.lead.create({
      data: {
        workspaceId: workspace.id,
        leadCode: item.code,
        companyName: item.company,
        contactName: item.contact,
        website: item.linkedin,
        channel: 'LinkedIn',
        stage: item.stage,
        status: item.status,
        dateAdded: item.added,
        lastActivity: item.added,
        people: {
          create: [
            {
              name: item.contact,
              titleRole: 'Partner',
              linkedin: item.linkedin,
              isMain: true,
            },
          ],
        },
        outreachMarks: {
          create: [
            { type: 'Connection request', done: true, doneAt: item.added },
            { type: 'LinkedIn message', done: true, doneAt: item.added },
          ],
        },
      },
    });
  }

  console.log('Creating archived leads (matching Screenshot 13)...');
  const archivedLeads = [
    { code: 'LEAD-0565', company: 'Andy Grant', stage: 'Researching', country: 'United States', added: '2026-10-29T10:00:00Z', archived: '2026-11-08T10:00:00Z' },
    { code: 'LEAD-0593', company: 'rebadamyltzchak', stage: 'Not in a priority', country: '-', added: '2026-10-31T10:00:00Z', archived: '2026-11-06T10:00:00Z' },
    { code: 'LEAD-0458', company: 'John Seaman', stage: 'Not in a priority', country: 'United States', added: '2026-10-26T10:00:00Z', archived: '2026-11-05T10:00:00Z' },
    { code: 'LEAD-0442', company: 'Jaime Alfaro', stage: 'Not in a priority', country: 'United States', added: '2026-10-26T10:00:00Z', archived: '2026-11-05T10:00:00Z' },
    { code: 'LEAD-0375', company: '@play_schemas', stage: 'Resource sent', country: '-', added: '2026-10-05T10:00:00Z', archived: '2026-11-05T10:00:00Z' },
    { code: 'LEAD-0451', company: 'Martin Astorga', stage: 'Researching', country: 'United States', added: '2026-10-26T10:00:00Z', archived: '2026-11-03T10:00:00Z' },
    { code: 'LEAD-0553', company: 'Dr. Kayvan Khalilzadeh', stage: 'Researching', country: 'Canada', added: '2026-10-29T10:00:00Z', archived: '2026-11-03T10:00:00Z' },
    { code: 'LEAD-0494', company: 'Reuben Brooks', stage: 'Researching', country: '-', added: '2026-10-27T10:00:00Z', archived: '2026-11-03T10:00:00Z' },
    { code: 'LEAD-0495', company: 'karttondennis', stage: 'Researching', country: 'United States', added: '2026-10-27T10:00:00Z', archived: '2026-11-03T10:00:00Z' },
    { code: 'LEAD-0496', company: 'Ana Klein', stage: 'Researching', country: 'United States', added: '2026-10-27T10:00:00Z', archived: '2026-11-03T10:00:00Z' },
    { code: 'LEAD-0497', company: 'ryanzolin', stage: 'Researching', country: 'United States', added: '2026-10-27T10:00:00Z', archived: '2026-11-03T10:00:00Z' },
    { code: 'LEAD-0599', company: 'Brandon Day', stage: 'Researching', country: 'United States', added: '2026-10-31T10:00:00Z', archived: '2026-11-02T10:00:00Z' },
    { code: 'LEAD-0587', company: 'Laura How', stage: 'Researching', country: 'United Kingdom', added: '2026-10-30T10:00:00Z', archived: '2026-11-02T10:00:00Z' },
    { code: 'LEAD-0607', company: 'Nicole Moore', stage: 'Researching', country: 'United States', added: '2026-10-31T10:00:00Z', archived: '2026-11-02T10:00:00Z' },
    { code: 'LEAD-0440', company: 'Untitled lead', stage: 'New', country: '-', added: '2026-10-25T10:00:00Z', archived: '2026-10-26T10:00:00Z' },
  ];

  for (const item of archivedLeads) {
    await prisma.lead.create({
      data: {
        workspaceId: workspace.id,
        leadCode: item.code,
        companyName: item.company,
        stage: item.stage,
        country: item.country === '-' ? null : item.country,
        archived: true,
        archivedAt: new Date(item.archived),
        dateAdded: new Date(item.added),
      },
    });
  }

  console.log('Creating To-dos (matching Screenshot 9)...');
  const todosData = [
    {
      title: 'his verified personal mail is not found anywhere',
      description: 'Checked Hunter, Apollo, and Snov. Need alternative verification.',
      leadName: 'Kia Ghasem',
      owner: sahil.id,
    },
    {
      title: 'I got 5-6 emails from ContactOut but all his emails are risky or undeliverable so please look at it.',
      description: 'Run through NeverBounce or manual SMTP ping.',
      leadName: 'Michael Janda',
      owner: sahil.id,
    },
    {
      title: 'her 2 email is not verified cause limits exhausted',
      description: 'Account plan refresh scheduled for tomorrow.',
      leadName: 'Kate Galli',
      owner: rishi.id,
    },
    {
      title: "I could not find his LinkedIn and his personal email so I'm not sure he is a priority or not. I'm keeping him in low",
      description: 'Low buyer intent until verified.',
      leadName: 'Nexal Media | AI Dropshipping',
      owner: sahil.id,
    },
  ];

  for (const t of todosData) {
    await prisma.todo.create({
      data: {
        workspaceId: workspace.id,
        title: t.title,
        description: t.description,
        assigneeId: t.owner,
        createdBy: sahil.id,
        completed: false,
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

