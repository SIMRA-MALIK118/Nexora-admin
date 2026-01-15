
import React from 'react';
import { Plus, Code, Smartphone, Cloud, Search, Trash2, Edit2 } from 'lucide-react';
import { ServiceItem } from '../../types';

const INITIAL_SERVICES: ServiceItem[] = [
  { id: '1', name: 'Web Development', description: 'Modern, high-performance web applications built with React and Node.js.', icon: 'Code' },
  { id: '2', name: 'Mobile Apps', description: 'Native and cross-platform mobile experiences for iOS and Android.', icon: 'Smartphone' },
  { id: '3', name: 'Cloud Infrastructure', description: 'Scalable cloud solutions and DevOps automation workflows.', icon: 'Cloud' },
  { id: '4', name: 'SEO Optimization', description: 'Digital marketing and search engine performance tracking.', icon: 'Search' },
];

const IconMap: any = { Code, Smartphone, Cloud, Search };

const ServicesList: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0d0d0d]">Services</h2>
          <p className="text-gray-500">Configure offerings displayed on the website.</p>
        </div>
        <button className="bg-[#0d0d0d] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black/90 transition-all font-semibold">
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INITIAL_SERVICES.map((service) => {
          const IconComp = IconMap[service.icon];
          return (
            <div key={service.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-6 group">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black shrink-0">
                <IconComp size={28} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold">{service.name}</h3>
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-black rounded transition-all"><Edit2 size={16} /></button>
                    <button className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesList;
