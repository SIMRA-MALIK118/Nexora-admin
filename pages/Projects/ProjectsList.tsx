import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';

import {
  Plus,
  X,
  Trash2,
  Filter,
  Loader2,
  CheckCircle2,
  ImageIcon,
  Edit2
} from 'lucide-react';

export interface Project {
  id?: string;
  title: string;
  client: string;
  category: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  imageUrl: string;
  date?: string;
}

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Project>({
    title: '',
    client: '',
    category: 'Web App',
    status: 'In Progress',
    imageUrl: ''
  });

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, 'projects'));
    setProjects(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Project[]);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ ADD / UPDATE
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'projects'), {
          ...formData,
          date: new Date().toLocaleDateString(),
          createdAt: serverTimestamp()
        });
      }

      resetForm();
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ EDIT
  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      client: project.client,
      category: project.category,
      status: project.status,
      imageUrl: project.imageUrl
    });
    setEditingId(project.id!);
    setIsSidebarOpen(true);
  };

  // ✅ DELETE
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await deleteDoc(doc(db, 'projects', id));
    fetchProjects();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      client: '',
      category: 'Web App',
      status: 'In Progress',
      imageUrl: ''
    });
    setEditingId(null);
    setIsSidebarOpen(false);
  };

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-emerald-50 text-emerald-700';
    if (status === 'On Hold') return 'bg-amber-50 text-amber-700';
    return 'bg-blue-50 text-blue-700';
  };

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-sm text-gray-500">Manage portfolio</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsSidebarOpen(true);
          }}
          className="bg-black text-white px-5 py-2 rounded-xl flex gap-2"
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-4 flex gap-3 items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="m-auto text-gray-400" size={16} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                </td>

                <td className="p-4">{p.client}</td>

                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                </td>

                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-500">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id!)} className="text-red-500">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40" onClick={resetForm} />
          <div className="fixed right-0 top-0 h-full w-full md:max-w-md bg-white p-6 shadow-xl">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingId ? 'Edit Project' : 'New Project'}
              </h3>
              <button onClick={resetForm}><X /></button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <input
                placeholder="Project Title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full border p-3 rounded"
                required
              />

              <input
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full border p-3 rounded"
              />

              <select
                value={formData.client}
                onChange={e => setFormData({ ...formData, client: e.target.value })}
                className="w-full border p-3 rounded"
                required
              >
                <option value="">Select Tech</option>
                <option>React</option>
                <option>Next.js</option>
                <option>Node.js</option>
                <option>Flutter</option>
                <option>Python/Django</option>
              </select>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 rounded flex justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                {editingId ? 'Update Project' : 'Save Project'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectsList;
