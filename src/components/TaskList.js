import React, { useState } from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, activeTaskId, onSelect, onComplete, onDelete, onUpdate, onAdd }) {
  const [newTitle, setNewTitle] = useState('');
  const [newEstimate, setNewEstimate] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    if (newTitle.trim()) {
      onAdd(newTitle.trim(), newEstimate);
      setNewTitle('');
      setNewEstimate(1);
      setShowForm(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') setShowForm(false);
  };

  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  return (
    <div className="task-list-card">
      <div className="task-list-header">
        <h2>タスク</h2>
        <button className="btn-add" onClick={() => setShowForm(true)}>＋ 追加</button>
      </div>

      {showForm && (
        <div className="task-form">
          <input
            className="task-input"
            placeholder="タスク名を入力..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="task-form-row">
            <label className="estimate-label">予定ポモドーロ数</label>
            <div className="estimate-controls">
              <button onClick={() => setNewEstimate(Math.max(1, newEstimate - 1))}>−</button>
              <span>{newEstimate}</span>
              <button onClick={() => setNewEstimate(Math.min(20, newEstimate + 1))}>＋</button>
            </div>
          </div>
          <div className="task-form-actions">
            <button className="btn-save" onClick={handleAdd}>追加</button>
            <button className="btn-cancel" onClick={() => setShowForm(false)}>キャンセル</button>
          </div>
        </div>
      )}

      {tasks.length === 0 && !showForm && (
        <p className="empty-state">タスクがありません。「＋ 追加」からタスクを作成してください。</p>
      )}

      {pending.length > 0 && (
        <div className="task-section">
          {pending.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              isActive={task.id === activeTaskId}
              onSelect={onSelect}
              onComplete={onComplete}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <div className="task-section">
          <div className="section-label">完了済み ({completed.length})</div>
          {completed.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              isActive={false}
              onSelect={onSelect}
              onComplete={onComplete}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
