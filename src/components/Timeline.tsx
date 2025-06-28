import React from 'react';
import { Task } from './TaskList';
import { TimeSlot } from './TimeSlotManager';
import { Clock } from 'lucide-react';

interface TimelineProps {
  tasks: Task[];
  timeSlots: TimeSlot[];
}

export const Timeline: React.FC<TimelineProps> = ({ tasks, timeSlots }) => {
  const getTaskForSlot = (slotId: string) => {
    return tasks.find(task => task.timeSlot === slotId);
  };

  return (
    <div className="mb-8">
      <div className="glass-card p-6 mb-6">
        <h2 className="text-2xl font-light text-primary mb-2 flex items-center gap-3">
          <Clock size={24} />
          Today's Timeline
        </h2>
        <p className="text-secondary font-normal">Your day organized into focused time blocks</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {timeSlots.map((slot, index) => {
          const task = getTaskForSlot(slot.id);
          const isEmpty = !task;
          
          return (
            <div
              key={slot.id}
              className={`glass-card p-6 transition-all duration-300 ease-in-out hover:scale-105 ${
                isEmpty 
                  ? 'border-gray-400/30 dark:border-gray-500/30' 
                  : `bg-gradient-to-br ${slot.gradient} border-2 ${slot.border}`
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{slot.icon}</span>
                <div>
                  <div className="text-lg font-medium text-primary">
                    {slot.label}
                  </div>
                  <div className="text-sm text-secondary font-medium font-time">
                    {slot.time}
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                {isEmpty ? (
                  <div className="text-tertiary italic font-normal">
                    No task assigned
                  </div>
                ) : (
                  <div className={`text-primary font-medium transition-all duration-300 ease-in-out ${
                    task.completed ? 'line-through opacity-60' : ''
                  }`}>
                    {task.description}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-tertiary font-medium">
                Position {index + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};