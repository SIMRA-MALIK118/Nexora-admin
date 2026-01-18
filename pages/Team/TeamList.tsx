import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, Filter, Loader2, CheckCircle2, User, Linkedin, Twitter, Github } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { TeamMember } from '../../types';

const TeamList: React.FC = () => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Omit<TeamMember, 'id'>>({
        name: '',
        role: '',
        bio: '',
        imageUrl: '',
        socialLinks: { linkedin: '', twitter: '', github: '' }
    });

    // Fetch team members
    const fetchMembers = async () => {
        const snapshot = await getDocs(collection(db, 'teamMembers'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TeamMember[];
        setMembers(data);
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // Add or Update Member
    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingId) {
                // UPDATE
                await updateDoc(doc(db, 'teamMembers', editingId), {
                    ...formData
                });
            } else {
                // ADD
                await addDoc(collection(db, 'teamMembers'), {
                    ...formData,
                    createdAt: serverTimestamp()
                });
            }

            await fetchMembers();
            setIsSidebarOpen(false);
            setEditingId(null);
            setFormData({
                name: '',
                role: '',
                bio: '',
                imageUrl: '',
                socialLinks: { linkedin: '', twitter: '', github: '' }
            });
        } catch (error) {
            console.error(error);
            alert('Error saving member');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete member
    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this team member?')) {
            try {
                await deleteDoc(doc(db, 'teamMembers', id));
                setMembers(prev => prev.filter(member => member.id !== id));
            } catch (error) {
                console.error(error);
                alert('Error deleting member');
            }
        }
    };

    return (
        <div className="space-y-6 relative min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#0d0d0d]">Team Members</h2>
                    <p className="text-sm text-gray-500 font-medium">Manage your team and their roles.</p>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="bg-[#0d0d0d] text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-black/90 transition-all font-semibold shadow-sm active:scale-95 w-full sm:w-auto"
                >
                    <Plus size={18} />
                    Add Member
                </button>
            </div>

            {/* Members Grid */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-gray-50/30">
                    <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
                        <Filter size={16} />
                        Filter Results
                    </button>
                    <span className="text-xs md:text-sm text-gray-400 font-medium">{members.length} Team Members</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {members.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-gray-400 italic font-medium">
                            No team members found. Add your first member to get started.
                        </div>
                    ) : (
                        members.map((member) => (
                            <div key={member.id} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow group relative">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            setEditingId(member.id);
                                            setFormData({
                                                name: member.name,
                                                role: member.role,
                                                bio: member.bio,
                                                imageUrl: member.imageUrl,
                                                socialLinks: member.socialLinks || { linkedin: '', twitter: '', github: '' }
                                            });
                                            setIsSidebarOpen(true);
                                        }}
                                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 overflow-hidden border border-gray-200">
                                        {member.imageUrl ? (
                                            <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <User size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                                    <p className="text-sm text-blue-600 font-medium mb-2">{member.role}</p>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{member.bio}</p>

                                    <div className="flex gap-3 mt-auto">
                                        {member.socialLinks?.linkedin && (
                                            <a href={member.socialLinks.linkedin} className="text-gray-400 hover:text-[#0077b5] transition-colors"><Linkedin size={18} /></a>
                                        )}
                                        {member.socialLinks?.twitter && (
                                            <a href={member.socialLinks.twitter} className="text-gray-400 hover:text-[#1DA1F2] transition-colors"><Twitter size={18} /></a>
                                        )}
                                        {member.socialLinks?.github && (
                                            <a href={member.socialLinks.github} className="text-gray-400 hover:text-black transition-colors"><Github size={18} /></a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Sidebar Form */}
            {isSidebarOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity" onClick={() => setIsSidebarOpen(false)} />
                    <div className="fixed inset-y-0 right-0 w-full md:max-w-md bg-white shadow-2xl z-[70] p-6 md:p-8 animate-in slide-in-from-right duration-300 overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Team Member' : 'New Team Member'}</h3>
                                <p className="text-sm text-gray-500 font-medium">Add or edit a member.</p>
                            </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddMember} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium" placeholder="e.g. John Doe" />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Role / Title</label>
                                <input required type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium" placeholder="e.g. Product Manager" />
                            </div>

                            {/* Profile Image */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Profile Image URL</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium" placeholder="https://..." />
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                                <textarea rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium resize-none" placeholder="Short description..." />
                            </div>

                            {/* Social Links */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700">Social Links (Optional)</label>
                                <div className="relative">
                                    <Linkedin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="url" value={formData.socialLinks?.linkedin} onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium" placeholder="LinkedIn URL" />
                                </div>
                                <div className="relative">
                                    <Twitter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="url" value={formData.socialLinks?.twitter} onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium" placeholder="Twitter URL" />
                                </div>
                                <div className="relative">
                                    <Github size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="url" value={formData.socialLinks?.github} onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium" placeholder="GitHub URL" />
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="pt-8 space-y-4">
                                <button disabled={isSubmitting} type="submit" className="w-full bg-[#0d0d0d] text-white py-4 rounded-xl font-bold hover:bg-black/90 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]">
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                    {isSubmitting ? 'Saving...' : editingId ? 'Update Member' : 'Save Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default TeamList;