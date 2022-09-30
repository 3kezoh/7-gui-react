import { useCounter } from "../../hooks";
import classes from "./counter.module.css";

type CounterProps = {
  initialValue?: number;
};

/**
 * A count that can only be incremented by 1.
 */
export function Counter({ initialValue = 0 }: CounterProps): JSX.Element {
  const [count, increment] = useCounter(initialValue);

  return (
    <div className={classes.counter} data-testid="counter">
      <div className={classes.count} data-testid="count">
        {count}
      </div>
      <button
        className={classes.button}
        onClick={increment}
        data-testid="increment"
      >
        Count
      </button>
    </div>
  );
}
