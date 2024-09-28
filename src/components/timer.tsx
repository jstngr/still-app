import React, { ReactNode, useEffect, useState } from 'react';

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

  console.log('startingSeconds', startingSeconds);

  useEffect(() => {
    if (resetId !== timerId) {
      setSeconds(startingSeconds || 0);
      setResetId(timerId || 0);
    }
  }, [startingSeconds, resetId, timerId]);

  useEffect(() => {
    if (isStopped) {
      setSeconds(0);
      return;
    }
  }, [isStopped]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  return (
    <TimerContext.Provider value={{ seconds }}>
      <TimerContext.Consumer>{props.children}</TimerContext.Consumer>
    </TimerContext.Provider>
  );
}
