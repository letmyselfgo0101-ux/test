import React, { useState } from 'react';

export default function TaskItem({ task, isActive, onSelect, onComplete, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editEstimate, setEditEstimate] = useState(task.estimatedPomodoros);

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, { title: editTitle.trim(), estimatedPomodoros: editEstimate });
      setEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setEditing(false);
  };

  if (editing) {
    return (
      <div className={`task-item editing ${isActive ? 'active' : ''}`}>
        <input
          className="task-edit-input"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="task-edit-row">
          <label className="estimate-label">予定ポモドーロ数</label>
          <div className="estimate-controls">
            <button onClick={() => setEditEstimate(Math.max(1, editEstimate - 1))}>−</button>
            <span>{editEstimate}</span>
            <button onClick={() => setEditEstimate(Math.min(20, editEstimate + 1))}>＋</button>
          </div>
        </div>
        <div className="task-edit-actions">
          <button className="btn-save" onClick={handleSave}>保存</button>
          <button className="btn-cancel" onClick={() => setEditing(false)}>キャンセル</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''} ${isActive ? 'active' : ''}`}
      onClick={() => !task.completed && onSelect(task.id)}
    >
      <button
        className="task-checkbox"
        onClick={e => { e.stopPropagation(); onComplete(task.id); }}
        title={task.completed ? '未完了に戻す' : '完了にする'}
      >
        {task.completed ? '✓' : ''}
      </button>

      <div className="task-body">
        <span className="task-title">{task.title}</span>
        <div className="task-meta">
          <span className="task-pomodoros" title="完了 / 予定">
            🍅 {task.completedPomodoros} / {task.estimatedPomodoros}
          </span>
        </div>
      </div>

      <div className="task-actions">
        {!task.completed && (
          <button
            className="btn-icon small"
            onClick={e => { e.stopPropagation(); setEditing(true); }}
            title="編集"
          >
            ✏
          </button>
        )}
        <button
          className="btn-icon small danger"
          onClick={e => { e.stopPropagation(); onDelete(task.id); }}
          title="削除"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
