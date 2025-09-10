import React from 'react';
import type { LogEntry } from '../types';
import { getEventColor } from '../utils/colorUtils';

interface FullDataTableProps {
  data: LogEntry[];
}

const FullDataTable: React.FC<FullDataTableProps> = ({ data }) => {
    
    const formatDate = (date: Date | null) => {
        if (!date) return 'N/A';
        return date.toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'medium'});
    }

  return (
    <div className="themed-bg-secondary p-6 rounded-lg shadow-lg border themed-border-primary">
        <h3 className="text-2xl font-semibold themed-text-primary mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Full Event Log</h3>
        <div className="overflow-auto h-[600px] relative rounded-md border themed-border-primary">
            <table className="min-w-full divide-y themed-divide-primary text-base">
            <thead className="themed-bg-muted sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold themed-text-secondary uppercase tracking-wider">Prod. Auftrag</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold themed-text-secondary uppercase tracking-wider">Start Time</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold themed-text-secondary uppercase tracking-wider">End Time</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold themed-text-secondary uppercase tracking-wider">Event</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold themed-text-secondary uppercase tracking-wider">Text</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold themed-text-secondary uppercase tracking-wider">Duration (Min)</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold themed-text-secondary uppercase tracking-wider">Employee</th>
                </tr>
            </thead>
            <tbody className="themed-bg-secondary divide-y themed-divide-primary">
                {data.map((entry) => {
                    const eventColors = getEventColor(entry.eventName);
                    return (
                        <tr key={entry.id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50 classic:hover:bg-gray-400/30">
                            <td className="px-4 py-2 whitespace-nowrap themed-text-secondary">{entry.orderId}</td>
                            <td className="px-4 py-2 whitespace-nowrap themed-text-secondary">{formatDate(entry.startTime)}</td>
                            <td className="px-4 py-2 whitespace-nowrap themed-text-secondary">{formatDate(entry.endTime)}</td>
                            <td className="px-4 py-2 whitespace-nowrap font-semibold themed-text-primary">
                                <div className="flex items-center gap-2">
                                    <span className={`h-3 w-3 rounded-full ${eventColors.bg}`} />
                                    <span>{entry.eventName}</span>
                                </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap themed-text-muted truncate max-w-sm" title={entry.eventText}>{entry.eventText}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-cyan-600 dark:text-cyan-400 classic:text-blue-700 font-semibold">{entry.durationMinutes.toFixed(2)}</td>
                            <td className="px-4 py-2 whitespace-nowrap themed-text-secondary">{entry.employeeName}</td>
                        </tr>
                    )
                })}
            </tbody>
            </table>
        </div>
    </div>
  );
};

export default FullDataTable;
