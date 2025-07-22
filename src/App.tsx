import React from 'react';
import { TaskListApp } from './components/TaskListApp';
import { InteractiveBackground } from './components/InteractiveBackground';

function App() {
  return (
    <div className="min-h-screen">
      <InteractiveBackground>
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <TaskListApp />
        </div>
      </InteractiveBackground>
    </div>
  );
}

export default App;