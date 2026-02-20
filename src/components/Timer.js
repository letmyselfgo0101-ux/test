import React from 'react';
import { MODES } from '../hooks/useTimer';

const MODE_LABELS = {
  [MODES.WORK]: '作業',
  [MODES.SHORT_BREAK]: '短い休憩',
  [MODES.LONG_BREAK]: '長い休憩',
};

const MODE_COLORS = {
  [MODES.WORK]: '#e74c3c',
  [MODES.SHORT_BREAK]: '#27ae60',
  [MODES.LONG_BREAK]: '#2980b9',
};

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Timer({ mode, minutes, seconds, progress, isRunning, pomodoroCount, onStart, onPause, onReset, onSwitchMode }) {
  const color = MODE_COLORS[mode];
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="timer-card" style={{ '--timer-color': color }}>
      <div className="mode-tabs">
        {Object.values(MODES).map(m => (
          <button
            key={m}
            className={`mode-tab ${mode === m ? 'active' : ''}`}
            onClick={() => onSwitchMode(m)}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <div className="timer-circle-wrapper">
        <svg width="220" height="220" viewBox="0 0 220 220">
          <circle
            cx="110" cy="110" r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="10"
          />
          <circle
            cx="110" cy="110" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 110 110)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="timer-display">
          <span className="timer-time">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="timer-mode-label">{MODE_LABELS[mode]}</span>
        </div>
      </div>

      <div className="timer-controls">
        <button className="btn-icon" onClick={onReset} title="リセット">
          ↺
        </button>
        <button
          className="btn-primary"
          style={{ backgroundColor: color }}
          onClick={isRunning ? onPause : onStart}
        >
          {isRunning ? '一時停止' : 'スタート'}
        </button>
        <div className="pomodoro-count" title={`完了した作業: ${pomodoroCount}`}>
          🍅 × {pomodoroCount}
        </div>
      </div>
    </div>
  );
}
