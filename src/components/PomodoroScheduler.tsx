import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, SkipForward, Coffee, CheckCircle2, AlertCircle, Timer } from 'lucide-react';

interface Task {
  id: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  createdAt: Date;
}

interface ScheduleBlock {
  id: string;
  type: 'work' | 'break';
  taskId?: string;
  taskDescription?: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  completed: boolean;
}

interface PomodoroSchedulerProps {}

export const PomodoroScheduler: React.FC<PomodoroSchedulerProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([]);
  const [currentBlock, setCurrentBlock] = useState<ScheduleBlock | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [durationInput, setDurationInput] = useState('');

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            completeCurrentBlock();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  // Generate schedule when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      generateSchedule();
    } else {
      setSchedule([]);
      setCurrentBlock(null);
    }
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskInput.trim() && durationInput && tasks.length < 3) {
      const duration = parseInt(durationInput);
      if (duration > 0 && duration <= 480) { // Max 8 hours
        const newTask: Task = {
          id: Date.now().toString(),
          description: taskInput.trim(),
          estimatedMinutes: duration,
          completed: false,
          createdAt: new Date()
        };
        setTasks(prev => [...prev, newTask]);
        setTaskInput('');
        setDurationInput('');
      }
    }
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const generateSchedule = () => {
    const blocks: ScheduleBlock[] = [];
    let currentTime = getNextHour();

    tasks.forEach((task, index) => {
      const pomodoroSessions = Math.ceil(task.estimatedMinutes / 25);
      
      for (let session = 0; session < pomodoroSessions; session++) {
        // Work block (25 minutes or remaining time)
        const workDuration = Math.min(25, task.estimatedMinutes - (session * 25));
        const workBlock: ScheduleBlock = {
          id: `${task.id}-work-${session}`,
          type: 'work',
          taskId: task.id,
          taskDescription: task.description,
          startTime: new Date(currentTime),
          endTime: new Date(currentTime.getTime() + workDuration * 60000),
          duration: workDuration,
          completed: false
        };
        blocks.push(workBlock);
        currentTime = new Date(workBlock.endTime);

        // Break block (5 minutes, except after last session of last task)
        const isLastSession = session === pomodoroSessions - 1;
        const isLastTask = index === tasks.length - 1;
        
        if (!isLastSession || !isLastTask) {
          const breakDuration = isLastSession && index < tasks.length - 1 ? 15 : 5; // Longer break between tasks
          const breakBlock: ScheduleBlock = {
            id: `${task.id}-break-${session}`,
            type: 'break',
            startTime: new Date(currentTime),
            endTime: new Date(currentTime.getTime() + breakDuration * 60000),
            duration: breakDuration,
            completed: false
          };
          blocks.push(breakBlock);
          currentTime = new Date(breakBlock.endTime);
        }
      }
    });

    setSchedule(blocks);
    if (blocks.length > 0 && !currentBlock) {
      setCurrentBlock(blocks[0]);
      setTimeRemaining(blocks[0].duration * 60);
    }
  };

  const getNextHour = () => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    return nextHour;
  };

  const startTimer = () => {
    if (currentBlock && timeRemaining > 0) {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const skipBlock = () => {
    completeCurrentBlock();
  };

  const completeCurrentBlock = () => {
    if (!currentBlock) return;

    // Mark current block as completed
    setSchedule(prev => 
      prev.map(block => 
        block.id === currentBlock.id 
          ? { ...block, completed: true }
          : block
      )
    );

    // Find next incomplete block
    const currentIndex = schedule.findIndex(block => block.id === currentBlock.id);
    const nextBlock = schedule.find((block, index) => 
      index > currentIndex && !block.completed
    );

    if (nextBlock) {
      setCurrentBlock(nextBlock);
      setTimeRemaining(nextBlock.duration * 60);
    } else {
      // All blocks completed
      setCurrentBlock(null);
      setTimeRemaining(0);
      // Mark all tasks as completed
      setTasks(prev => prev.map(task => ({ ...task, completed: true })));
    }
    
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatScheduleTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTotalDuration = () => {
    return schedule.reduce((total, block) => total + block.duration, 0);
  };

  const getCompletedDuration = () => {
    return schedule.filter(block => block.completed).reduce((total, block) => total + block.duration, 0);
  };

  const getScheduleEndTime = () => {
    if (schedule.length === 0) return null;
    return schedule[schedule.length - 1].endTime;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-light text-primary mb-4 flex items-center justify-center gap-3">
          <Timer size={36} className="text-yinmn-blue-500" />
          Focused Work Schedule
        </h1>
        <p className="text-lg text-secondary font-normal max-w-3xl mx-auto">
          Create a focused work schedule by entering up to 3 tasks. Each task will be automatically 
          scheduled with built-in Pomodoro breaks (25 minutes work + 5 minutes break).
        </p>
      </div>

      {/* Task Input */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-light text-primary mb-6">Add Tasks (Maximum 3)</h2>
        
        <form onSubmit={addTask} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Enter task description..."
                maxLength={100}
                disabled={tasks.length >= 3}
                className="w-full px-4 py-3 glass-card text-input placeholder:text-placeholder border-none outline-none text-lg font-normal focus:ring-2 focus:ring-yinmn-blue-500 focus:ring-offset-2 disabled:opacity-50"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
                placeholder="Minutes"
                min="1"
                max="480"
                disabled={tasks.length >= 3}
                className="flex-1 px-4 py-3 glass-card text-input placeholder:text-placeholder border-none outline-none text-lg font-normal focus:ring-2 focus:ring-yinmn-blue-500 focus:ring-offset-2 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!taskInput.trim() || !durationInput || tasks.length >= 3}
                className="btn-primary px-6 py-3 rounded-lg disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 ease-in-out flex items-center gap-2 font-medium focus:ring-2 focus:ring-yinmn-blue-500 focus:ring-offset-2"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-tertiary">
            <span className="font-medium">{tasks.length}/3 tasks added</span>
            <span className="font-medium">Duration: 1-480 minutes</span>
          </div>
        </form>

        {/* Task List */}
        {tasks.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-medium text-primary">Your Tasks</h3>
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 glass-card hover:scale-[1.01] transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium text-secondary font-time min-w-[2rem]">
                    {index + 1}.
                  </span>
                  <div>
                    <div className="text-primary font-medium">{task.description}</div>
                    <div className="text-secondary text-sm">
                      {task.estimatedMinutes} minutes • {Math.ceil(task.estimatedMinutes / 25)} Pomodoro sessions
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-error hover:scale-110 transition-all duration-200 p-2"
                  aria-label="Remove task"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Timer */}
      {currentBlock && (
        <div className="glass-card p-8 text-center">
          <div className="mb-6">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-lg font-medium ${
              currentBlock.type === 'work' 
                ? 'bg-yinmn-blue-500/20 text-yinmn-blue-600 dark:text-yinmn-blue-400' 
                : 'bg-green-500/20 text-green-600 dark:text-green-400'
            }`}>
              {currentBlock.type === 'work' ? (
                <>
                  <Clock size={24} />
                  Work Session
                </>
              ) : (
                <>
                  <Coffee size={24} />
                  Break Time
                </>
              )}
            </div>
          </div>

          {currentBlock.type === 'work' && (
            <h3 className="text-xl font-medium text-primary mb-4">
              {currentBlock.taskDescription}
            </h3>
          )}

          <div className="text-6xl font-light text-primary mb-8 font-time">
            {formatTime(timeRemaining)}
          </div>

          <div className="flex justify-center gap-4 mb-6">
            {!isRunning ? (
              <button
                onClick={startTimer}
                disabled={timeRemaining === 0}
                className="btn-primary px-8 py-4 rounded-xl text-lg font-medium flex items-center gap-3 disabled:opacity-50"
              >
                <Play size={24} />
                Start
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="btn-secondary px-8 py-4 rounded-xl text-lg font-medium flex items-center gap-3"
              >
                <Pause size={24} />
                Pause
              </button>
            )}
            
            <button
              onClick={skipBlock}
              className="btn-tertiary px-8 py-4 rounded-xl text-lg font-medium flex items-center gap-3"
            >
              <SkipForward size={24} />
              Skip
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-secondary font-medium">Session Progress</span>
              <span className="text-sm text-secondary font-medium font-time">
                {Math.round(((currentBlock.duration * 60 - timeRemaining) / (currentBlock.duration * 60)) * 100)}%
              </span>
            </div>
            <div className="w-full h-3 bg-silver-lake-blue-200 dark:bg-rich-black-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  currentBlock.type === 'work' 
                    ? 'bg-gradient-to-r from-yinmn-blue-500 to-yinmn-blue-600' 
                    : 'bg-gradient-to-r from-green-500 to-green-600'
                }`}
                style={{ 
                  width: `${((currentBlock.duration * 60 - timeRemaining) / (currentBlock.duration * 60)) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Schedule Overview */}
      {schedule.length > 0 && (
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light text-primary">Today's Schedule</h2>
            <div className="text-right">
              <div className="text-sm text-secondary">
                Total Duration: {Math.floor(getTotalDuration() / 60)}h {getTotalDuration() % 60}m
              </div>
              {getScheduleEndTime() && (
                <div className="text-sm text-tertiary">
                  Ends at: {formatScheduleTime(getScheduleEndTime()!)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {schedule.map((block, index) => (
              <div
                key={block.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                  currentBlock?.id === block.id
                    ? 'border-yinmn-blue-500 bg-yinmn-blue-500/10 scale-[1.02]'
                    : block.completed
                    ? 'border-green-500/30 bg-green-500/10'
                    : 'border-gray-300/30 dark:border-gray-600/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary text-sm font-medium">
                    {index + 1}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {block.type === 'work' ? (
                      <Clock size={20} className="text-yinmn-blue-500" />
                    ) : (
                      <Coffee size={20} className="text-green-500" />
                    )}
                    
                    <div>
                      <div className="font-medium text-primary">
                        {block.type === 'work' ? block.taskDescription : 'Break'}
                      </div>
                      <div className="text-sm text-secondary">
                        {formatScheduleTime(block.startTime)} - {formatScheduleTime(block.endTime)} 
                        <span className="ml-2 font-time">({block.duration} min)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {block.completed && (
                    <CheckCircle2 size={20} className="text-green-500" />
                  )}
                  {currentBlock?.id === block.id && isRunning && (
                    <div className="w-2 h-2 bg-yinmn-blue-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Overall Progress */}
          <div className="mt-6 pt-6 border-t border-primary">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-secondary font-medium">Overall Progress</span>
              <span className="text-sm text-secondary font-medium font-time">
                {Math.round((getCompletedDuration() / getTotalDuration()) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-silver-lake-blue-200 dark:bg-rich-black-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-yinmn-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(getCompletedDuration() / getTotalDuration()) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {tasks.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h3 className="text-xl font-light text-primary mb-2">Ready to Focus?</h3>
          <p className="text-secondary font-normal max-w-md mx-auto">
            Add up to 3 tasks with estimated durations. The system will automatically create 
            a schedule with Pomodoro breaks to maximize your productivity.
          </p>
        </div>
      )}
    </div>
  );
};