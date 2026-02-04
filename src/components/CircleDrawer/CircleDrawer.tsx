import type { ChangeEvent, MouseEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useHistory } from "@/hooks";
import { at, unref } from "@/utils";
import { Button } from "../Button";
import useFocus from "./useFocus";

type Point = { x: number; y: number };
type Circle = Point & { radius: number };
type SelectedCircle = Circle & { isSelected: boolean };
type Nullable<T> = T | null;

export function CircleDrawer() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const divRef = useRef<HTMLDivElement>(null);
	const [draft, setDraft] = useState<SelectedCircle[]>([]);
	const [index, setIndex] = useState<Nullable<number>>(null);
	const [radius, setRadius] = useState(10);
	const selectedCircle = index === null ? null : at(draft, index);
	const [focus, dispatch] = useFocus();
	const getNearestCircleIndexFromCircles = getNearestCircleIndexFrom(draft);

	const [committed, { commit, redo, undo, canRedo, canUndo }] = useHistory<
		SelectedCircle[]
	>([]);

	useEffect(() => {
		const [canvas] = unref(canvasRef);
		const context = canvas.getContext("2d");

		if (!context) {
			return;
		}

		context.clearRect(0, 0, canvas.width, canvas.height);

		draft.forEach((circle) => {
			const path = getCirclePath(circle);

			if (circle.isSelected) {
				withFillStyle(context, "gray", (context) => {
					context.fill(path);
				});

				return;
			}

			context.stroke(path);
		});
	}, [draft]);

	useEffect(() => {
		function onPointerDown({ target }: PointerEvent) {
			const isNode = target instanceof Node;

			if (!isNode) {
				return;
			}

			const [button, canvas, div] = unref(buttonRef, canvasRef, divRef);

			if (
				button.contains(target) ||
				canvas.contains(target) ||
				div.contains(target)
			) {
				return;
			}

			dispatch("FOCUS_CANVAS");
		}

		window.addEventListener("pointerdown", onPointerDown);

		return () => window.removeEventListener("pointerdown", onPointerDown);
	});

	useEffect(() => {
		setDraft(committed);
	}, [committed]);

	useLayoutEffect(() => {
		const [button, canvas, div] = unref(buttonRef, canvasRef, divRef);
		const { bottom, width, top, left } = canvas.getBoundingClientRect();

		const actions = {
			CANVAS: () => {
				button.hidePopover();
				div.hidePopover();
			},
			BUTTON: () => {
				if (!selectedCircle) {
					return;
				}

				button.style.top = `${top + selectedCircle.y}px`;
				button.style.left = `${left + selectedCircle.x}px`;

				button.showPopover();
				div.hidePopover();
			},
			DIV: () => {
				div.style.top = `${bottom - 10}px`;
				div.style.left = `${left + width / 2}px`;
				div.style.maxWidth = `${width - 20}px`;

				button.hidePopover();
				div.showPopover();
			},
		};

		actions[focus]();
	}, [focus, selectedCircle]);

	function onClick({ target, ...event }: MouseEvent<HTMLCanvasElement>) {
		if (focus !== "CANVAS") {
			setNearestCircle(event);

			return dispatch("FOCUS_CANVAS");
		}

		const [canvas] = unref(canvasRef);
		const point = getCanvasPosition(canvas, event);

		const nextCircles = draft.map((circle) => ({
			...circle,
			isSelected: false,
		}));

		const circle = { ...point, radius: 10 };

		commit([...nextCircles, { ...circle, isSelected: false }]);
		setDraft([...nextCircles, { ...circle, isSelected: true }]);
		setIndex(-1);
	}

	function onContextMenu(event: MouseEvent<HTMLCanvasElement>) {
		event.preventDefault();

		if (focus !== "CANVAS") {
			setNearestCircle(event);

			return dispatch("FOCUS_CANVAS");
		}

		dispatch("OPEN_CONTEXT_MENU");
	}

	function onMouseMove(event: MouseEvent<HTMLCanvasElement>) {
		if (focus !== "CANVAS") {
			return;
		}

		setNearestCircle(event);
	}

	function setNearestCircle(event: Pick<MouseEvent, "clientX" | "clientY">) {
		const [canvas] = unref(canvasRef);
		const point = getCanvasPosition(canvas, event);
		const nearestCircleIndex = getNearestCircleIndexFromCircles(point);

		setDraft((circles) =>
			circles.map((circle, index) => ({
				...circle,
				isSelected: nearestCircleIndex === index,
			})),
		);

		setIndex(nearestCircleIndex);
	}

	function onButtonClick(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();

		if (!selectedCircle) {
			return;
		}

		setRadius(selectedCircle.radius);

		dispatch("OPEN_DIAMATER_SELECT");
	}

	function onChange(event: ChangeEvent<HTMLInputElement>) {
		if (!selectedCircle || index === null) {
			return;
		}

		const radius = +event.target.value;
		const nextCircles = draft.with(index, { ...selectedCircle, radius });

		setRadius(radius);
		setDraft(nextCircles);
	}

	function onBlur() {
		commit(draft.map((circle) => ({ ...circle, isSelected: false })));
	}

	return (
		<div className="border w-max relative" data-testid="circleDrawer">
			<fieldset className="flex gap-2 p-2 mx-auto w-fit">
				<Button onClick={undo} disabled={!canUndo}>
					Undo
				</Button>
				<Button onClick={redo} disabled={!canRedo}>
					Redo
				</Button>
			</fieldset>
			<canvas
				ref={canvasRef}
				width={300}
				height={300}
				onClick={onClick}
				onContextMenu={onContextMenu}
				onMouseMove={onMouseMove}
			>
				This feature is not supported by your browser
			</canvas>
			<button
				type="button"
				popover="manual"
				ref={buttonRef}
				className="border bg-white p-2"
				onClick={onButtonClick}
			>
				Adjust diameter..
			</button>
			<div
				popover="manual"
				ref={divRef}
				className="border -translate-x-1/2 -translate-y-full p-2"
			>
				Adjust diamater of circle at ({selectedCircle?.x}, {selectedCircle?.y})
				<input
					type="range"
					step={1}
					min={1}
					max={100}
					value={radius}
					onChange={onChange}
					onBlur={onBlur}
				/>
			</div>
		</div>
	);
}

export default CircleDrawer;

function getSquaredDistanceFrom({ x: xA, y: yA }: Point) {
	return ({ x: xB, y: yB }: Point) => {
		return (xB - xA) ** 2 + (yB - yA) ** 2;
	};
}

function getNearestCircleIndexFrom(circles: Circle[]) {
	return (point: Point) => {
		const getSquaredDistanceFromPoint = getSquaredDistanceFrom(point);

		const [nearestCircleIndex] = circles.reduce<[Nullable<number>, number]>(
			([nearestCircleIndex, nearestCircleDistance], circle, index) => {
				const distance = getSquaredDistanceFromPoint(circle);

				if (distance > circle.radius ** 2) {
					return [nearestCircleIndex, nearestCircleDistance];
				}

				if (distance > nearestCircleDistance) {
					return [nearestCircleIndex, nearestCircleDistance];
				}

				return [index, distance];
			},
			[null, Infinity],
		);

		return nearestCircleIndex;
	};
}

function getCirclePath({ x, y, radius }: Circle) {
	const path = new Path2D();

	path.arc(x, y, radius, 0, 2 * Math.PI);

	return path;
}

function getCanvasPosition<T extends HTMLCanvasElement>(
	canvas: T,
	{ clientX, clientY }: Pick<MouseEvent, "clientX" | "clientY">,
) {
	const { left, top } = canvas.getBoundingClientRect();
	const x = clientX - left;
	const y = clientY - top;

	return { x, y };
}

function withFillStyle<T extends CanvasRenderingContext2D>(
	context: T,
	color: CanvasFillStrokeStyles["fillStyle"],
	draw: (context: T) => void,
) {
	context.save();

	context.fillStyle = color;

	draw(context);

	context.restore();
}
