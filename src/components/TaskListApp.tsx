import React, { useState, useEffect } from 'react';
import { Plus, Mail, Trash2, Check, Palette, Timer } from 'lucide-react';
import { Clock } from './Clock';
import { ClockDisplay } from './ClockDisplay';
import { SettingsMenu } from './SettingsMenu';
import { YouTubePlayer } from './YouTubePlayer';
import { TaskSummaryBar } from './TaskSummaryBar';
import { ColorSystemDemo } from './ColorSystemDemo';
import { PomodoroScheduler } from './PomodoroScheduler';
import { AudioPlayer } from './AudioPlayer';
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
  const [showColorDemo, setShowColorDemo] = useState(false);
  const [showPomodoroScheduler, setShowPomodoroScheduler] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Handle midnight reset
  const handleMidnight = () => {
    // Reset daily summary at midnight
    setTasks(prev => prev.map(task => ({
      ...task,
      completedAt: task.completed && !task.completedAt ? new Date() : task.completedAt
    })));
  };

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

  // Show Pomodoro Scheduler if enabled
  if (showPomodoroScheduler) {
    return (
      <>
        {/* Clock Display */}
        <div className="mb-8">
          <Clock onMidnight={handleMidnight} />
        </div>
            <button
              onClick={() => setShowPomodoroScheduler(false)}
              className="text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium flex items-center gap-2"
            >
              ← Back to Task List
            </button>
            
            <div className="flex items-start gap-4">
              <button
                onClick={() => setShowColorDemo(!showColorDemo)}
                className="glass-card p-3 hover:scale-105 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Toggle color system demo"
                title="Color System Demo"
              >
                <Palette size={24} className="text-yinmn-blue-500" />
              </button>
              <SettingsMenu isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
            </div>

          {/* Color System Demo */}
          {showColorDemo && <ColorSystemDemo />}

          {/* Pomodoro Scheduler */}
          <PomodoroScheduler isDarkMode={isDarkMode} />
      </>
    );
  }

  return (
    <>
      {/* Fixed Clock Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-white/95 to-white/80 dark:from-rich-black-900/95 dark:to-rich-black-900/80 backdrop-blur-md border-b border-primary pb-4 mb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Clock onMidnight={handleMidnight} />
        </div>
      </div>

      <div className="space-y-8 pb-20 pt-4">
        {/* Header with Clock and Settings */}
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-light text-primary mb-4">
              Daily Task Hierarchy
            </h1>
            <p className="text-lg text-secondary font-normal max-w-2xl">
              Organize your day with a clear hierarchical structure. Tasks are displayed in order of priority beneath the digital clock.
            </p>
          </div>
          
          <div className="flex items-start gap-4">
            <button
              onClick={() => setShowPomodoroScheduler(true)}
              className="glass-card p-3 hover:scale-105 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Open Pomodoro scheduler"
              title="Focused Work Schedule"
            >
              <Timer size={24} className="text-green-500" />
            </button>
            <button
              onClick={() => setShowColorDemo(!showColorDemo)}
              className="glass-card p-3 hover:scale-105 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Toggle color system demo"
              title="Color System Demo"
            >
              <Palette size={24} className="text-yinmn-blue-500" />
            </button>
            <SettingsMenu isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
          </div>
        </div>

        {/* Color System Demo */}
        {showColorDemo && <ColorSystemDemo />}

        {/* Built-in Audio Player */}
        <AudioPlayer isDarkMode={isDarkMode} />

        {/* Task Input Section */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-light text-primary mb-6 flex items-center gap-3">
            <span className="text-3xl">📋</span>
            Task Entry
          </h2>
          
          <form onSubmit={addTask} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Enter your task here..."
                maxLength={200}
                className="w-full px-4 py-3 glass-card text-input placeholder:text-placeholder border-none outline-none text-lg font-normal focus:ring-2 focus:ring-yinmn-blue-500 focus:ring-offset-2"
              />
            </div>
            <button
              type="submit"
              disabled={!taskInput.trim()}
              className="btn-primary px-6 py-3 rounded-lg disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 ease-in-out flex items-center gap-3 font-medium focus:ring-2 focus:ring-yinmn-blue-500 focus:ring-offset-2"
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
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light text-primary flex items-center gap-3">
                <span className="text-3xl">📝</span>
                Task Hierarchy
              </h2>
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

            {/* Hierarchical Task List */}
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`relative pl-8 pr-6 py-6 glass-card hover:scale-[1.01] transition-all duration-300 border-l-4 ${
                    task.completed ? 'opacity-75' : ''
                  } ${
                    task.completed 
                      ? 'border-l-success-500 bg-success-500/5' 
                      : 'border-l-yinmn-blue-500 bg-yinmn-blue-500/5'
                  }`}
                >
                  {/* Task Number Badge */}
                  <div className="absolute -left-2 top-4 w-8 h-8 rounded-full bg-yinmn-blue-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>

                  <div className="flex items-start gap-4 flex-1">
                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      {/* Priority Level Indicator */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                          {index === 0 ? 'High Priority' : index === 1 ? 'Medium Priority' : 'Low Priority'}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${
                          index === 0 ? 'bg-error-500' : index === 1 ? 'bg-warning-500' : 'bg-info-500'
                        }`} />
                      </div>

                      {/* Task Description */}
                      <div className={`text-xl font-medium text-primary mb-3 transition-all duration-300 leading-relaxed ${
                        task.completed ? 'line-through opacity-60' : ''
                      }`}>
                        {task.description}
                      </div>

                      {/* Task Metadata */}
                      <div className="flex items-center gap-4 text-sm text-tertiary">
                        <span className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-tertiary rounded-full" />
                          Position {index + 1}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-tertiary rounded-full" />
                          Created {task.createdAt.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {task.completed && (
                          <span className="flex items-center gap-1 text-success-600">
                            <span className="w-1 h-1 bg-success-500 rounded-full" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 ${
                          task.completed
                            ? 'bg-success-500 border-success-500 text-white shadow-lg shadow-success-500/25'
                            : 'border-yinmn-blue-500 hover:border-success-500 hover:bg-success-500/10'
                        }`}
                        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.completed && <Check size={16} />}
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="w-8 h-8 text-tertiary hover:text-error hover:scale-110 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out bg-error-500/10 hover:bg-error-500/20"
                        aria-label="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hierarchy Legend */}
            <div className="mt-8 pt-6 border-t border-primary">
              <h3 className="text-lg font-medium text-primary mb-4">Task Priority Legend</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-error-500/10 border border-error-500/20">
                  <div className="w-3 h-3 bg-error-500 rounded-full" />
                  <div>
                    <div className="text-sm font-medium text-primary">High Priority</div>
                    <div className="text-xs text-secondary">Position 1 - Most urgent</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-warning-500/10 border border-warning-500/20">
                  <div className="w-3 h-3 bg-warning-500 rounded-full" />
                  <div>
                    <div className="text-sm font-medium text-primary">Medium Priority</div>
                    <div className="text-xs text-secondary">Position 2 - Important</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-info-500/10 border border-info-500/20">
                  <div className="w-3 h-3 bg-info-500 rounded-full" />
                  <div>
                    <div className="text-sm font-medium text-primary">Low Priority</div>
                    <div className="text-xs text-secondary">Position 3 - When time allows</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Section */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-light text-primary mb-4 flex items-center gap-3">
            <Mail size={28} className="text-yinmn-blue-500" />
            Email Task Hierarchy
          </h2>
          <p className="text-secondary font-normal mb-6">
            Send your prioritized task hierarchy via email for external reference and sharing with team members.
          </p>

          <form onSubmit={sendTaskListEmail} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-4 py-3 glass-card text-input placeholder:text-placeholder border-none outline-none text-lg font-normal focus:ring-2 focus:ring-yinmn-blue-500 focus:ring-offset-2"
                />
              </div>
              <button
                type="submit"
                disabled={!emailInput.trim() || tasks.length === 0}
                className="btn-secondary px-6 py-3 rounded-lg disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 ease-in-out flex items-center gap-3 font-medium focus:ring-2 focus:ring-oxford-blue-500 focus:ring-offset-2"
              >
                <Mail size={20} />
                Send Email
              </button>
            </div>

            {emailError && (
              <div className="status-error p-3 rounded-lg text-sm font-medium">
                {emailError}
              </div>
            )}

            {isEmailSent && (
              <div className="status-success p-3 rounded-lg text-sm font-medium">
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
            <div className="text-6xl mb-6">⏰</div>
            <h3 className="text-2xl font-light text-primary mb-4">Ready to Organize Your Day?</h3>
            <p className="text-secondary font-normal mb-6">
              Add your first task to begin building your daily hierarchy. Tasks will be automatically prioritized and organized beneath the digital clock.
            </p>
            <button
              onClick={() => setShowPomodoroScheduler(true)}
              className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center gap-3 mx-auto"
            >
              <Timer size={20} />
              Try Focused Work Schedule
            </button>
          </div>
        )}
      </div>

      {/* Task Summary Bar - Fixed at bottom */}
      <TaskSummaryBar tasks={tasks} isDarkMode={isDarkMode} />
    </>
  );
};