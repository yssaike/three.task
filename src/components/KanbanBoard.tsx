import React, { useState, useRef } from 'react';
import { Plus, X, GripVertical, Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  tasks: KanbanTask[];
}

interface KanbanBoardProps {}

export const KanbanBoard: React.FC<KanbanBoardProps> = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-blue-500',
      tasks: []
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      color: 'bg-yellow-500',
      tasks: []
    },
    {
      id: 'done',
      title: 'Done',
      color: 'bg-green-500',
      tasks: []
    }
  ]);

  const [draggedTask, setDraggedTask] = useState<KanbanTask | null>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showAddTask, setShowAddTask] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const addTask = (columnId: string) => {
    if (!newTaskTitle.trim()) return;

    const newTask: KanbanTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
      priority: newTaskPriority,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setColumns(prev => prev.map(col => 
      col.id === columnId 
        ? { ...col, tasks: [...col.tasks, newTask] }
        : col
    ));

    // Reset form
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setShowAddTask(null);
  };

  const deleteTask = (columnId: string, taskId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId 
        ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
        : col
    ));
  };

  const handleDragStart = (e: React.DragEvent, task: KanbanTask, columnId: string) => {
    setDraggedTask(task);
    setDraggedFromColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback
    setTimeout(() => {
      if (e.currentTarget) {
        (e.currentTarget as HTMLElement).style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTask(null);
    setDraggedFromColumn(null);
    setDragOverColumn(null);
    dragCounter.current = 0;
    
    if (e.currentTarget) {
      (e.currentTarget as HTMLElement).style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    dragCounter.current = 0;

    if (!draggedTask || !draggedFromColumn) return;

    // Don't do anything if dropped in the same column
    if (draggedFromColumn === targetColumnId) return;

    // Move task from source to target column
    setColumns(prev => prev.map(col => {
      if (col.id === draggedFromColumn) {
        // Remove from source column
        return { ...col, tasks: col.tasks.filter(task => task.id !== draggedTask.id) };
      } else if (col.id === targetColumnId) {
        // Add to target column with updated timestamp
        const updatedTask = { ...draggedTask, updatedAt: new Date() };
        return { ...col, tasks: [...col.tasks, updatedTask] };
      }
      return col;
    }));

    // Visual feedback
    const dropElement = e.currentTarget as HTMLElement;
    dropElement.style.transform = 'scale(1.02)';
    setTimeout(() => {
      dropElement.style.transform = 'scale(1)';
    }, 200);
  };

  const getPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'medium':
        return <Clock size={16} className="text-yellow-500" />;
      case 'low':
        return <Circle size={16} className="text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-500/5';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'low':
        return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalTasks = () => {
    return columns.reduce((total, col) => total + col.tasks.length, 0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-light text-primary mb-4 flex items-center justify-center gap-3">
          <div className="grid grid-cols-3 gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-sm"></div>
            <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
            <div className="w-2 h-2 bg-blue-500/50 rounded-sm"></div>
            <div className="w-2 h-2 bg-yellow-500/50 rounded-sm"></div>
            <div className="w-2 h-2 bg-green-500/50 rounded-sm"></div>
          </div>
          Kanban Board
        </h1>
        <p className="text-lg text-secondary font-normal max-w-3xl mx-auto">
          Organize your tasks visually across different stages. Drag and drop tasks between columns to track progress.
        </p>
      </div>

      {/* Stats */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-light text-primary mb-1">{getTotalTasks()}</div>
            <div className="text-sm text-secondary font-medium">Total Tasks</div>
          </div>
          {columns.map(column => (
            <div key={column.id} className="text-center">
              <div className="text-2xl font-light text-primary mb-1">{column.tasks.length}</div>
              <div className="text-sm text-secondary font-medium flex items-center justify-center gap-2">
                <div className={`w-3 h-3 ${column.color} rounded-full`}></div>
                {column.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <div
            key={column.id}
            className={`glass-card p-6 min-h-[600px] transition-all duration-300 ${
              dragOverColumn === column.id && draggedFromColumn !== column.id
                ? 'ring-2 ring-yinmn-blue-500 ring-opacity-50 scale-[1.02]'
                : ''
            }`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 ${column.color} rounded-full`}></div>
                <h3 className="text-xl font-medium text-primary">{column.title}</h3>
                <span className="text-sm text-tertiary bg-tertiary/10 px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
              <button
                onClick={() => setShowAddTask(showAddTask === column.id ? null : column.id)}
                className="w-8 h-8 rounded-full bg-yinmn-blue-500 hover:bg-yinmn-blue-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Add task"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Add Task Form */}
            {showAddTask === column.id && (
              <div className="mb-6 p-4 glass-card border-2 border-yinmn-blue-500/30">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task title..."
                    className="w-full px-3 py-2 glass-card text-input placeholder:text-placeholder border-none outline-none text-sm font-normal focus:ring-2 focus:ring-yinmn-blue-500 focus:ring-offset-1"
                    autoFocus
                  />
                  <textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Description (optional)..."
                    rows={2}
                    className="w-full px-3 py-2 glass-card text-input placeholder:text-placeholder border-none outline-none text-sm font-normal resize-none focus:ring-2 focus:ring-yinmn-blue-500 focus:ring-offset-1"
                  />
                  <div className="flex items-center gap-3">
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="px-3 py-2 glass-card text-input border-none outline-none text-sm font-normal focus:ring-2 focus:ring-yinmn-blue-500 focus:ring-offset-1"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <button
                      onClick={() => addTask(column.id)}
                      disabled={!newTaskTitle.trim()}
                      className="btn-primary px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddTask(null)}
                      className="btn-tertiary px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks */}
            <div className="space-y-3">
              {column.tasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, column.id)}
                  onDragEnd={handleDragEnd}
                  className={`p-4 glass-card cursor-move hover:scale-[1.02] transition-all duration-200 border-l-4 ${getPriorityColor(task.priority)}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-primary font-medium mb-1 leading-tight">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-secondary text-sm leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteTask(column.id, task.id)}
                      className="text-tertiary hover:text-error transition-colors duration-200 p-1"
                      aria-label="Delete task"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(task.priority)}
                      <span className="text-xs text-tertiary font-medium capitalize">
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GripVertical size={14} className="text-tertiary" />
                      <span className="text-xs text-tertiary font-time">
                        {formatDate(task.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {column.tasks.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">
                    {column.id === 'todo' ? '📝' : column.id === 'inprogress' ? '⚡' : '✅'}
                  </div>
                  <div className="text-tertiary text-sm font-medium">
                    {column.id === 'todo' ? 'No tasks to do' : 
                     column.id === 'inprogress' ? 'No tasks in progress' : 
                     'No completed tasks'}
                  </div>
                  <div className="text-tertiary text-xs mt-1">
                    {showAddTask !== column.id && 'Click + to add a task'}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium text-primary mb-4">How to Use the Kanban Board</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-secondary text-sm leading-relaxed">
          <div>
            <h4 className="text-primary font-medium mb-2">Adding Tasks</h4>
            <ul className="space-y-1">
              <li>• Click the + button in any column header</li>
              <li>• Enter a task title and optional description</li>
              <li>• Set the priority level (Low, Medium, High)</li>
              <li>• Click "Add" to create the task</li>
            </ul>
          </div>
          <div>
            <h4 className="text-primary font-medium mb-2">Moving Tasks</h4>
            <ul className="space-y-1">
              <li>• Drag any task card to move it</li>
              <li>• Drop it in a different column to change status</li>
              <li>• Tasks automatically update their timestamp</li>
              <li>• Use the grip icon for easier dragging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};