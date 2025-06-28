import { useState, useEffect, useCallback } from 'react';
import { Task } from '../components/TaskList';
import { TimeSlot } from '../components/TimeSlotManager';

const STORAGE_KEY = 'daily-tasks';
const TIME_SLOTS_KEY = 'time-slots-order';

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
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

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(DEFAULT_TIME_SLOTS);

  // Load tasks and time slots from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }

    const savedTimeSlots = localStorage.getItem(TIME_SLOTS_KEY);
    if (savedTimeSlots) {
      try {
        const parsedTimeSlots = JSON.parse(savedTimeSlots);
        setTimeSlots(parsedTimeSlots);
      } catch (error) {
        console.error('Error loading time slots:', error);
        setTimeSlots(DEFAULT_TIME_SLOTS);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Save time slots to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(TIME_SLOTS_KEY, JSON.stringify(timeSlots));
  }, [timeSlots]);

  const addTask = useCallback((description: string) => {
    if (tasks.length >= 3) return;

    const usedSlots = tasks.map(task => task.timeSlot);
    const availableSlot = timeSlots.find(slot => !usedSlots.includes(slot.id));

    if (!availableSlot) return;

    const newTask: Task = {
      id: Date.now().toString(),
      description,
      timeSlot: availableSlot.id,
      completed: false,
      createdAt: new Date()
    };

    setTasks(prev => [...prev, newTask]);
  }, [tasks, timeSlots]);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const reorderTimeSlots = useCallback((newOrder: TimeSlot[]) => {
    setTimeSlots(newOrder);
  }, []);

  return {
    tasks,
    timeSlots,
    addTask,
    toggleTask,
    deleteTask,
    clearAllTasks,
    reorderTimeSlots,
    canAddTask: tasks.length < 3,
    remainingSlots: 3 - tasks.length
  };
};