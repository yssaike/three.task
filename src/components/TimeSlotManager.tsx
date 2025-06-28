import React, { useState, useRef, useEffect } from 'react';
import { GripVertical, RotateCcw } from 'lucide-react';

export interface TimeSlot {
  id: 'morning' | 'afternoon' | 'evening';
  label: string;
  time: string;
  gradient: string;
  border: string;
  icon: string;
}

interface TimeSlotManagerProps {
  timeSlots: TimeSlot[];
  onReorder: (newOrder: TimeSlot[]) => void;
}

export const TimeSlotManager: React.FC<TimeSlotManagerProps> = ({ timeSlots, onReorder }) => {
  const [draggedItem, setDraggedItem] = useState<TimeSlot | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragStart = (e: React.DragEvent, item: TimeSlot) => {
    setDraggedItem(item);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    
    // Add a slight delay to ensure the drag image is captured
    setTimeout(() => {
      if (e.currentTarget) {
        e.currentTarget.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    setDragOverIndex(null);
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    dragCounter.current = 0;

    if (!draggedItem) return;

    const dragIndex = timeSlots.findIndex(slot => slot.id === draggedItem.id);
    if (dragIndex === dropIndex) return;

    const newTimeSlots = [...timeSlots];
    const [removed] = newTimeSlots.splice(dragIndex, 1);
    newTimeSlots.splice(dropIndex, 0, removed);

    onReorder(newTimeSlots);
    
    // Add success feedback
    const dropElement = e.currentTarget as HTMLElement;
    dropElement.style.transform = 'scale(1.05)';
    setTimeout(() => {
      dropElement.style.transform = 'scale(1)';
    }, 200);
  };

  const resetToDefault = () => {
    const defaultOrder: TimeSlot[] = [
      { 
        id: 'morning', 
        label: 'Morning', 
        time: '9:00 AM - 12:00 PM', 
        gradient: 'from-blue-400/20 to-cyan-400/20',
        border: 'border-blue-400/30',
        icon: '🌅'
      },
      { 
        id: 'afternoon', 
        label: 'Afternoon', 
        time: '1:00 PM - 4:00 PM', 
        gradient: 'from-amber-400/20 to-orange-400/20',
        border: 'border-amber-400/30',
        icon: '☀️'
      },
      { 
        id: 'evening', 
        label: 'Evening', 
        time: '5:00 PM - 8:00 PM', 
        gradient: 'from-purple-400/20 to-pink-400/20',
        border: 'border-purple-400/30',
        icon: '🌙'
      }
    ];
    onReorder(defaultOrder);
  };

  return (
    <div className="mb-8">
      <div className="glass-card p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-light text-primary flex items-center gap-3">
            <GripVertical size={24} />
            Customize Your Schedule
          </h2>
          <button
            onClick={resetToDefault}
            className="glass-card px-4 py-2 hover:scale-105 transition-all duration-300 ease-in-out flex items-center gap-2 text-sm font-medium text-button hover:text-button"
            title="Reset to default order"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
        <p className="text-secondary font-normal">Drag and drop to rearrange your daily time blocks</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {timeSlots.map((slot, index) => (
          <div
            key={slot.id}
            draggable
            onDragStart={(e) => handleDragStart(e, slot)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`glass-card p-6 cursor-move transition-all duration-300 ease-in-out bg-gradient-to-br ${slot.gradient} border-2 ${slot.border} ${
              dragOverIndex === index && draggedItem?.id !== slot.id
                ? 'scale-105 ring-2 ring-blue-400 ring-opacity-50 shadow-lg shadow-blue-400/25'
                : 'hover:scale-105'
            } ${
              draggedItem?.id === slot.id
                ? 'opacity-50 scale-95'
                : ''
            } ${
              isDragging && draggedItem?.id !== slot.id
                ? 'hover:ring-2 hover:ring-green-400 hover:ring-opacity-50'
                : ''
            }`}
            role="button"
            tabIndex={0}
            aria-label={`Drag to reorder ${slot.label} time slot`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
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
              <div className="text-tertiary hover:text-secondary transition-colors duration-200">
                <GripVertical size={20} />
              </div>
            </div>
            
            <div className="text-xs text-tertiary font-medium">
              Position {index + 1} of 3
            </div>
          </div>
        ))}
      </div>
      
      {isDragging && (
        <div className="mt-4 glass-card p-4 text-center">
          <div className="text-primary font-medium">
            Drop the time slot in your preferred position
          </div>
          <div className="text-secondary text-sm mt-1 font-normal">
            Green highlight indicates valid drop zones
          </div>
        </div>
      )}
    </div>
  );
};