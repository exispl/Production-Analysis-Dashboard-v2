import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

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
      <div className="p-3 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border themed-border-primary rounded-lg shadow-lg text-base">
        <p className="label font-bold themed-text-primary">{`${data.employee} (${data.task})`}</p>
        <p className="text-lime-600 dark:text-lime-400">{`Avg. Time: ${data.averageTime.toFixed(2)} mins`}</p>
      </div>
    );
  }
  return null;
};

const EmployeePerformanceTable: React.FC<EmployeePerformanceTableProps> = ({ data }) => {
  const chartData = data.slice(0, 5).reverse();
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#9CA3AF' : theme === 'light' ? '#4B5563' : '#000000';
  const gridColor = theme === 'dark' ? '#4A5568' : theme === 'light' ? '#E5E7EB' : '#808080';


  return (
    <div className="flex flex-col flex-grow min-h-0 h-full">
      <div className="flex-shrink-0">
        <h4 className="text-lg font-semibold text-center themed-text-primary mb-2">Top 5 Fastest Tasks by Avg. Time</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
            >
              <defs>
                  <linearGradient id="colorLime" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#a3e635" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#65a30d" stopOpacity={1}/>
                  </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis type="number" stroke={tickColor} fontSize={14} unit="m" />
              <YAxis
                dataKey="employee"
                type="category"
                stroke={tickColor}
                width={100}
                tick={{ fontSize: 13 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(107, 114, 128, 0.2)' }} />
              <Bar dataKey="averageTime" name="Avg. Time (min)" fill="url(#colorLime)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto border-t themed-border-primary pt-4 mt-4 min-h-0">
        <table className="min-w-full divide-y themed-divide-primary">
          <thead className="themed-bg-muted sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-sm font-medium themed-text-secondary uppercase tracking-wider">
                Employee
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-medium themed-text-secondary uppercase tracking-wider">
                Task
              </th>
              <th scope="col" className="px-4 py-3 text-left text-sm font-medium themed-text-secondary uppercase tracking-wider">
                Avg. Time (min)
              </th>
            </tr>
          </thead>
          <tbody className="themed-bg-secondary divide-y themed-divide-primary">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700/50 classic:hover:bg-gray-400/30">
                <td className="px-4 py-3 whitespace-nowrap text-base themed-text-primary">{item.employee}</td>
                <td className="px-4 py-3 whitespace-nowrap text-base themed-text-secondary">{item.task}</td>
                <td className="px-4 py-3 whitespace-nowrap text-base text-cyan-600 dark:text-cyan-400 classic:text-blue-700">{item.averageTime.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeePerformanceTable;
