import { useState, useCallback } from "react";

export function useCounter(initialValue: number) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((count) => count + 1);
  }, []);

  return [count, increment] as const;
}
