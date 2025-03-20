import React, { ReactNode, useEffect, useState, useRef } from 'react';

interface ITimerProps {
  startingSeconds?: number;
  isRunning: boolean;
  isStopped: boolean;
  children: (value: ITimerContextValue) => ReactNode;
  timerId?: number;
}

interface ITimerContextValue {
  seconds: number;
}

const TimerContext = React.createContext<ITimerContextValue>({
  seconds: 0,
});

export default function Timer(props: ITimerProps) {
  const { isRunning, isStopped, startingSeconds, timerId } = props;
  const [seconds, setSeconds] = useState(startingSeconds || 0);
  const [resetId, setResetId] = useState(timerId || 0);
  const startTimeRef = useRef<number>(Date.now() - (startingSeconds || 0) * 1000);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (resetId !== timerId) {
      setSeconds(startingSeconds || 0);
      startTimeRef.current = Date.now() - (startingSeconds || 0) * 1000;
      setResetId(timerId || 0);
    }
  }, [startingSeconds, resetId, timerId]);

  useEffect(() => {
    if (isStopped) {
      setSeconds(0);
      startTimeRef.current = Date.now();
      return;
    }
  }, [isStopped]);

  useEffect(() => {
    const updateTimer = () => {
      if (isRunning) {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);
        setSeconds(elapsedSeconds);
        frameRef.current = requestAnimationFrame(updateTimer);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
        }
      } else {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);
        setSeconds(elapsedSeconds);
        if (isRunning) {
          frameRef.current = requestAnimationFrame(updateTimer);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (isRunning) {
      frameRef.current = requestAnimationFrame(updateTimer);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isRunning]);

  return (
    <TimerContext.Provider value={{ seconds }}>
      <TimerContext.Consumer>{props.children}</TimerContext.Consumer>
    </TimerContext.Provider>
  );
}
