import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (description: string) => void;
  canAddTask: boolean;
  remainingSlots: number;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask, canAddTask, remainingSlots }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && canAddTask) {
      onAddTask(description.trim());
      setDescription('');
    }
  };

  return (
    <div className="p-7">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="flex-1 glass-card p-1">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What would you like to accomplish today?"
            maxLength={100}
            disabled={!canAddTask}
            className="w-full px-4 py-3 bg-transparent text-input placeholder:text-placeholder border-none outline-none text-lg font-normal disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={!description.trim() || !canAddTask}
          className="glass-card px-6 py-3 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition-all duration-300 ease-in-out flex items-center gap-3 font-medium text-button hover:text-button"
        >
          <Plus size={20} />
          Add Task
        </button>
      </form>
      
      <div className="mt-4 flex justify-between items-center text-sm text-tertiary">
        <span className="font-medium">{description.length}/100 characters</span>
        <span className="font-medium">
          {remainingSlots} of 3 slots remaining
        </span>
      </div>
    </div>
  );
};