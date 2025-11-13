import type React from "react";
import { useEffect, useRef } from "react";

export function CircleDrawer() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const context = canvasRef.current?.getContext("2d");

	function getCircle(x: number, y: number, radius: number) {
		const path = new Path2D();

		path.arc(x, y, radius, 0, 2 * Math.PI);

		return path;
	}

	function onClick(event: React.MouseEvent<HTMLCanvasElement>) {
		debugger;
	}

	function getPosition<T extends HTMLCanvasElement>(
		canvas: T,
		event: React.MouseEvent<T>,
	) {
		const boundingClientRect = canvas.getBoundingClientRect();
		const x = event.clientX - boundingClientRect.left;
		const y = event.clientY - boundingClientRect.right;

		return { x, y };
	}

	return (
		<div className="border w-max" data-testid="circleDrawer">
			<canvas ref={canvasRef} width={150} height={150} onClick={onClick}>
				This feature is not supported by your browser
			</canvas>
		</div>
	);
}

export default CircleDrawer;
