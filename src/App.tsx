import React from 'react';
import { TaskListApp } from './components/TaskListApp';
import { InteractiveBackground } from './components/InteractiveBackground';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen transition-colors duration-300">
      {isDarkMode ? (
        <InteractiveBackground>
          <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <TaskListApp />
          </div>
        </InteractiveBackground>
      ) : (
        <div 
          className="min-h-screen"
          style={{ background: '#f7f7f7' }}
        >
          <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <TaskListApp />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;