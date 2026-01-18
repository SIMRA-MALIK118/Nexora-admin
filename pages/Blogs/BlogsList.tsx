import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Loader2, Edit2, Trash2 } from 'lucide-react';
import { Blog } from '../../types';
import { generateContent } from '../../services/geminiService';

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

const BlogsList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    author: 'Admin',
    content: '',
    imageUrl: '',
    status: 'Draft' as Blog['status']
  });

  // 🔹 Fetch blogs
  const fetchBlogs = async () => {
    const snapshot = await getDocs(collection(db, 'blogs'));
    setBlogs(
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Blog[]
    );
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // 🔹 Generate AI content
  const handleGenerateAI = async () => {
    if (!formData.title) return alert('Enter title first');

    setIsGenerating(true);
    const result = await generateContent(formData.title, 'blog');
    setFormData(prev => ({ ...prev, content: result || '' }));
    setIsGenerating(false);
  };

  // 🔹 Save / Update blog
  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert('Title and content required');
      return;
    }

    if (editingId) {
      // UPDATE
      await updateDoc(doc(db, 'blogs', editingId), {
        ...formData,
        updatedAt: serverTimestamp()
      });
    } else {
      // ADD
      await addDoc(collection(db, 'blogs'), {
        ...formData,
        date: new Date().toLocaleDateString(),
        createdAt: serverTimestamp()
      });
    }

    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      author: 'Admin',
      content: '',
      imageUrl: '',
      status: 'Draft'
    });

    fetchBlogs();
  };

  // 🔹 Edit
  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      author: blog.author,
      content: blog.content,
      imageUrl: blog.imageUrl || '',
      status: blog.status
    });
    setEditingId(blog.id);
    setShowForm(true);
  };

  // 🔹 Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog?')) return;
    await deleteDoc(doc(db, 'blogs', id));
    fetchBlogs();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Blogs</h2>
          <p className="text-sm text-gray-500">Manage blogs</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-5 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} />
            Create Post
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-xl space-y-4">
          <input
            placeholder="Title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full border p-3 rounded-lg"
          />

          <input
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            rows={6}
            placeholder="Content"
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            className="w-full border p-3 rounded-lg"
          />

          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Generate with AI
          </button>

          <div className="flex justify-end gap-3">
            <button onClick={() => setShowForm(false)}>Cancel</button>
            <button
              onClick={handleSave}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              {editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden">
          <table className="w-full">
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id} className="border-b">
                  <td className="p-4 font-semibold">{blog.title}</td>
                  <td className="p-4">{blog.author}</td>
                  <td className="p-4 text-right flex gap-3 justify-end">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-blue-500"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlogsList;