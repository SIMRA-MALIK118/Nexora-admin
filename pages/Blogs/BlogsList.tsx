import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Loader2, Edit2, Trash2, Upload, X, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Blog } from '../../types';
import { generateContent } from '../../services/geminiService';

import { db, storage } from '../../firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { isCloudinaryConfigured, uploadImageToCloudinary } from '../../services/cloudinaryUpload';

const defaultFormData = {
  title: '',
  author: 'Admin',
  content: '',
  imageUrl: '',
  date: '',
  readTime: '',
  status: 'Draft' as Blog['status']
};

const BlogsList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const fetchBlogs = async () => {
    const snapshot = await getDocs(collection(db, 'blogs'));
    setBlogs(
      snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title ?? '',
          author: data.author ?? 'Admin',
          content: data.content ?? '',
          imageUrl: data.imageUrl ?? '',
          date: data.date ?? '',
          readTime: data.readTime ?? '',
          status: data.status ?? 'Draft'
        };
      }) as Blog[]
    );
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const uploadImageAndGetUrl = async (file: File): Promise<string> => {
    if (isCloudinaryConfigured()) return uploadImageToCloudinary(file);
    const name = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const storageRef = ref(storage, `blogs/${name}`);
    await uploadBytes(storageRef, file, { contentType: file.type || 'image/jpeg' });
    return getDownloadURL(storageRef);
  };

  const handleGenerateAI = async () => {
    if (!formData.title) return alert('Enter title first');
    setIsGenerating(true);
    const result = await generateContent(formData.title, 'blog');
    setFormData((prev) => ({ ...prev, content: result || '' }));
    setIsGenerating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Title and content required');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        setIsUploadingImage(true);
        try {
          imageUrl = await uploadImageAndGetUrl(imageFile);
        } catch (uploadErr: unknown) {
          const msg = String(uploadErr instanceof Error ? uploadErr.message : uploadErr);
          const isCors = /cors|blocked|preflight|ERR_FAILED/i.test(msg);
          setIsUploadingImage(false);
          if (isCors) alert('Image upload blocked (CORS). Use Cloudinary – see CLOUDINARY_SETUP.txt – or paste image URL.');
          else alert('Image upload failed: ' + msg);
          return;
        }
        setIsUploadingImage(false);
      }

      const dateToSave = formData.date || new Date().toLocaleDateString();
      const readTimeToSave = formData.readTime ? (formData.readTime.includes('min') ? formData.readTime : `${formData.readTime} min`) : '';

      const payload = {
        title: formData.title,
        author: formData.author,
        content: formData.content,
        imageUrl,
        date: dateToSave,
        readTime: readTimeToSave,
        status: formData.status,
        ...(editingId ? { updatedAt: serverTimestamp() } : { createdAt: serverTimestamp() })
      };

      if (editingId) {
        await updateDoc(doc(db, 'blogs', editingId), payload);
      } else {
        await addDoc(collection(db, 'blogs'), payload);
      }

      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  };

  const handleEdit = (blog: Blog & { readTime?: string }) => {
    setFormData({
      title: blog.title,
      author: blog.author || 'Admin',
      content: blog.content,
      imageUrl: blog.imageUrl || '',
      date: blog.date || '',
      readTime: blog.readTime || '',
      status: blog.status
    });
    setImageFile(null);
    setImagePreview(blog.imageUrl || '');
    setEditingId(blog.id);
    setIsSidebarOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog?')) return;
    await deleteDoc(doc(db, 'blogs', id));
    fetchBlogs();
  };

  const resetForm = () => {
    setFormData({ ...defaultFormData });
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
    setIsSidebarOpen(false);
  };

  const onImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData((p) => ({ ...p, imageUrl: '' }));
  };

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Blogs</h2>
          <p className="text-sm text-gray-500">Manage blogs</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormData({
              ...defaultFormData,
              date: new Date().toISOString().slice(0, 10)
            });
            setImageFile(null);
            setImagePreview('');
            setEditingId(null);
            setIsSidebarOpen(true);
          }}
          className="bg-black text-white px-5 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} />
          Create Post
        </button>
      </div>

      {/* Table - always visible */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full">
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-semibold">{blog.title}</td>
                <td className="p-4 text-gray-600">{blog.author}</td>
                <td className="p-4 text-sm text-gray-500">{(blog as Blog & { readTime?: string }).readTime || '—'}</td>
                <td className="p-4 text-right flex gap-3 justify-end">
                  <button type="button" onClick={() => handleEdit(blog)} className="text-blue-500">
                    <Edit2 size={16} />
                  </button>
                  <button type="button" onClick={() => handleDelete(blog.id)} className="text-red-500">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sidebar - form from right (same as Projects / Team) */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={resetForm}
            aria-hidden="true"
          />
          <div className="fixed right-0 top-0 h-full w-full md:max-w-lg bg-white p-6 shadow-xl z-50 overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingId ? 'Edit Blog' : 'New Blog'}
              </h3>
              <button type="button" onClick={resetForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  placeholder="Blog title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  rows={5}
                  placeholder="Write your content..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar size={14} className="inline mr-1" /> Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock size={14} className="inline mr-1" /> Read time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 or 5 min"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Number or &quot;5 min&quot;</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                <p className="text-xs text-gray-500 mb-2">Choose an image from your desktop (optional)</p>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-black hover:bg-gray-50 transition-colors">
                    <Upload size={20} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {imageFile ? imageFile.name : 'Choose file...'}
                    </span>
                    <input type="file" accept="image/*" onChange={onImageFileChange} className="hidden" />
                  </label>
                  {imagePreview ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 hover:bg-black"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-24 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      No image chosen
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                Generate with AI
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium disabled:opacity-70"
              >
                {(isSubmitting || isUploadingImage) && <Loader2 className="animate-spin" size={18} />}
                {!isSubmitting && !isUploadingImage && <CheckCircle2 size={18} />}
                {isUploadingImage ? 'Uploading image...' : editingId ? 'Update' : 'Save'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogsList;
