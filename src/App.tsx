import React from 'react';
import { TaskListApp } from './components/TaskListApp';
import { MouseCursorLight } from './components/MouseCursorLight';

function App() {
  return (
    <MouseCursorLight>
      <div className="min-h-screen transition-colors duration-300" style={{
        background: 'var(--app-background)'
      }}>
        <style>{`
          :root {
            --app-background: #f7f7f7;
          }
          
          .dark {
            --app-background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0e4749 100%);
          }
          
          body {
            background: var(--app-background);
          }
        `}</style>
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <TaskListApp />
        </div>
      </div>
    </MouseCursorLight>
  );
}

export default App;