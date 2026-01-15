
export enum AppRoute {
  DASHBOARD = '/',
  LOGIN = '/login',
  PROJECTS = '/projects',
  SERVICES = '/services',
  BLOGS = '/blogs',
  CAREERS = '/careers',
}

export interface Project {
  id: string;
  title: string;
  category: string;
  status: 'Completed' | 'In Progress' | 'On Hold';
  client: string;
  date: string;
  imageUrl?: string;
}

export interface Blog {
  id: string;
  title: string;
  author: string;
  status: 'Published' | 'Draft';
  date: string;
  content: string;
  imageUrl?: string;
}

export interface Job {
  id: string;
  role: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote';
  status: 'Open' | 'Closed';
  imageUrl?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}
