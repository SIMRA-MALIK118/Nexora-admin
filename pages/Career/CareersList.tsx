import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Briefcase, Clock, Trash2, X, Loader2, CheckCircle2, ImageIcon, Edit2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Job } from '../../types';

const JobsList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    role: '',
    location: '',
    type: 'Full-time' as Job['type'],
    status: 'Open' as Job['status'],
    imageUrl: ''
  });

  // 🔹 Fetch jobs from Firebase
  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, 'jobs'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Job[];
      setJobs(data);
    };
    fetchJobs();
  }, []);

  // 🔹 Add or Edit Job
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        // Edit existing job
        await updateDoc(doc(db, 'jobs', editingId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        setEditingId(null);
      } else {
        // Add new job
        await addDoc(collection(db, 'jobs'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }

      // Refresh jobs list
      const snapshot = await getDocs(collection(db, 'jobs'));
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Job[]);
      setIsSidebarOpen(false);
      setFormData({ role: '', location: '', type: 'Full-time', status: 'Open', imageUrl: '' });
    } catch (error) {
      console.error(error);
      alert('Error saving job');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 Delete Job
  const handleDelete = async (id: string) => {
    if (confirm('Remove this job listing?')) {
      try {
        await deleteDoc(doc(db, 'jobs', id));
        setJobs(prev => prev.filter(job => job.id !== id));
      } catch (error) {
        console.error(error);
        alert('Error deleting job');
      }
    }
  };

  // 🔹 Edit Job (open sidebar)
  const handleEdit = (job: Job) => {
    setFormData({
      role: job.role,
      location: job.location,
      type: job.type,
      status: job.status,
      imageUrl: job.imageUrl
    });
    setEditingId(job.id);
    setIsSidebarOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0d0d0d]">Careers</h2>
          <p className="text-sm text-gray-500 font-medium">Manage job listings and hiring process.</p>
        </div>
        <button 
          onClick={() => { setIsSidebarOpen(true); setEditingId(null); setFormData({ role: '', location: '', type: 'Full-time', status: 'Open', imageUrl: '' }) }}
          className="bg-[#0d0d0d] text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-black/90 transition-all font-semibold shadow-sm w-full sm:w-auto"
        >
          <Plus size={18} />
          Post Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-400 font-medium italic">
            No active job listings found.
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col">
              <div className="h-32 bg-gray-100 relative overflow-hidden">
                {job.imageUrl ? (
                  <img src={job.imageUrl} alt={job.role} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-1">
                  <button onClick={() => handleEdit(job)} className="p-2 bg-white/90 backdrop-blur-sm text-blue-500 rounded-lg shadow-sm hover:bg-blue-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(job.id)} className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg shadow-sm hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm ${
                    job.status === 'Open' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{job.role}</h3>
                
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <MapPin size={16} className="text-[#0d0d0d]" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Briefcase size={16} className="text-[#0d0d0d]" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock size={16} />
                    <span>Updated recently</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-50">
                  <button className="w-full py-3 bg-gray-50 text-[#0d0d0d] rounded-xl font-bold text-sm hover:bg-[#0d0d0d] hover:text-white transition-all shadow-sm">
                    View Applications
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sidebar Form */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full md:max-w-md bg-white shadow-2xl z-[70] p-6 md:p-8 animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Job Listing' : 'New Job Listing'}</h3>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Job Role</label>
                <input required type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none font-medium" placeholder="e.g. Senior Frontend Developer" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Image URL (Banner)</label>
                <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none font-medium" placeholder="https://..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as Job['type']})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-medium">
                    <option>Full-time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as Job['status']})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-medium">
                    <option>Open</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>

              <div className="pt-8">
                <button disabled={isSubmitting} type="submit" className="w-full bg-[#0d0d0d] text-white py-4 rounded-xl font-bold hover:bg-black/90 transition-all shadow-xl flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Job' : 'Save Job Posting'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default JobsList;