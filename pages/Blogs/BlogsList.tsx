
import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Loader2, Edit2, Trash2, ImageIcon } from 'lucide-react';
import { Blog } from '../../types';
import { generateContent } from '../../services/geminiService';
import { BlogService } from '../../services/storageService';

const INITIAL_BLOGS: Blog[] = [
  { id: '1', title: 'The Future of AI in Web Development', author: 'Jane Smith', status: 'Published', date: 'Oct 15, 2023', content: '', imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop' },
  { id: '2', title: 'Mastering React Performance', author: 'John Doe', status: 'Draft', date: 'Nov 02, 2023', content: '', imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop' },
];

const BlogsList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    author: 'Admin',
    content: '',
    imageUrl: '',
    status: 'Draft' as Blog['status']
  });

  useEffect(() => {
    setBlogs(BlogService.getAll(INITIAL_BLOGS));
  }, []);

  const handleGenerateAI = async () => {
    if (!formData.title) return alert("Enter a title first");
    setIsGenerating(true);
    const result = await generateContent(formData.title, 'blog');
    setFormData(prev => ({ ...prev, content: result || "No content generated" }));
    setIsGenerating(false);
  };

  const handleSave = () => {
    const newBlog: Blog = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    BlogService.add(newBlog);
    setBlogs(BlogService.getAll([]));
    setShowForm(false);
    setFormData({ title: '', author: 'Admin', content: '', imageUrl: '', status: 'Draft' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this blog post?')) {
      BlogService.delete(id);
      setBlogs(BlogService.getAll([]));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0d0d0d]">Blogs</h2>
          <p className="text-sm text-gray-500 font-medium">Manage insights and technical articles.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#0d0d0d] text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-black/90 transition-all font-semibold shadow-sm w-full sm:w-auto"
          >
            <Plus size={18} />
            Create Post
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 max-w-4xl mx-auto animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">New Blog Post</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-black font-medium">Cancel</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter post title..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                <input 
                  type="url" 
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="Cover image URL..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-medium"
                />
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-all w-full justify-center shadow-lg shadow-purple-200"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  {isGenerating ? 'Drafting with Gemini...' : 'Generate Content with AI'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Content (Markdown)</label>
                <textarea 
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all font-mono text-sm"
                  placeholder="Write your content..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button 
              onClick={handleSave}
              className="bg-[#0d0d0d] text-white px-8 py-3 rounded-xl font-bold hover:bg-black/90 transition-all shadow-xl active:scale-95"
            >
              Save & Publish
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                        {blog.imageUrl ? (
                          <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">{blog.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{blog.author}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      blog.status === 'Published' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-medium">{blog.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(blog.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
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
