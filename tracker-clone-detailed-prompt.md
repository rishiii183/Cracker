# Build My Own Lead Tracker — Detailed Build Prompt

Use this prompt in full, in one go, to build a complete working lead tracker web app. Do not skip a section. Build the real app with real data, real filters, real navigation, and real persistence, not a mockup with fake placeholder screens.

## 1. Product goal

Build a lead tracker for a small outreach team. A user adds leads from Email, Instagram, and LinkedIn, sends a first outreach message, then works a follow up ladder until the lead replies, books a meeting, or closes as a client. The app must make it obvious every day what is overdue, what is due today, and what is coming next.

Name the product something new, not the name of the product this was mapped from. Use a clean modern SaaS look, light and dark mode, left sidebar navigation, and a top bar.

## 2. Tech to use

Use Next.js with TypeScript and Tailwind CSS for the frontend, Supabase with Postgres for the database and auth, and Prisma or Supabase tables for the data model. Use Google sign in and email plus password sign in. Keep all data in the database, not in local storage only. Make the app responsive, fast, and usable on desktop first, mobile second.

## 3. Users, workspaces, and roles

- Workspaces: a user can belong to one or more workspaces. Show a workspace switcher at the top of the sidebar, with the current workspace checked and a New workspace option.
- Roles: Admin and Member.
- Member can add leads, edit leads, add follow ups, to dos, and activity, and use all Lead Tracker pages.
- Admin can also manage Stages, Channels, Users, Saved import mappings, and Import / Export. A Member who opens Import / Export must see Access denied, with the text You do not have access to this page. Ask an admin to grant it in Settings, and a Back to Tracker button.
- Profile menu at the bottom of the sidebar: Account settings, My to dos, Copy my user ID, Copy API key, Keyboard shortcuts, Log out.
- Footer in the sidebar: Tracker Version 1.6.5 style version label, for example App Version 1.0.0.
- Show the signed in user's role, for example Member, in the workspace.

## 4. Global shell

- Left sidebar, collapsible, with Expand sidebar and Collapse sidebar controls.
- Sidebar sections:
  - LEAD TRACKER: Dashboard, Leads (expandable, with sub pages All Leads, Instagram, LinkedIn, Email), Follow ups, To dos, Outreach Tracker
  - OPERATIONS AND LOGS: Activity, Ledger, Archive
- Top bar on every page: breadcrumb Lead Tracker > Page name, a global search box Search leads, pages and actions with Cmd K / Ctrl K, a Notifications bell, a Light / Dark theme toggle called Switch to dark, and a plan label.
- Command palette, opened with Cmd K / Ctrl K: search box Search leads, actions, pages, sections for Quick actions, Suggested pages, Search results, and Leads nearby grouped by lead code, stage, channel, and follow up date.
- Quick actions in the palette: Add a lead, Add a to do, Toggle dark mode, Open notifications, Collapse sidebar, Go to Dashboard.
- Suggested pages in the palette: Dashboard, Leads, Follow ups, To dos, Outreach Tracker, Activity, Ledger, Archive, Import / Export, Records, Pipeline, Revenue, Invoices, Settings. Records, Pipeline, Revenue, and Invoices are CRM module pages, include them as pages in the palette even if the CRM module itself is a later phase.
- Keyboard shortcuts: Cmd K / Ctrl K for search, Alt T for notifications, Ctrl / Cmd 1 for Lead Tracker.
- Notifications: a bell with a count, listing mentions in to do comments and to do assignments.

## 5. Dashboard

URL: /lt/dashboard
Purpose: daily overview, outreach rates, and follow up triage. There is no stage chart on this page. The funnel is a grid of rate cards.

- Red alert banner at the top when follow ups are overdue, for example 51 follow ups are overdue, followed by three lead links and and 48 more are waiting on you, with a Review now button that goes to Follow ups.
- Four KPI cards: Leads Added Today, Leads Added This Week, Total Active Leads, Overdue Follow Ups, with the overdue number in red.
- Open Google Sheet link at the top right, opening the connected sheet in a new tab.
- Date range buttons: Today, This week, This month (default), Last 30 days, Custom. Show a right aligned summary, for example 113 leads added Nov 01, 2026 to Nov 11, 2026.
- Custom date picker: month and year comboboxes, years 2020 to 2035, previous and next month arrows, a day grid, presets Today, Yesterday, This week, Last week, This month, Last 30 days, Year to date, a range label, Cancel and Apply. Applying is a view filter only.
- Outreach rates section, with a link How these rates are calculated.
- Radio group Which leads to count: Worked on in range (checked, meaning leads added, contacted, or that viewed, replied, booked or closed in the date range) versus Added in range (only leads whose date added is in the date range).
- Channel tabs: All channels, Email, Instagram, LinkedIn.
- Customize button opening a dialog listing every rate with a switch. Text: Toggle the rates you want visible on Dashboard and channel pages. Saved per device, per channel. Each rate card also has its own Hide rate button.
- Each rate card shows a percentage, a fraction, for example 180/182, or no data yet where applicable, and a progress bar.
- The 13 rate cards, in this exact order: Outreach Sent Rate, Email Sent Rate, Instagram Sent Rate, LinkedIn Sent Rate, Email View Rate, Reply Rate, Positive Reply Rate, Negative Reply Rate, Loom Sent Rate, Loom View Rate, Avg Loom Watch %, Meetings Booked Rate, Client Close Rate.
- Three collapsible follow up lists, each row is a lead link showing avatar initial, lead identifier, stage chip, channel, and due date, clicking opens the lead: Overdue (expanded by default), Due today, Upcoming (7 days). Due today empty state: Nothing here. No follow ups require your attention, and You are all clear for today.

## 6. Leads, All Leads

URL: /lt/leads
Purpose: the master lead list.

- Header: All Leads, lead count, for example 331 leads and Showing 1 to 50 of 331 leads, Add lead button, Bulk edit button (opens selection mode, Cancel to exit), and view toggles: Table (default), Columns, Cards, Calendar. The account Default lead view setting offers Table, Columns, and Cards.
- Table search: Search leads, searching names, companies, emails, handles, IDs, and tags. A How Archive works link at the right.
- Filters row, all must work and combine: Stage, Country, Channel, Sender, Status, Added By, Tag, Has Replied, Email Check, Loom Sent, Date Added with Pick date range, When with range, Sort By with direction.
  - Stage options: All, New, Researching, Email Drafted, Contacted, Following up, Replied, Resource sent, Not Interested, Not in a priority.
  - Channel options: All, Email, Instagram, LinkedIn, with workspace wide counts in the dropdown.
  - Status options, shown in raw stored form: All, new, in_progress, on_hold, won, lost.
  - Has Replied: All, Yes, No. Loom Sent: All, Yes, No.
  - Email Check: All, At least one verified, All emails verified, Some verified, some not, None verified yet, No email.
  - When field: Last activity, Last contacted, Follow up date. Range: Any time, Today, Last 7 days, Last 30 days, More than 30 days ago, Custom dates.
  - Sort By field: Last activity, Last contacted, Follow up date, Date added, Added by, Company name. Direction control, default Newest first.
- Per page selector: 50, 100, 150, 200, 300, 400, 500, Custom.
- Group by selector: No grouping, Country, Stage, Channel, Status, Follow up bucket, Date added, Added by, Tag, Sender account. Group headers show the group name and a count and can collapse.
- Table columns: row checkbox, Company (avatar plus name link plus lead code), Contact (name, country, channel), Emails (list of addresses with verification status), Country, Stage, Status, Channel, Added date, Added By, Last Contacted, Follow up (next follow up date or None), Activity (last activity date and time).
- Row chips: stage chips, status text such as no reply, channel label, Next: date, follow up counters such as Follow up 2, email status such as 3/3 verified, tags such as Email risky, High buyer intent, Online english, and a No follow up state.
- Pagination: Previous, numbered pages, Next, plus the per page selector.
- Clicking a lead name opens a right side Lead details slide over, not a new page. See section 8.
- Bulk selection, header checkbox or row checkboxes, shows a floating bar with the selected count and actions: Export selected, Message selected (templates), Change stage, Change status, Set follow up date, Add tags, Archive selected.
  - Change stage menu: New, Researching, Email Drafted (also called Email draft), Contacted, Following up, Replied, Resource sent, Not Interested, Not in a priority.
  - Change status menu: new, in_progress, on_hold, won, lost.
- Columns view, Kanban: one column per stage in the same 9 stage order, column header with a count badge, Add lead at the bottom of each column. Cards must actually load in this view.
- Cards view: a grid of lead cards. Each card: checkbox, stage chip, status chip, name link plus open in new tab icon, country and channel line, email verification summary, for example 3/3 verified green or 1/2 verified amber, a Sent date chip, a truncated Personalized Draft preview, Website, Company LinkedIn, Instagram, and YouTube icons, tag chips, Follow up 2 and Next date, and a footer Added date by person, Activity date by person.
- Calendar view: month grid with Prev, Today, Next, labelled By last activity (change in Filters, Sort by).

### 6a. Add lead behaviour, important

Do NOT auto create a blank lead when the Add lead button is clicked. Show a blank add form first, and only create the lead when the user clicks Save or Add Lead. The original product auto creates an Untitled lead on opening /lt/leads/new, which is a bug to avoid.

### 6b. Channel rapid entry pages

Sidebar sub items under Leads are separate rapid entry pages, each with its own add form on top, the same date range controls, its own rate cards, and a This Week's Stream table.

Instagram, URL /lt/leads/instagram:
- Form fields: Instagram URL, required, placeholder https://instagram.com/username or @username; Username / Contact Name, note Filled from the URL if blank; Sent From Account combobox, default None; Add tags button; Outreach Sent toggle No / Yes; Outreach Seen / Replied toggle; Outreach Template combobox, default No template, templates Direct dm, Blown up, ig long videos; Next Follow up, None, +2 days, +3 days, +7 days, Custom Date; Follow up Template combobox, Select a follow up template; hint Press Enter to add; Add Lead button.
- Rate cards, 9: Sent, Reply, Positive, Negative, Loom Sent, Loom View, Avg Loom Watch, Meetings Booked, Client Close.
- Stream columns: Link (Open profile link), Lead (lead link plus code plus options), Outreach (Click to change, Sent toggle, reply toggle, Message button opening templates), Tags (Add tags button), Follow up (date button plus Clear date on hover).

LinkedIn, URL /lt/leads/linkedin:
- Form fields: LinkedIn Profile URL, required, placeholder https://www.linkedin.com/in/name; Contact Name Optional; Company Name Optional; Sent From Account; Add tags; Connection Request Sent toggle; Message Sent toggle; Replied toggle; Outreach Template, no LinkedIn templates exist by default, the field links to Add outreach templates in Settings; Next Follow up, same options; Follow up Template; Add Lead button.
- Rate cards, 10: Connection Request Rate, LinkedIn Sent Rate, Reply Rate, Positive, Negative, Loom Sent, Loom View, Avg Loom Watch, Meetings Booked, Client Close.

Email, URL /lt/leads/email:
- Form fields: Contact Email, required, placeholder name@company.com; Contact Name Optional; Company Website / Name Optional; Sender Account; Add tags; Email Sent toggle; Email Replied toggle; Outreach Template, no Email templates exist by default, links to Settings; Next Follow up, same options; Follow up Template; Add Lead button.
- Rate cards, 10: Email Sent, View, Reply, Positive, Negative, Loom Sent, Loom View, Avg Watch, Meetings Booked, Client Close.

All three rapid entry pages share the same date range presets Today, This week, This month, Last 30 days, Last 3 months, This year, Custom, and Customize, rate cards each showing a percentage, a fraction, and a progress bar, with no data yet where applicable, and a weekly stream table.

## 7. Lead detail, full page and slide over

URL: /lt/leads/[id]
- Slide over, from the Leads table: header with lead code, for example LEAD-0443, stage chip, Open full page, Close (Esc). Body: lead name, country, status, priority, Follow up 2, Next follow up date, Step 2 of 5 with a follow up preview. Definition list: Channel, Sent from (sender account plus Active), Date added (date plus by person), Last contacted (date and time), Contacted via (channel). How to Reach: each contact method, Email x3, LinkedIn, Instagram, Website, with Deliverable and other badges and a Copy button. Outreach So Far 1/12: 12 checkbox chips (Connection request, LinkedIn message, LinkedIn reply, Instagram message, Instagram reply, Email sent, Email viewed, Email reply, Loom sent, Loom watched, Meeting booked, Client closed), each Not yet or with a date. Message: a preview with a Copy button. Notes: Research and Additional previews. To dos: 0 open, an Add a to do textbox with Add button, @ to mention, Due date button, assignee picker. Activity: dated entries with author and time. Footer buttons: New tab, Edit full lead. Clicking an email opens a per email popover with History and Copy Email.
- Full detail page, same content, full width: editable lead name textbox at the top and LEAD-XXXX code link; three header comboboxes: Stage (9 options, section 6), Status (raw: new, in_progress, on_hold, won, lost), Priority (Low, Medium, High, default Medium); Push to CRM button; an Archive button with trash icon; Created date and time, Last activity date and time, Not checked yet with a Mark checked button; Cards / Tabs view toggle; Customize button; One column switch; Hide empty switch, on by default; an Export button in the header area.
- Sections, Cards view, in this order:
  1. Company: Name textbox, Website textbox, Country combobox, Location textbox, Industry textbox, Employee Count textbox, Revenue textbox, Founded, Pick year.
  2. People: Name, Title / Role, LinkedIn combobox, Email with Verification badge, Add Person menu with buttons Person from company, Import emails, Add manually. List of people, each name, role, email verification badge, and per person Make main, Remove, and Email history. Add person button.
  3. Emails: per email row, with Main badge, Copy icon, Email history, Make main, Remove.
  4. To dos: heading with open count, Add a to do input with Add button, and per to do checkbox, owner, and Follow up with the lead, Comments, Edit, Delete actions.
  5. Research and notes: Notes textbox and Research textbox, with copy and paste icons.
  6. Email / Loom: Loom link textbox, Date textbox (pick date), Subject textbox, Make checked button per outreach row, How to use this area helper text.
  7. Follow ups, #1 to #5: each with a numbered heading, Date control, Channel combobox, Template combobox, a checkbox Mark this step sent, Delete button, Notes textbox. Quick follow up +2 days, +3 days, +7 days buttons, Add follow up button, Apply template (disabled until a template is chosen), Check spam, Stop follow ups, Clear all.
  8. Outreach: the 12 outreach checkboxes listed above, each clickable to mark done, with dates where done.
  9. Outcome: Meeting booked button, its absence note, and Client closed button.
  10. Tags: existing tag chips each with an x to remove, an Add tags textbox plus Add button, and suggested tags: Email risky, Follow up sent, Online, Top gainer, facebook group member, High buyer intent, IG bubble, Case Study, IG bubble + case study.
  11. Activity: field level activity entries (stage, status, and follow up changes, emails sent and viewed, replies, notes edited, outreach marks, tags added, priority changes, to do completions), each with date and time, author, and per entry Edit and Delete buttons, plus an Add activity inline form (see section 10).
  12. Reach out, Personalized message: heading Personalized message, four message type buttons (Instagram DM, LinkedIn DM, Email Draft, Text Message), Angle textbox (How the person is doing it), an Outreach template combobox (for example Direct dm, Blown up, ig long videos) that fills the message, Subject line textbox, Message textbox with placeholder Type your message, a Copy button, an Angle button, a Check spam link, and a note Microsoft Outlook and many recipients test it here, plus a word and character count and a What you need note.
- Which sections appear is configurable: Customize on the detail page opens Section Visibility with toggles for Company, Emails, WhatsApp, To dos, Research and notes, Comments (beta), Follow ups, Outreach, Outcome, Tags, Activity, Personalized message, with a note Your preferences apply to you only and do not change other members, and a Reset to default layout action.
- The Tabs view toggle switches the same sections into a tabbed layout.
- Lead detail also has a multi recipient mail popover: Who to send it to, listing several recipient email addresses, a Subject line textbox, and a Send button.

## 8. Follow ups

URL: /lt/followups
Purpose: work the follow up queue.

- Header: Follow ups, date label in English (US), a select all badge, for example x 883, Search, Search company, person or email, channel filter All channels, stage filter All stages, and a Select all checkbox, for example Select all (883).
- Three sections: Overdue (red count, expanded), Due today, Upcoming (next 14 days). Section headers are collapsible.
- Each lead row: row checkbox (Select follow up), lead link (avatar, identifier, # plus follow up number, stage chip, channel chip, due date), a date button (clicking the date shows Clear date as a hover action), a Snooze dropdown (Tomorrow, In 3 days, In 1 week, and red Stop follow ups for this lead), and a Mark sent button.
- Email follow up rows also show a truncated follow up message preview under the lead name.
- A Select all bar / bulk state appears when rows are checked.

## 9. To dos

URL: /lt/todos
Purpose: team tasks, not per lead follow ups.

- Header: To dos, search Search to dos or companies, All owners filter, layout toggle List / Board, Add task button.
- Sections, collapsible, with counts: Overdue, Due today, Upcoming, No due date, Completed. Due today empty state: Nothing due today. Enjoy the clear slate.
- Each row: completion checkbox, task text, linked company name, owner name, and Comments, Edit, Delete buttons. Completed rows show a completion note.
- Add task dialog: Title textbox, placeholder example Buy domain for Gabriel, hint Be specific, this is the task; Description textbox, Add details, links, or context; Due date button, No due date, with a calendar picker; an assignee combobox, default the signed in user; a Company / lead picker, Optional, link this task to a lead, search Search companies, people, emails, or @handles; Cancel and Add task buttons.
- Board view switches the list into a Kanban style layout.

## 10. Activity

URL: /lt/activity
Purpose: the canonical event log. The page itself says: Outreach and reply entries here are what Ledger and Outreach Tracker count. Fix or delete wrong ones here, Ledger and the tracker will update.

- Header: Activity, last 30 days date selector, Done by anyone filter, search box Search a lead, entry or person, Add activity button.
- Category pills with counts: All, Outreach, Replies, Stage and status, Notes and calls, Other.
- Entries grouped by day, for example Today, Yesterday, Mon Nov 9: each entry is a lead link plus a sentence describing the event (stage changed from X to Y, follow up sent, email sent, email marked Deliverable / Risky, priority changed, lead marked checked, note edited, to do completed, tag added, outreach milestone marked), a timestamp and author, with per entry Edit and Delete buttons.
- Add activity inline form: textbox Find lead, Type combobox (default Note), DateTime field (defaults to now), What happened? textbox, Add (disabled until filled) and Cancel.
  - Type options: Outreach: Email sent, LinkedIn message sent, LinkedIn connection request sent, Instagram message sent, Follow up sent, Loom sent. Replies: Email replied, LinkedIn replied, Instagram replied. Call, Meeting booked, Client closed, Note.

## 11. Ledger

URL: /lt/ledger
Purpose: a day by day accounting of what happened, with targets.

- Header: Ledger, date navigator (prev, date button, next, with a calendar picker), a view height control (Compact / Comfortable), granularity Day, Week, Month, Year, total rows control (200 shown in the view), How to use Ledger, Automatic vs manual counts, and Customize.
- KPI cards, Day view, each with a delta and a percentage vs the previous period, with arrows: Leads Added, Outreach Sent, Emails Sent, Instagram DMs, LinkedIn Messages, Replies, Meetings Booked, Clients Closed. Four more cards are hidden and shown only via Customize.
- Table columns: Date, Lead (lead link plus code), Event, Details, User, and a per row Delete this entry button. A Load more button for remaining entries.
- Event types: Lead created, Stage changed (from X to Y), Follow up sent (Email), Email sent, Email marked Deliverable / Risky.

## 12. Outreach Tracker

URL: /lt/outreach
Purpose: outreach volume and streaks.

- Header: Outreach Tracker, with a left column and a right column.
- Date range buttons, same style as Dashboard: This week, This month, Last 30 days (selected), Last 3 months, This year, Custom. Channel tabs: All, Email, Instagram, LinkedIn. Customize button.
- Three channel cards, each headed Today with a big number: Email, Instagram, LinkedIn. Each with an icon, the formula note Automatic + Manual, a per channel Automatic vs manual counts link, and targets: Target: No target set, with a minus, amount box, plus target editor.
- By sender account lists, under each channel: each sender account row shows Active and two numbers, today's count and the in range count.
- Outreach over time chart, right column: stacked bars by day, channel coloured segments, legend, for example Email 71 (38%), Instagram 113 (61%), LinkedIn 2 (1%), total, for example 186 sent, 9 active days, Last 30 days, All channels. This is the only chart in the app.
- Streak and history: Current streak, Best streak, Days with outreach, for example 9 of 30, Average per day, and a heat map grid of daily squares, one cell per day, with day labels 1 to 30.
- Daily numbers table: columns Date, Email, Instagram, LinkedIn, Total, with an Edit numbers button for manually overriding counts.

## 13. Settings

URL: /settings
Reached from profile menu, Account settings. The page has a left navigation with a back link Back to Tracker / Back to Lead Tracker: Overview, Account, AI connector, Desktop and Mobile App, Invoice templates, Outreach templates, Follow up templates, Rapid Entry Settings, One click lead clipper, Google Sheet, Billing, Contact us, Danger zone. The account Default lead view is Table, Default landing module is Lead Tracker. Each section opens at an anchor, for example #account, #ai_connector, #invoice_templates, #outreach_templates, #followup_templates, #rapid_entry, #bookmarklet, #google_sheet, #billing, #contact, #danger_zone.

- Overview, landing: Settings heading (Manage your account and workspace settings) and cards for each section below with a one line description.
- Account: Profile, Name textbox, Email (shown, not editable in the UI), role line (Member). Options: Theme combobox (Light / Dark), Default landing module combobox (Lead Tracker / CRM), Default lead view combobox (Table / Columns / Cards), Google Drive textbox (Shared Google Drive Folder link, optional). Follow up notification preferences, switches for: Follow up complete (on), Follow up missed, Follow up response, Daily summary, Weekly summary, Weekly goal achieved, Weekly goal missed, Daily outreach streak. Save changes button.
- AI connector: AI Connector heading, description Connect Claude, ChatGPT, or any AI assistant to your tracker. Works with Claude Code, Codex, Cursor and any MCP tool. Connect your workspace steps with a connect button labelled Paste in your MCP client, Claude Code Interactive, Add to Project, and two code snippets with Copy buttons.
- Desktop and Mobile App, Install app: steps 1 Open Chrome menu, 2 Choose Install app, 3 Add to home screen. Fields: Get desktop app, Get mobile app, Get backend (Generate standalone backend), NotebookLM instructions. A Download and install button and a Need help? action.
- Invoice templates: tools LLM ready template exporter, six ai companion actions (Company basic, Client, Payment, Lead, Invoice, Next serials), 15 currency buttons (USD, INR, EUR, GBP, AUD, CAD, JPY, SGD, HKD, NZD, CHF, SEK, NOK, AED, ZAR), the Invoice Profile form (Company / Invoicing Name, Registration, Website, Email, Phone, Address, PAN / GST / TIN fields), Template files with Download, and a Create template button.
- Outreach templates: 3 exist in the mapped workspace, all Instagram: Direct dm, Blown up, ig long videos. Channel chip (Instagram), an Add email template button, New template button, plus per template Search and a template filter. Expanding a template shows: Template name textbox, Channel combobox, Message textbox (placeholder Hey {first_name}, ... , message bodies use placeholders {first_name}, {name}, {company}), a SpamCheck for email link, and Delete, Cancel, Save buttons. A filter list shows templates by channel with a No email templates yet style state.
- Follow up templates: two sequences exist: Ig follow ups (steps +1 day Instagram ask for case study, +3 days Instagram share case study; actions Make default and Add step) and Followups (labelled Default; steps +1 day Email FUP1, +2 days Email FUP2, +3 days Email FUP3, +4 days Email FUP4; Add step). Bottom: Template name textbox and Add template button. Sections are named New Sequence and Create sequence.
- Rapid Entry Settings: Rapid Entry Settings heading with the note Only admins can change these settings, and every control disabled (switches under each channel read Instagram Buttons, LinkedIn Buttons, Email Buttons): Instagram: Outreach Sent, Outreach Seen / Replied, Sent From Account, Tags, Next Follow up (None). LinkedIn: Connection Request Sent, Message Sent, Replied, Sent From Account, Tags, Next Follow up. Email: Email Sent, Email Replied, Sender Account, Tags, Next Follow up.
- One click lead clipper: heading One click lead clipper, description Save leads from Instagram and LinkedIn in one click, without copy pasting. Instructions Drag it to your bookmarks bar, supported site list (Instagram, LinkedIn), a bookmarklet button named Add to Tracker, and Bookmarklet help / Troubleshooting links.
- Google Sheet: connection panel Connected as owner's Google account, with a Reconnect button, Last sync time, a box Google Sheet CRM with the sheet URL and Open our sheet, and an Appearance panel: Add rows to top of sheet?, Layout (Compact / Comfortable), Include tags? Sync settings are constrained to the connected sheet.
- Billing: heading Billing, a Plan card (Free Trial, You get free until Tracker Unlimited launches), workspace member count, invoice history placeholder (No invoices yet), total fields, and FAQ entries labelled Billing FAQ (questions about pricing, what happens if left unpaid, plan update).
- Contact us: a panel with the support contact email and an Email us link.
- Danger zone: a red bordered panel (Danger zone heading, Reset everything section, Delete all leads section with a note that the action is permanent and requires confirmation, Reset your data section). No button was clicked in mapping, and in the build these actions must require typed confirmation.

Admin only Settings sections, not visible to a Member, to include for Admins: Stages, Channels, Users, and a Saved import mappings area.

## 14. Archive

URL: /lt/archive
Purpose: restore, or permanently delete, archived leads.

- Header: Archive, subheading, search box Search name / @handle / ID / Tag, count, for example 86 total, and a How Archive works link.
- Table columns: Company, Lead Code, Stage, Country, Date Added, Archived, Actions. Per row action is Restore.
- Pagination: per page selector (50) and page 1 of 2, Previous / Next. No bulk Restore control in the header area.

## 15. Import / Export

URL: /lt/data
Reached via the command palette (Import / Export).

- For Admin: import leads from CSV / Google Sheet, with saved import mappings, and export selected leads.
- For Member: the page is blocked, heading Access denied, text You do not have access to this page. Ask an admin to grant it in Settings, and a single Back to Tracker button.

## 16. Data model

Build these tables, with workspace_id on every row:

- workspaces, users, workspace_members (role Admin or Member)
- leads: id, lead_code (LEAD-0001 and auto incrementing), company_name, contact_name, country, location, industry, employee_count, revenue, founded_year, website, channel (Email, Instagram, LinkedIn), stage, status, priority, added_by, date_added, last_contacted, last_activity, checked (boolean, with checked_by and checked_at), archived (boolean, archived_at)
- lead_people: lead_id, name, title_role, linkedin, email, email_verified, is_main
- lead_emails: lead_id, email, is_main, verification_status (Deliverable, Risky, Unverified, No email)
- lead_tags: lead_id, tag
- tags: name, workspace_id, unique per workspace
- follow_ups: lead_id, step_number (1 to 5), due_date, channel, template_id, notes, sent (boolean), sent_at, sent_by
- outreach_marks: lead_id, type (one of the 12: Connection request, LinkedIn message, LinkedIn reply, Instagram message, Instagram reply, Email sent, Email viewed, Email reply, Loom sent, Loom watched, Meeting booked, Client closed), done (boolean), done_at
- lead_notes: lead_id, type (Research or Additional), text, updated_by, updated_at
- todos: id, title, description, due_date, assignee_id, lead_id (optional), completed (boolean), completed_at, created_by
- todo_comments: todo_id, author_id, text, created_at
- activity_entries: id, lead_id (optional), type, text, details, author_id, created_at, with Edit and Delete. Activity types: Outreach (Email sent, LinkedIn message sent, LinkedIn connection request sent, Instagram message sent, Follow up sent, Loom sent), Replies (Email replied, LinkedIn replied, Instagram replied), Call, Meeting booked, Client closed, Note.
- outreach_templates: id, name, channel, message_template, created_by
- follow_up_templates: id, name, is_default, steps (array of day offset, channel, step name)
- settings: workspace_id, default_lead_view, default_landing_module, theme, google_sheet_url, google_drive_folder, notification_preferences (JSON)
- ledger_entries: derived from activity_entries, do not store a separate copy, calculate Ledger and Outreach Tracker counts from Activity, as the original says: Outreach and reply entries here are what Ledger and Outreach Tracker count. Fix or delete wrong ones here, Ledger and the tracker will update.

Stages, in order: New, Researching, Email Drafted, Contacted, Following up, Replied, Resource sent, Not Interested, Not in a priority.
Statuses, raw values: new, in_progress, on_hold, won, lost.
Priorities: Low, Medium (default), High.
Channels: Email, Instagram, LinkedIn.
Follow up steps: 1 to 5 per lead, with quick dates +2 days, +3 days, +7 days, plus Custom Date, Snooze (Tomorrow, In 3 days, In 1 week, Stop follow ups for this lead), Mark sent, Clear date.

## 17. Rules for the build

- Every filter, sort, group by, view toggle, and button listed above must actually work against real database data.
- All counts on the Dashboard, Follow ups, Ledger, and Outreach Tracker must be calculated live from the same data, not hardcoded.
- Do not auto create a blank lead on opening the Add lead page. Only create on Save.
- Do not submit any form on Cancel or Escape. Dialogs opened and cancelled must create nothing.
- Member restrictions must be enforced in the backend, not only hidden in the UI, especially Import / Export and Rapid Entry Settings.
- Include light and dark mode, and save per user preferences for Default lead view, Default landing module, Theme, and Section Visibility on the lead detail page.
- Include the public guide page structure at /guide, documenting Dashboard, Leads, Follow ups, To dos, Outreach Tracker, Activity, Ledger, Archive, and Settings, with a How Dashboard works link from the Dashboard.
- Seed the app with 5 sample leads in different stages and channels, with follow ups, tags, and activity, so every page has real data to show on first load, and add a Clear sample data button in Settings, Danger zone.

## 18. What was not fully mapped, build as sensible defaults

- CRM module pages Records, Pipeline, Revenue, Invoices: build them as simple list and pipeline pages using the same lead data, with a note that they are part of the CRM module.
- The lead detail header Export menu, the Tabs alternative layout, Push to CRM, and the per email History popover: build them as working menus, with Export downloading the lead as CSV, Tabs switching the same sections into tabs, Push to CRM creating a CRM record, and History showing the email activity for that address.
- The Leads Country, Sender, Added By, and Tag filter lists: populate them from real data in the workspace.
- The guide lists admin only Settings sections Stages, Channels, Users, and Saved import mappings: build those for Admins, with full create, edit, and delete.

## 19. Acceptance check

Before finishing, verify and report:
1. Dashboard loads, with live KPI cards, rate cards, and overdue, due today, and upcoming lists.
2. Leads Table, Columns, Cards, and Calendar views all load with the same 331 style data, and every filter in section 6 works.
3. Add lead creates exactly one lead, only on Save, with no blank Untitled lead created on opening the form.
4. A lead detail page shows all 12 sections, Follow ups 1 to 5 work, Mark sent works, Snooze works, and Tags add and remove works.
5. Follow ups page shows Overdue, Due today, and Upcoming correctly, with Mark sent and Snooze working.
6. To dos, Activity, Ledger, Outreach Tracker, Archive, and Settings all load and update from the same data.
7. Member opening Import / Export sees Access denied.
8. Light and dark mode both work, and Cmd K opens the command palette.

Build it now, in full, and list any section you could not complete at the end.
