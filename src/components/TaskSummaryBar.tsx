import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Circle, TrendingUp, Eye, EyeOff } from 'lucide-react';

interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

interface TaskSummaryBarProps {
  tasks: Task[];
}

export const TaskSummaryBar: React.FC<TaskSummaryBarProps> = ({ tasks }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for accurate timestamps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Calculate completion stats
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const completionRatio = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = currentTime;
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return formatTime(date);
  };

  // Get completion percentage color
  const getCompletionColor = () => {
    if (completionRatio >= 80) return 'text-green-500';
    if (completionRatio >= 50) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      {/* Summary Bar */}
      <div 
        className="backdrop-blur-md border-t transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: 'var(--glass-bg)',
          borderColor: 'var(--border-primary)',
          maxHeight: isExpanded ? '20vh' : '4rem'
        }}
      >
        {/* Collapsed View */}
        <div className="px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* Left: Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-tertiary" />
                <span className="text-sm font-medium text-secondary">
                  Daily Progress
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`text-sm font-semibold ${getCompletionColor()}`}>
                  {completedTasks.length}/{tasks.length} completed
                </div>
                
                {tasks.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-16 h-1.5 rounded-full overflow-hidden"
                      style={{
                        backgroundColor: isDarkMode 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(59, 130, 246, 0.2)'
                      }}
                    >
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${completionRatio}%` }}
                      />
                    </div>
                    <span className="text-xs text-tertiary font-medium font-time">
                      {Math.round(completionRatio)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Center: Quick Task Preview */}
            <div className="flex-1 max-w-md mx-6">
              {tasks.length > 0 ? (
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* Recent completed task */}
                  {completedTasks.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-success">
                      <CheckCircle2 size={12} />
                      <span className="truncate max-w-24">
                        {completedTasks[completedTasks.length - 1].description}
                      </span>
                    </div>
                  )}
                  
                  {/* Separator */}
                  {completedTasks.length > 0 && pendingTasks.length > 0 && (
                    <div className="w-px h-3 bg-tertiary opacity-30" />
                  )}
                  
                  {/* Next pending task */}
                  {pendingTasks.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-tertiary">
                      <Circle size={12} />
                      <span className="truncate max-w-24">
                        {pendingTasks[0].description}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-tertiary italic text-center">
                  No tasks yet
                </div>
              )}
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-tertiary font-time">
                {formatTime(currentTime)}
              </div>
              
              {tasks.length > 0 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)'
                  }}
                  aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                >
                  {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && tasks.length > 0 && (
          <div 
            className="px-6 pb-4 border-t overflow-y-auto"
            style={{
              borderColor: 'var(--border-primary)',
              maxHeight: 'calc(20vh - 4rem)'
            }}
          >
            <div className="max-w-6xl mx-auto pt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-success mb-2 flex items-center gap-1.5">
                      <CheckCircle2 size={12} />
                      Completed ({completedTasks.length})
                    </h4>
                    <div className="space-y-1.5">
                      {completedTasks.slice(-3).map(task => (
                        <div 
                          key={task.id}
                          className="flex items-center justify-between text-xs p-2 rounded-lg"
                          style={{
                            backgroundColor: 'var(--success-bg)'
                          }}
                        >
                          <span className="truncate flex-1 mr-2" style={{ color: 'var(--success-text)' }}>
                            {task.description}
                          </span>
                          <span className="opacity-70 font-time text-xs" style={{ color: 'var(--success-text)' }}>
                            {task.completedAt ? formatRelativeTime(task.completedAt) : 'Done'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Tasks */}
                {pendingTasks.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-tertiary mb-2 flex items-center gap-1.5">
                      <Circle size={12} />
                      Pending ({pendingTasks.length})
                    </h4>
                    <div className="space-y-1.5">
                      {pendingTasks.slice(0, 3).map(task => (
                        <div 
                          key={task.id}
                          className="flex items-center justify-between text-xs p-2 rounded-lg"
                          style={{
                            backgroundColor: 'var(--bg-tertiary)'
                          }}
                        >
                          <span className="text-secondary truncate flex-1 mr-2">
                            {task.description}
                          </span>
                          <span className="text-tertiary font-time text-xs">
                            {formatRelativeTime(task.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Stats */}
              <div 
                className="mt-3 pt-3 border-t flex justify-center"
                style={{
                  borderColor: 'var(--border-primary)'
                }}
              >
                <div className="text-xs text-tertiary font-medium">
                  {completionRatio === 100 ? '🎉 All tasks completed!' : 
                   completionRatio >= 80 ? '💪 Almost there!' :
                   completionRatio >= 50 ? '📈 Good progress!' :
                   '🚀 Keep going!'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};