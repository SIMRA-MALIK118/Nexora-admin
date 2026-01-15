
import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, Filter, Loader2, CheckCircle2, ImageIcon } from 'lucide-react';
import { Project } from '../../types';
import { ProjectService } from '../../services/storageService';

const INITIAL_PROJECTS: Project[] = [
  { id: '1', title: 'E-commerce Redesign', category: 'Web App', status: 'In Progress', client: 'Style Co', date: 'Oct 24, 2023', imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=100&h=100&fit=crop' },
  { id: '2', title: 'HealthTracker Mobile', category: 'Mobile App', status: 'Completed', client: 'Pulse Health', date: 'Sep 12, 2023', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop' },
];

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    category: 'Web App',
    status: 'In Progress' as Project['status'],
    imageUrl: ''
  });

  useEffect(() => {
    setProjects(ProjectService.getAll(INITIAL_PROJECTS));
  }, []);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newProject: Project = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      ProjectService.add(newProject);
      setProjects(ProjectService.getAll([]));
      setIsSidebarOpen(false);
      setIsSubmitting(false);
      setFormData({ title: '', client: '', category: 'Web App', status: 'In Progress', imageUrl: '' });
    }, 600);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      ProjectService.delete(id);
      setProjects(ProjectService.getAll([]));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'On Hold': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="space-y-6 relative min-h-screen animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0d0d0d]">Projects</h2>
          <p className="text-sm text-gray-500 font-medium">Manage and track company portfolios.</p>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="bg-[#0d0d0d] text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-black/90 transition-all font-semibold shadow-sm active:scale-95 w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-gray-50/30">
          <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
            <Filter size={16} />
            Filter Results
          </button>
          <span className="text-xs md:text-sm text-gray-400 font-medium">{projects.length} Total Projects</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] md:text-[11px] uppercase font-bold tracking-[0.1em]">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic font-medium">
                    No projects found. Add your first project to get started.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                          {project.imageUrl ? (
                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{project.title}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">{project.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap font-medium">{project.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap font-medium">{project.date}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full md:max-w-md bg-white shadow-2xl z-[70] p-6 md:p-8 animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">New Project</h3>
                <p className="text-sm text-gray-500 font-medium">Add a new item to your agency portfolio.</p>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Project Title</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium" placeholder="e.g. Modern Logistics Platform" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                <div className="relative">
                  <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium" placeholder="https://unsplash.com/photos/..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Client Name</label>
                <input required type="text" value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium" placeholder="e.g. Acme Corp" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all bg-white font-medium">
                    <option>Web App</option>
                    <option>Mobile App</option>
                    <option>SaaS</option>
                    <option>UI/UX Design</option>
                    <option>Branding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as Project['status']})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all bg-white font-medium">
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>On Hold</option>
                  </select>
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <button disabled={isSubmitting} type="submit" className="w-full bg-[#0d0d0d] text-white py-4 rounded-xl font-bold hover:bg-black/90 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  {isSubmitting ? 'Syncing...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectsList;
