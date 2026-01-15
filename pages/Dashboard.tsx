import React from 'react';
import { Users, FileText, CheckCircle, Briefcase } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02] duration-200">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-1 text-gray-900">{value}</h3>
      </div>
      <div className="p-3 bg-gray-50 rounded-xl text-[#0d0d0d]">
        <Icon size={26} />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0d0d0d]">
          Dashboard Overview
        </h2>
        <p className="text-sm md:text-base text-gray-500 font-medium">
          Quick summary of your platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Projects"
          value="24"
          icon={CheckCircle}
        />
        <StatCard
          title="Total Blogs"
          value="156"
          icon={FileText}
        />
        <StatCard
          title="Open Jobs"
          value="8"
          icon={Briefcase}
        />
        <StatCard
          title="Team Members"
          value="12"
          icon={Users}
        />
      </div>
    </div>
  );
};

export default Dashboard;
