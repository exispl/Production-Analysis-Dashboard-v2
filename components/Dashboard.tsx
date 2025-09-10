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
        <div className="lg:col-span-3 themed-bg-secondary p-6 rounded-lg shadow-lg border themed-border-primary flex flex-col">
           <h3 className="text-2xl font-semibold themed-text-primary mb-4 flex-shrink-0 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Event Duration Analysis (Top 10)
            </h3>
           <div className="flex-grow min-h-[450px]">
            <EventBreakdownChart data={eventBreakdown.slice(0, 10)} />
           </div>
        </div>
        <div className="lg:col-span-2 themed-bg-secondary p-6 rounded-lg shadow-lg border themed-border-primary flex flex-col">
          <h3 className="text-2xl font-semibold themed-text-primary mb-4 flex-shrink-0 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          Fastest Average Task Times
          </h3>
          <EmployeePerformanceTable data={employeePerformance.slice(0, 10)} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
