export type UserRole = 'user' | 'foreman';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  workplaceId: string;
}

export interface Workplace {
  _id: string;
  name: string;
  location: string;
}

export interface Incident {
  _id: string;
  title: string;
  description: string;
  photoPath?: string;
  reportedBy: string;
  workplaceId: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}