import { useState } from "react";

export function useCounter(initialValue: number) {
  const [count, setCount] = useState(initialValue);

  function increment() {
    setCount((count) => count + 1);
  }

  return [count, increment] as const;
}
