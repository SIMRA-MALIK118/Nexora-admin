
import { Project, Blog, Job, ServiceItem, TeamMember } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'ca_admin_projects',
  BLOGS: 'ca_admin_blogs',
  JOBS: 'ca_admin_jobs',
  SERVICES: 'ca_admin_services',
  TEAM: 'ca_admin_team'
};

// Generic storage helper
const get = <T>(key: string, initial: T[]): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : initial;
};

const save = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const ProjectService = {
  getAll: (initial: Project[]) => get<Project>(STORAGE_KEYS.PROJECTS, initial),
  add: (project: Project) => {
    const projects = get<Project>(STORAGE_KEYS.PROJECTS, []);
    save(STORAGE_KEYS.PROJECTS, [project, ...projects]);
  },
  delete: (id: string) => {
    const projects = get<Project>(STORAGE_KEYS.PROJECTS, []);
    save(STORAGE_KEYS.PROJECTS, projects.filter(p => p.id !== id));
  }
};

export const BlogService = {
  getAll: (initial: Blog[]) => get<Blog>(STORAGE_KEYS.BLOGS, initial),
  add: (blog: Blog) => {
    const blogs = get<Blog>(STORAGE_KEYS.BLOGS, []);
    save(STORAGE_KEYS.BLOGS, [blog, ...blogs]);
  },
  delete: (id: string) => {
    const blogs = get<Blog>(STORAGE_KEYS.BLOGS, []);
    save(STORAGE_KEYS.BLOGS, blogs.filter(b => b.id !== id));
  }
};

export const JobService = {
  getAll: (initial: Job[]) => get<Job>(STORAGE_KEYS.JOBS, initial),
  add: (job: Job) => {
    const jobs = get<Job>(STORAGE_KEYS.JOBS, []);
    save(STORAGE_KEYS.JOBS, [job, ...jobs]);
  },
  delete: (id: string) => {
    const jobs = get<Job>(STORAGE_KEYS.JOBS, []);
    save(STORAGE_KEYS.JOBS, jobs.filter(j => j.id !== id));
  }
};

export const TeamService = {
  getAll: (initial: TeamMember[]) => get<TeamMember>(STORAGE_KEYS.TEAM, initial),
  add: (member: TeamMember) => {
    const members = get<TeamMember>(STORAGE_KEYS.TEAM, []);
    save(STORAGE_KEYS.TEAM, [member, ...members]);
  },
  delete: (id: string) => {
    const members = get<TeamMember>(STORAGE_KEYS.TEAM, []);
    save(STORAGE_KEYS.TEAM, members.filter(m => m.id !== id));
  }
};
