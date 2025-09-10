import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PerformanceData {
  employee: string;
  task: string;
  averageTime: number;
  count: number;
}

interface EmployeePerformanceTableProps {
  data: PerformanceData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-gray-700 border border-gray-600 rounded-md shadow-lg text-sm">
        <p className="label font-bold text-white">{`${data.employee} (${data.task})`}</p>
        <p className="text-cyan-400">{`Avg. Time: ${data.averageTime.toFixed(2)} mins`}</p>
      </div>
    );
  }
  return null;
};


const EmployeePerformanceTable: React.FC<EmployeePerformanceTableProps> = ({ data }) => {
  const chartData = data.slice(0, 5).reverse();

  return (
    <div className="flex flex-col h-full min-h-0">
      <div>
        <h4 className="text-md font-semibold text-center text-white mb-2">Top 5 Fastest Tasks by Avg. Time</h4>
        <div className="h-52 w-full">
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis type="number" stroke="#9CA3AF" fontSize={12} unit="m" />
              <YAxis
                dataKey="employee"
                type="category"
                stroke="#9CA3AF"
                width={80}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(107, 114, 128, 0.2)' }} />
              <Bar dataKey="averageTime" name="Avg. Time (min)" fill="#84cc16" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto border-t border-gray-700 pt-4 mt-6 min-h-0">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Employee
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Task
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Avg. Time (min)
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800/50 divide-y divide-gray-700">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-700/50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{item.employee}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{item.task}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-cyan-400">{item.averageTime.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeePerformanceTable;