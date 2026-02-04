import { useEffect, useRef } from "react";

export function useInterval(fn: () => void, delay: number) {
	const intervalId = useRef(0);

	useEffect(() => {
		intervalId.current = window.setInterval(fn, delay);

		return () => window.clearInterval(intervalId.current);
	}, [fn, delay]);

	function stopInterval() {
		return window.clearInterval(intervalId.current);
	}

	function resetInterval() {
		clearInterval(intervalId.current);

		intervalId.current = window.setInterval(fn, delay);
	}

	return { resetInterval, stopInterval };
}
