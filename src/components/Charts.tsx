import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartProps {
  data: { time: string; value: number }[];
  color?: string;
  showXAxis?: boolean;
  height?: number;
}

export const LineChartMini = ({ data, color = "#7F66FF", showXAxis = false, height = 200 }: ChartProps) => {
  return (
    <div style={{ height: height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2230', border: 'none', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            labelStyle={{ display: 'none' }}
          />
          {showXAxis && (
             <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
              interval="preserveStartEnd"
             />
          )}
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={3} 
            fill={`url(#gradient-${color})`} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};