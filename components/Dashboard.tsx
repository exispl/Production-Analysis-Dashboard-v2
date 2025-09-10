import React from 'react';
import type { LogEntry } from '../types';
import { useProductionDataAnalysis } from '../hooks/useProductionDataAnalysis';
import SummaryCards from './SummaryCards';
import EventBreakdownChart from './EventBreakdownChart';
import EmployeePerformanceTable from './EmployeePerformanceTable';

interface DashboardProps {
  data: LogEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const { summary, eventBreakdown, employeePerformance } = useProductionDataAnalysis(data);

  return (
    <div className="space-y-8">
      <SummaryCards summary={summary} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
        <div className="lg:col-span-3 bg-gray-800/50 p-6 rounded-lg shadow-xl border border-gray-700 flex flex-col">
           <h3 className="text-xl font-semibold text-white mb-4 flex-none">Event Duration Analysis (Top 10)</h3>
           <div className="flex-grow min-h-0">
            <EventBreakdownChart data={eventBreakdown.slice(0, 10)} />
           </div>
        </div>
        <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-lg shadow-xl border border-gray-700 flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-4 flex-none">Fastest Average Task Times (Top 10)</h3>
          <div className="flex-grow min-h-0">
            <EmployeePerformanceTable data={employeePerformance.slice(0, 10)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;