import React, { useState, useEffect } from 'react';
import { Plus, Mail, Trash2, Check } from 'lucide-react';
import { ClockDisplay } from './ClockDisplay';
import { SettingsMenu } from './SettingsMenu';
import { BackgroundPlayer } from './BackgroundPlayer';
import { TaskSummaryBar } from './TaskSummaryBar';
import { useDarkMode } from '../hooks/useDarkMode';

interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export const TaskListApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Auto-refresh at end of day (midnight)
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        // Reset daily summary at midnight
        setTasks(prev => prev.map(task => ({
          ...task,
          completedAt: task.completed && !task.completedAt ? now : task.completedAt
        })));
      }
    };

    const timer = setInterval(checkMidnight, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskInput.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        description: taskInput.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTasks(prev => [...prev, newTask]);
      setTaskInput('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { 
          ...task, 
          completed: !task.completed,
          completedAt: !task.completed ? new Date() : undefined
        } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendTaskListEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    
    if (!validateEmail(emailInput)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (tasks.length === 0) {
      setEmailError('Please add at least one task before sending');
      return;
    }

    // Simulate email sending (in a real app, this would call an API)
    try {
      // Create email content
      const taskListContent = tasks.map((task, index) => 
        `${index + 1}. ${task.description} ${task.completed ? '✓' : ''}`
      ).join('\n');

      const emailSubject = `Your Task List - ${new Date().toLocaleDateString()}`;
      const emailBody = `Here's your task list:\n\n${taskListContent}\n\nTotal tasks: ${tasks.length}\nCompleted: ${tasks.filter(t => t.completed).length}\nRemaining: ${tasks.filter(t => !t.completed).length}`;

      // In a real application, you would send this to your backend API
      console.log('Email would be sent to:', emailInput);
      console.log('Subject:', emailSubject);
      console.log('Body:', emailBody);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsEmailSent(true);
      setEmailInput('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsEmailSent(false), 3000);
    } catch (error) {
      setEmailError('Failed to send email. Please try again.');
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <>
      <div className="space-y-8 pb-20"> {/* Added bottom padding for summary bar */}
        {/* Header with Clock and Settings */}
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-light text-primary mb-4">
              Task List Manager
            </h1>
            <p className="text-lg text-secondary font-normal max-w-2xl">
              Create a task list by entering your items below. Each task will be automatically numbered and organized for easy tracking.
            </p>
          </div>
          
          <div className="flex items-start gap-4">
            <ClockDisplay />
            <SettingsMenu isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
          </div>
        </div>

        {/* Background Audio Player */}
        <BackgroundPlayer isDarkMode={isDarkMode} />

        {/* Task Input Section */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-light text-primary mb-6">Add New Task</h2>
          
          <form onSubmit={addTask} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Enter your task here..."
                maxLength={200}
                className="w-full px-4 py-3 glass-card text-input placeholder:text-placeholder border-none outline-none text-lg font-normal focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              />
            </div>
            <button
              type="submit"
              disabled={!taskInput.trim()}
              className="glass-card px-6 py-3 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition-all duration-300 ease-in-out flex items-center gap-3 font-medium text-button hover:text-button focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus size={20} />
              Add Task
            </button>
          </form>
          
          <div className="mt-4 flex justify-between items-center text-sm text-tertiary">
            <span className="font-medium">{taskInput.length}/200 characters</span>
            <span className="font-medium">
              {totalCount} task{totalCount !== 1 ? 's' : ''} total
            </span>
          </div>
        </div>

        {/* Task List */}
        {tasks.length > 0 && (
          <div className="glass-card p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light text-primary">Your Tasks</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-secondary font-medium">
                  {completedCount} of {totalCount} completed
                </span>
                <button
                  onClick={clearAllTasks}
                  className="text-sm text-error hover:opacity-80 font-medium transition-opacity duration-200 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-4 p-4 glass-card hover:scale-[1.01] transition-all duration-200 ${
                    task.completed ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg font-medium text-secondary font-time min-w-[2rem]">
                      {index + 1}.
                    </span>
                    
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 ${
                        task.completed
                          ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/25'
                          : isDarkMode 
                            ? 'border-gray-300 hover:border-green-400 hover:bg-green-400/10'
                            : 'border-blue-600 hover:border-green-500 hover:bg-green-500/10'
                      }`}
                      aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {task.completed && <Check size={14} />}
                    </button>

                    <span className={`text-lg font-normal text-primary flex-1 transition-all duration-300 ${
                      task.completed ? 'line-through opacity-60' : ''
                    }`}>
                      {task.description}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 w-8 h-8 text-tertiary hover:text-error hover:scale-110 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.1)'
                    }}
                    aria-label="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            {totalCount > 0 && (
              <div 
                className="mt-6 pt-6 border-t"
                style={{
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(59, 130, 246, 0.2)'
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary font-medium">Progress</span>
                  <span className="text-sm text-secondary font-medium font-time">
                    {Math.round((completedCount / totalCount) * 100)}%
                  </span>
                </div>
                <div 
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.2)'
                  }}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Email Section */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-light text-primary mb-4">Email Your Task List</h2>
          <p className="text-secondary font-normal mb-6">
            To receive your complete task list via email, enter your email address in the field below. 
            We'll send you a copy of all your tasks for convenient reference and tracking.
          </p>

          <form onSubmit={sendTaskListEmail} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-4 py-3 glass-card text-input placeholder:text-placeholder border-none outline-none text-lg font-normal focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
              </div>
              <button
                type="submit"
                disabled={!emailInput.trim() || tasks.length === 0}
                className="glass-card px-6 py-3 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition-all duration-300 ease-in-out flex items-center gap-3 font-medium text-button hover:text-button focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Mail size={20} />
                Send Email
              </button>
            </div>

            {emailError && (
              <div 
                className="text-error text-sm font-medium p-3 rounded-lg border"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                  borderColor: isDarkMode ? 'rgba(248, 113, 113, 0.3)' : 'rgba(220, 38, 38, 0.3)'
                }}
              >
                {emailError}
              </div>
            )}

            {isEmailSent && (
              <div 
                className="text-success text-sm font-medium p-3 rounded-lg border"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(52, 211, 153, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                  borderColor: isDarkMode ? 'rgba(52, 211, 153, 0.3)' : 'rgba(22, 163, 74, 0.3)'
                }}
              >
                ✓ Task list sent successfully! Check your email inbox.
              </div>
            )}

            <div className="text-xs text-tertiary font-medium">
              {tasks.length === 0 
                ? 'Add some tasks before sending an email'
                : `Ready to send ${tasks.length} task${tasks.length !== 1 ? 's' : ''} to your email`
              }
            </div>
          </form>
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-light text-primary mb-2">No tasks yet</h3>
            <p className="text-secondary font-normal">
              Start by adding your first task above. Each task will be automatically numbered for easy organization.
            </p>
          </div>
        )}
      </div>

      {/* Task Summary Bar - Fixed at bottom */}
      <TaskSummaryBar tasks={tasks} isDarkMode={isDarkMode} />
    </>
  );
};