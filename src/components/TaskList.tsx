import React from 'react';
import { Check, X } from 'lucide-react';
import { TimeSlot } from './TimeSlotManager';

export interface Task {
  id: string;
  description: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
  createdAt: Date;
}

interface TaskListProps {
  tasks: Task[];
  timeSlots: TimeSlot[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, timeSlots, onToggleTask, onDeleteTask }) => {
  const getSlotInfo = (slotId: string) => {
    return timeSlots.find(slot => slot.id === slotId);
  };

  if (tasks.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-primary text-xl mb-3 font-light">No tasks yet</div>
        <div className="text-secondary text-base font-normal">Add your first task to get started</div>
      </div>
    );
  }

  // Sort tasks based on the current time slot order
  const sortedTasks = [...tasks].sort((a, b) => {
    const aIndex = timeSlots.findIndex(slot => slot.id === a.timeSlot);
    const bIndex = timeSlots.findIndex(slot => slot.id === b.timeSlot);
    return aIndex - bIndex;
  });

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => {
        const slotInfo = getSlotInfo(task.timeSlot);
        if (!slotInfo) return null;
        
        const slotIndex = timeSlots.findIndex(slot => slot.id === task.timeSlot);
        
        return (
          <div 
            key={task.id} 
            className={`glass-card p-6 bg-gradient-to-r ${slotInfo.gradient} border-2 ${slotInfo.border} hover:scale-[1.02] transition-all duration-300 ease-in-out`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 ${
                    task.completed
                      ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/25'
                      : 'border-gray-600 hover:border-green-500 hover:bg-green-500/10 dark:border-gray-300 dark:hover:border-green-400 dark:hover:bg-green-400/10'
                  }`}
                  aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {task.completed && <Check size={16} />}
                </button>
                
                <div className="flex-1">
                  <div className={`text-primary text-lg font-medium transition-all duration-300 ease-in-out ${
                    task.completed ? 'line-through opacity-60' : ''
                  }`}>
                    {task.description}
                  </div>
                  <div className="text-secondary text-sm mt-2 font-medium">
                    {slotInfo.label} • <span className="font-time">{slotInfo.time}</span> • Position {slotIndex + 1}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onDeleteTask(task.id)}
                className="flex-shrink-0 w-9 h-9 text-secondary hover:text-error hover:bg-red-500/10 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110"
                aria-label="Delete task"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};