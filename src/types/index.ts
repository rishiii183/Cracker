export type Role = 'Admin' | 'Member';

export type Channel = 'Email' | 'Instagram' | 'LinkedIn';

export type Stage =
  | 'New'
  | 'Researching'
  | 'Email Drafted'
  | 'Contacted'
  | 'Following up'
  | 'Replied'
  | 'Resource sent'
  | 'Not Interested'
  | 'Not in a priority';

export type Status = 'new' | 'in_progress' | 'on_hold' | 'won' | 'lost';

export type Priority = 'Low' | 'Medium' | 'High';

export type VerificationStatus = 'Deliverable' | 'Risky' | 'Unverified' | 'No email';

export interface LeadPerson {
  id: string;
  leadId: string;
  name: string;
  titleRole?: string | null;
  linkedin?: string | null;
  email?: string | null;
  emailVerified: boolean;
  isMain: boolean;
}

export interface LeadEmail {
  id: string;
  leadId: string;
  email: string;
  isMain: boolean;
  verificationStatus: VerificationStatus;
}

export interface FollowUp {
  id: string;
  leadId: string;
  stepNumber: number;
  dueDate?: string | null;
  channel?: string | null;
  templateId?: string | null;
  notes?: string | null;
  sent: boolean;
  sentAt?: string | null;
  sentBy?: string | null;
}

export interface OutreachMark {
  id: string;
  leadId: string;
  type: string;
  done: boolean;
  doneAt?: string | null;
}

export interface LeadNote {
  id: string;
  leadId: string;
  type: 'Research' | 'Additional';
  text: string;
  updatedBy?: string | null;
  updatedAt: string;
}

export interface Lead {
  id: string;
  workspaceId: string;
  leadCode: string;
  companyName: string;
  contactName?: string | null;
  country?: string | null;
  location?: string | null;
  industry?: string | null;
  employeeCount?: string | null;
  revenue?: string | null;
  foundedYear?: string | null;
  website?: string | null;
  channel: Channel;
  stage: Stage;
  status: Status;
  priority: Priority;
  addedBy: string;
  senderAccount?: string | null;
  dateAdded: string;
  lastContacted?: string | null;
  lastActivity: string;
  checked: boolean;
  checkedBy?: string | null;
  checkedAt?: string | null;
  archived: boolean;
  archivedAt?: string | null;
  people?: LeadPerson[];
  emails?: LeadEmail[];
  tags?: { tag: string }[];
  followUps?: FollowUp[];
  outreachMarks?: OutreachMark[];
  notes?: LeadNote[];
  activities?: ActivityEntry[];
}

export interface Todo {
  id: string;
  workspaceId: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  assigneeId?: string | null;
  leadId?: string | null;
  completed: boolean;
  completedAt?: string | null;
  createdBy?: string | null;
  createdAt: string;
  assignee?: { id: string; name: string; avatarUrl?: string | null } | null;
  lead?: { id: string; companyName: string; leadCode: string } | null;
  comments?: { id: string; text: string; authorId: string; createdAt: string }[];
}

export interface ActivityEntry {
  id: string;
  workspaceId: string;
  leadId?: string | null;
  type: string;
  category: string;
  text: string;
  details?: string | null;
  authorId?: string | null;
  authorName: string;
  createdAt: string;
  lead?: { id: string; companyName: string; leadCode: string } | null;
}

export interface OutreachTemplate {
  id: string;
  workspaceId: string;
  name: string;
  channel: string;
  messageTemplate: string;
  createdBy?: string | null;
}

export interface FollowUpTemplate {
  id: string;
  workspaceId: string;
  name: string;
  isDefault: boolean;
  stepsJson: string;
}

export interface WorkspaceSettings {
  defaultLeadView: 'Table' | 'Columns' | 'Cards';
  defaultLandingModule: 'Lead Tracker' | 'CRM';
  theme: 'light' | 'dark';
  googleSheetUrl: string;
  googleDriveFolder?: string | null;
  notificationPreferences: Record<string, boolean>;
  sectionVisibility: Record<string, boolean>;
}

