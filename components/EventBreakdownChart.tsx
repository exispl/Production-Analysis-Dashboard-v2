import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface EventData {
  name: string;
  duration: number;
  count: number;
}

interface EventBreakdownChartProps {
  data: EventData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-gray-700 border border-gray-600 rounded-md shadow-lg text-sm">
        <p className="label font-bold text-white">{`${label}`}</p>
        <p className="text-cyan-400">{`Total Duration: ${data.duration.toFixed(2)} mins`}</p>
        <p className="text-gray-300">{`Occurrences: ${data.count}`}</p>
      </div>
    );
  }
  return null;
};


const EventBreakdownChart: React.FC<EventBreakdownChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
        <XAxis type="number" stroke="#9CA3AF" />
        <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={120} tick={{fontSize: 12}}/>
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(107, 114, 128, 0.2)' }} />
        <Legend />
        <Bar dataKey="duration" name="Total Duration (mins)" fill="#22D3EE" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EventBreakdownChart;