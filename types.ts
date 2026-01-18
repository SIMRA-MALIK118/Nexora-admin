
export enum AppRoute {
  DASHBOARD = '/',
  LOGIN = '/login',
  PROJECTS = '/projects',
  BLOGS = '/blogs',
  TEAM = '/team',
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

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface Job {
  id: string;
  role: string;                        // corresponds to job role/title
  type: 'Full-time' | 'Contract' | 'Remote';
  location: string;
  status: 'Open' | 'Closed';
  imageUrl?: string;
  department?: string;
  postedDate?: string;
  createdAt?: any;                     // Firestore timestamp
  updatedAt?: any;                     // Firestore timestamp
}


// export interface ServiceItem {
//   id: string;
//   title: string;
//   description: string;
//   icon: string;
// }