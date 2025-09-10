
import React from 'react';
import type { LogEntry } from '../types';

interface FullDataTableProps {
  data: LogEntry[];
}

const FullDataTable: React.FC<FullDataTableProps> = ({ data }) => {
    
    const formatDate = (date: Date | null) => {
        if (!date) return 'N/A';
        return date.toLocaleString('de-DE');
    }

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Full Event Log</h3>
        <div className="overflow-auto h-[500px] relative">
            <table className="min-w-full divide-y divide-gray-700 text-sm">
            <thead className="bg-gray-800 sticky top-0 z-10">
                <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Prod. Auftrag</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Start Time</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">End Time</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Text</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration (Min)</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Employee</th>
                </tr>
            </thead>
            <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                {data.map((entry, index) => (
                <tr key={entry.id} className={index % 2 === 0 ? 'bg-black/10' : 'bg-white/5'}>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-300">{entry.orderId}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-300">{formatDate(entry.startTime)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-300">{formatDate(entry.endTime)}</td>
                    <td className="px-3 py-2 whitespace-nowrap font-medium text-white">{entry.eventName}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-400 truncate max-w-xs">{entry.eventText}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-cyan-400">{entry.durationMinutes.toFixed(2)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-300">{entry.employeeName}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    </div>
  );
};

export default FullDataTable;
