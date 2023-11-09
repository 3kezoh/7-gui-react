import { useEffect, useRef } from "react";

export function useInterval(fn: () => void, delay: number) {
  const intervalId = useRef<number>();

  useEffect(() => {
    intervalId.current = window.setInterval(fn, delay);

    return stopInterval;
  }, [fn, delay]);

  function stopInterval() {
    return window.clearInterval(intervalId.current);
  }

  function resetInterval() {
    clearInterval(intervalId.current);

    intervalId.current = window.setInterval(fn, delay);
  }

  return { stopInterval, resetInterval };
}
