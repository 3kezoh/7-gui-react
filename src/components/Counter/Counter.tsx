import { useCounter } from "../../hooks";
import { Button } from "../Button";

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
    <div
      className="flex border border-black w-fit p-4 gap-2"
      data-testid="counter"
    >
      <div className="flex items-center">{count}</div>
      <Button onClick={increment}>Count</Button>
    </div>
  );
}

export default Counter;
