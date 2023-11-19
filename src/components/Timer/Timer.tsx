import { useEffect, useState } from "react";
import { useInterval } from "../../hooks";
import { Input } from "../Input";
import { Button } from "../Button";

export type TimerProps = {
  /** Specifies the amount of time in ms that the timer should advance with each tick or iteration. The default is 100 */
  step?: number;
  /** The minimum duration in ms. The default is 0 */
  min?: number;
  /** The maximum duration in ms. The default is 10000 (10s) */
  max?: number;
};

export function Timer({ step = 100, min = 0, max = 10_000 }: TimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [duration, setDuration] = useState(1000);

  const { stopInterval, resetInterval } = useInterval(
    () => setElapsedTime((elapsedTime) => elapsedTime + step),
    step,
  );

  function onDurationChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const { value } = target;

    setDuration(+value);
  }

  useEffect(() => {
    if (elapsedTime >= duration) {
      return stopInterval();
    }

    resetInterval();
  }, [elapsedTime, duration, resetInterval, stopInterval]);

  function onResetClick() {
    setElapsedTime(0);
    resetInterval();
  }

  const time = elapsedTime / 1000;

  return (
    <div
      className="grid gap-4 p-4 border border-black w-fit"
      data-testid="timer"
    >
      <div className="flex gap-2">
        <label htmlFor="time">Elapsed Time:</label>
        <progress id="time" max={duration} value={elapsedTime} />
      </div>
      <div>{time}s</div>
      <div className="flex gap-2">
        <label htmlFor="duration">Duration:</label>
        <Input
          type="range"
          name="duration"
          step={step}
          value={duration}
          onChange={onDurationChange}
          min={min}
          max={max}
        />
      </div>
      <Button onClick={onResetClick}>Reset</Button>
    </div>
  );
}

export default Timer;
