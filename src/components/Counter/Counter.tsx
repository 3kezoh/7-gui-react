import { useCounter } from "../../hooks";
import classes from "./counter.module.css";

type CounterProps = {
  /** The initial value of the counter, the default value is 0. */
  initialValue?: number;
};

/**
 * A counter that can only be incremented by 1.
 */
export function Counter({ initialValue = 0 }: CounterProps): JSX.Element {
  const [count, increment] = useCounter(initialValue);

  return (
    <div className={classes.counter} data-testid="counter">
      <div className={classes.count}>{count}</div>
      <button className={classes.button} onClick={increment} type="button">
        Count
      </button>
    </div>
  );
}

export default Counter;
