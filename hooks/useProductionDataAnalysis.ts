
import { useMemo } from 'react';
import type { LogEntry } from '../types';

export const useProductionDataAnalysis = (data: LogEntry[]) => {
  const analysis = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        summary: {
          totalDuration: 0,
          productionDuration: 0,
          downtimeDuration: 0,
          totalEvents: 0,
        },
        eventBreakdown: [],
        employeePerformance: [],
        timelineData: [],
      };
    }

    let totalDuration = 0;
    let productionDuration = 0;
    const eventCounts: { [key: string]: { duration: number; count: number } } = {};
    const employeeTaskTimes: { [key: string]: { [key: string]: number[] } } = {};

    data.forEach(entry => {
      const duration = entry.durationMinutes;
      totalDuration += duration;

      if (entry.eventName.toLowerCase() === 'produktion') {
        productionDuration += duration;
      }

      if (!eventCounts[entry.eventName]) {
        eventCounts[entry.eventName] = { duration: 0, count: 0 };
      }
      eventCounts[entry.eventName].duration += duration;
      eventCounts[entry.eventName].count += 1;
      
      if (entry.employeeName !== 'GUARDUS' && entry.employeeName !== 'SYSTEM' && entry.employeeName.trim() !== '' && duration > 0) {
          if (!employeeTaskTimes[entry.employeeName]) {
              employeeTaskTimes[entry.employeeName] = {};
          }
          if (!employeeTaskTimes[entry.employeeName][entry.eventName]) {
              employeeTaskTimes[entry.employeeName][entry.eventName] = [];
          }
          employeeTaskTimes[entry.employeeName][entry.eventName].push(duration);
      }
    });

    const downtimeDuration = totalDuration - productionDuration;

    const eventBreakdown = Object.entries(eventCounts)
      .map(([name, { duration, count }]) => ({ name, duration, count }))
      .sort((a, b) => b.duration - a.duration);

    const employeePerformance = Object.entries(employeeTaskTimes).flatMap(([employee, tasks]) => 
      Object.entries(tasks).map(([task, times]) => {
        const totalTaskTime = times.reduce((a, b) => a + b, 0);
        return {
          employee,
          task,
          averageTime: totalTaskTime / times.length,
          count: times.length,
        }
      })
    ).sort((a, b) => a.averageTime - b.averageTime);
    

    const summary = {
      totalDuration,
      productionDuration,
      downtimeDuration,
      totalEvents: data.length,
    };
    
    // For timeline, we just pass the raw data as it's already sorted by time
    const timelineData = data;

    return { summary, eventBreakdown, employeePerformance, timelineData };
  }, [data]);

  return analysis;
};
