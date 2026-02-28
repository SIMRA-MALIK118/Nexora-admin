import React, { useState, useEffect } from 'react';
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

import {
  Plus,
  X,
  Trash2,
  Loader2,
  CheckCircle2,
  ImageIcon,
  Edit2,
  Upload,
  Link as LinkIcon
} from 'lucide-react';

const PROJECT_TYPE_OPTIONS = [
  'Web App',
  'Mobile App',
  'Website',
  'Design',
  'Backend',
  'AI/ML',
  'Blockchain',
  'E-Commerce',
  'Dashboard',
  'Other',
];

const TECHNOLOGY_OPTIONS = [
  'React',
  'Next.js',
  'Node.js',
  'Flutter',
  'Vue.js',
  'Angular',
  'Python',
  'Django',
  'TypeScript',
  'Tailwind CSS',
  'Firebase',
  'MongoDB',
  'PostgreSQL',
  'AWS',
  'Figma',
  'UI/UX',
];

export interface Project {
  id?: string;
  title: string;
  description: string;
  client: string;
  category: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  imageUrl: string;
  technologies: string[];
  liveProjectLink: string;
  date?: string;
}

const defaultFormData: Project = {
  title: '',
  description: '',
  client: '',
  category: 'Web App',
  status: 'In Progress',
  imageUrl: '',
  technologies: [],
  liveProjectLink: '',
};

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Project>({ ...defaultFormData });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, 'projects'));
    setProjects(
      snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title ?? '',
          description: data.description ?? '',
          client: data.client ?? '',
          category: data.category ?? 'Web App',
          status: data.status ?? 'In Progress',
          imageUrl: data.imageUrl ?? '',
          technologies: Array.isArray(data.technologies) ? data.technologies : [],
          liveProjectLink: data.liveProjectLink ?? '',
          date: data.date,
        };
      }) as Project[]
    );
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const uploadImageAndGetUrl = async (file: File): Promise<string> => {
    if (isCloudinaryConfigured()) {
      return uploadImageToCloudinary(file);
    }
    const name = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const storageRef = ref(storage, `projects/${name}`);
    await uploadBytes(storageRef, file, { contentType: file.type || 'image/jpeg' });
    return getDownloadURL(storageRef);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        setIsUploadingImage(true);
        try {
          imageUrl = await uploadImageAndGetUrl(imageFile);
        } catch (uploadErr: unknown) {
          const msg = uploadErr instanceof Error ? uploadErr.message : String(uploadErr);
          const isCors = /cors|blocked|preflight|ERR_FAILED|Access to XMLHttpRequest/i.test(msg);
          const isPermission = /permission|denied|403|rules/i.test(msg);
          setIsUploadingImage(false);
          if (isCors) {
            alert(
              'Image upload blocked by browser (CORS).\n\n' +
              'Option 1: Use "Or paste image URL" below and paste a direct image link, then Save.\n\n' +
              'Option 2: Use Cloudinary – copy .env.example to .env and add your Cloudinary cloud name & upload preset (see CLOUDINARY_SETUP.txt). Restart dev server.'
            );
            return;
          }
          if (isPermission) {
            alert(
              'Image upload failed: Storage permission denied.\n\n' +
              'Fix: Firebase Console → Storage → Rules → set "allow read, write: if true;" for testing, then Publish.'
            );
            return;
          }
          alert('Image upload failed: ' + msg);
          return;
        }
        setIsUploadingImage(false);
      }

      const basePayload = {
        title: formData.title,
        description: formData.description,
        client: formData.technologies[0] || formData.client || '',
        category: formData.category,
        status: formData.status,
        imageUrl,
        technologies: formData.technologies,
        liveProjectLink: formData.liveProjectLink || '',
      };

      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), {
          ...basePayload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'projects'), {
          ...basePayload,
          date: new Date().toLocaleDateString(),
          createdAt: serverTimestamp(),
        });
      }

      resetForm();
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Check console.');
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description ?? '',
      client: project.client,
      category: project.category,
      status: project.status,
      imageUrl: project.imageUrl ?? '',
      technologies: project.technologies ?? [],
      liveProjectLink: project.liveProjectLink ?? '',
    });
    setImageFile(null);
    setImagePreview(project.imageUrl ?? '');
    setEditingId(project.id!);
    setIsSidebarOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await deleteDoc(doc(db, 'projects', id));
    fetchProjects();
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
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const toggleTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-emerald-50 text-emerald-700';
    if (status === 'On Hold') return 'bg-amber-50 text-amber-700';
    return 'bg-blue-50 text-blue-700';
  };

  return (
    <div className="space-y-6 min-h-screen">
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

      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-4 flex gap-3 items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="m-auto text-gray-400" size={16} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                </td>
                <td className="p-4 text-gray-600 text-sm">{p.client}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button type="button" onClick={() => handleEdit(p)} className="text-blue-500">
                    <Edit2 size={16} />
                  </button>
                  <button type="button" onClick={() => handleDelete(p.id!)} className="text-red-500">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={resetForm} />
          <div className="fixed right-0 top-0 h-full w-full md:max-w-lg bg-white p-6 shadow-xl z-50 overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingId ? 'Edit Project' : 'New Project'}
              </h3>
              <button type="button" onClick={resetForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
                <input
                  placeholder="e.g. E-Commerce Platform"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                <textarea
                  placeholder="Short description of the project..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                <p className="text-xs text-gray-500 mb-1">Select type: Web App, Mobile App, Website, etc.</p>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  {PROJECT_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Technologies</label>
                <div className="border border-gray-300 rounded-lg p-2 max-h-48 overflow-y-auto flex flex-col gap-1">
                  {TECHNOLOGY_OPTIONS.map((tech) => (
                    <label
                      key={tech}
                      className="flex items-center gap-2 cursor-pointer py-1.5 px-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.technologies.includes(tech)}
                        onChange={() => toggleTechnology(tech)}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="text-sm">{tech}</span>
                    </label>
                  ))}
                </div>
                {formData.technologies.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {formData.technologies.join(', ')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <LinkIcon size={14} className="inline mr-1" /> Live Project Link
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.liveProjectLink}
                  onChange={(e) => setFormData({ ...formData, liveProjectLink: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Project['status'],
                    })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black"
                >
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Image</label>
                <p className="text-xs text-gray-500 mb-2">Choose file from desktop (optional). If upload fails, use URL below.</p>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-black hover:bg-gray-50 transition-colors">
                    <Upload size={20} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      {imageFile ? imageFile.name : 'Choose file...'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onImageFileChange}
                      className="hidden"
                    />
                  </label>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Or paste image URL (works when file upload is blocked):</span>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, imageUrl: e.target.value }));
                        if (!imageFile) setImagePreview(e.target.value);
                      }}
                      className="w-full border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-black"
                    />
                  </div>
                  {imagePreview ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setImagePreview('')}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          setFormData((p) => ({ ...p, imageUrl: '' }));
                        }}
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
                {!imagePreview && formData.imageUrl && (
                  <p className="text-xs text-gray-500 mt-1">Current image URL will be used if you don’t choose a new file.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium disabled:opacity-70"
              >
                {(isSubmitting || isUploadingImage) && (
                  <Loader2 size={18} className="animate-spin" />
                )}
                {!isSubmitting && !isUploadingImage && <CheckCircle2 size={18} />}
                {isUploadingImage ? 'Uploading image...' : editingId ? 'Update Project' : 'Save Project'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectsList;
