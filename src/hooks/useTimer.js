import { useState, useEffect, useRef, useCallback } from 'react';

export const MODES = {
  WORK: 'work',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak',
};

const DURATIONS = {
  [MODES.WORK]: 25 * 60,
  [MODES.SHORT_BREAK]: 5 * 60,
  [MODES.LONG_BREAK]: 15 * 60,
};

export function useTimer(onWorkComplete) {
  const [mode, setMode] = useState(MODES.WORK);
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS[MODES.WORK]);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const intervalRef = useRef(null);
  const onWorkCompleteRef = useRef(onWorkComplete);

  useEffect(() => {
    onWorkCompleteRef.current = onWorkComplete;
  }, [onWorkComplete]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (mode === MODES.WORK) {
              const newCount = pomodoroCount + 1;
              setPomodoroCount(newCount);
              onWorkCompleteRef.current && onWorkCompleteRef.current();
              const nextMode = newCount % 4 === 0 ? MODES.LONG_BREAK : MODES.SHORT_BREAK;
              setMode(nextMode);
              setSecondsLeft(DURATIONS[nextMode]);
            } else {
              setMode(MODES.WORK);
              setSecondsLeft(DURATIONS[MODES.WORK]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode, pomodoroCount]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(DURATIONS[mode]);
  }, [mode]);

  const switchMode = useCallback((newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setSecondsLeft(DURATIONS[newMode]);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = 1 - secondsLeft / DURATIONS[mode];

  return {
    mode,
    minutes,
    seconds,
    progress,
    isRunning,
    pomodoroCount,
    start,
    pause,
    reset,
    switchMode,
  };
}
