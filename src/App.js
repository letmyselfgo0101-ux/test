import React, { useCallback } from 'react';
import './App.css';
import Timer from './components/Timer';
import TaskList from './components/TaskList';
import { useTimer } from './hooks/useTimer';
import { useLocalStorage } from './hooks/useLocalStorage';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function App() {
  const [tasks, setTasks] = useLocalStorage('pomodoro-tasks', []);
  const [activeTaskId, setActiveTaskId] = useLocalStorage('pomodoro-active-task', null);
  const [todayStats, setTodayStats] = useLocalStorage('pomodoro-stats', {
    date: new Date().toDateString(),
    count: 0,
  });

  const handleWorkComplete = useCallback(() => {
    const today = new Date().toDateString();
    setTodayStats(prev => ({
      date: today,
      count: prev.date === today ? prev.count + 1 : 1,
    }));
    if (activeTaskId) {
      setTasks(prev =>
        prev.map(t =>
          t.id === activeTaskId
            ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
            : t
        )
      );
    }
  }, [activeTaskId, setTasks, setTodayStats]);

  const { mode, minutes, seconds, progress, isRunning, pomodoroCount, start, pause, reset, switchMode } = useTimer(handleWorkComplete);

  const handleAddTask = (title, estimatedPomodoros) => {
    const newTask = {
      id: generateId(),
      title,
      estimatedPomodoros,
      completedPomodoros: 0,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
    if (!activeTaskId) {
      setActiveTaskId(newTask.id);
    }
  };

  const handleSelectTask = (id) => {
    setActiveTaskId(id);
  };

  const handleCompleteTask = (id) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
    if (activeTaskId === id) {
      const nextPending = tasks.find(t => t.id !== id && !t.completed);
      setActiveTaskId(nextPending ? nextPending.id : null);
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (activeTaskId === id) {
      const nextPending = tasks.find(t => t.id !== id && !t.completed);
      setActiveTaskId(nextPending ? nextPending.id : null);
    }
  };

  const handleUpdateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const today = new Date().toDateString();
  const todayCount = todayStats.date === today ? todayStats.count : 0;

  return (
    <div className={`app mode-${mode}`}>
      <header className="app-header">
        <h1>🍅 ポモドーロ</h1>
        <div className="header-stats">
          <span>今日: {todayCount} ポモドーロ</span>
          <span>合計: {pomodoroCount} ポモドーロ</span>
        </div>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <Timer
            mode={mode}
            minutes={minutes}
            seconds={seconds}
            progress={progress}
            isRunning={isRunning}
            pomodoroCount={pomodoroCount}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onSwitchMode={switchMode}
          />

          {activeTask ? (
            <div className="active-task-banner">
              <span className="active-task-label">現在のタスク</span>
              <span className="active-task-title">{activeTask.title}</span>
              <span className="active-task-progress">
                🍅 {activeTask.completedPomodoros} / {activeTask.estimatedPomodoros}
              </span>
            </div>
          ) : (
            <div className="active-task-banner empty">
              <span>
                {tasks.filter(t => !t.completed).length > 0
                  ? 'タスクをクリックして選択してください'
                  : '右のリストからタスクを追加してください'}
              </span>
            </div>
          )}
        </div>

        <div className="right-panel">
          <TaskList
            tasks={tasks}
            activeTaskId={activeTaskId}
            onSelect={handleSelectTask}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
            onAdd={handleAddTask}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
