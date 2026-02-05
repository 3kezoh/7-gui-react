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
	const svgRef = useRef<SVGSVGElement>(null);
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
		function onPointerDown({ target }: PointerEvent) {
			const isNode = target instanceof Node;

			if (!isNode) {
				return;
			}

			const [button, svg, div] = unref(buttonRef, svgRef, divRef);

			if (
				button.contains(target) ||
				svg.contains(target) ||
				div.contains(target)
			) {
				return;
			}

			dispatch("FOCUS_SVG");
		}

		window.addEventListener("pointerdown", onPointerDown);

		return () => window.removeEventListener("pointerdown", onPointerDown);
	});

	useEffect(() => {
		setDraft(committed);
	}, [committed]);

	useLayoutEffect(() => {
		const [button, svg, div] = unref(buttonRef, svgRef, divRef);
		const { bottom, width, top, left } = svg.getBoundingClientRect();

		const actions = {
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
			SVG: () => {
				button.hidePopover();
				div.hidePopover();
			},
		};

		actions[focus]();
	}, [focus, selectedCircle]);

	function onClick({ target, ...event }: MouseEvent<SVGSVGElement>) {
		if (focus !== "SVG") {
			setNearestCircle(event);

			return dispatch("FOCUS_SVG");
		}

		const [svg] = unref(svgRef);
		const point = getSvgPosition(svg, event);

		const nextCircles = draft.map((circle) => ({
			...circle,
			isSelected: false,
		}));

		const circle = { ...point, radius: 10 };

		commit([...nextCircles, { ...circle, isSelected: false }]);
		setDraft([...nextCircles, { ...circle, isSelected: true }]);
		setIndex(-1);
	}

	function onContextMenu(event: MouseEvent<SVGSVGElement>) {
		event.preventDefault();

		if (focus !== "SVG") {
			setNearestCircle(event);

			return dispatch("FOCUS_SVG");
		}

		dispatch("OPEN_CONTEXT_MENU");
	}

	function onMouseMove(event: MouseEvent<SVGSVGElement>) {
		if (focus !== "SVG") {
			return;
		}

		setNearestCircle(event);
	}

	function setNearestCircle(event: Pick<MouseEvent, "clientX" | "clientY">) {
		const [svg] = unref(svgRef);
		const point = getSvgPosition(svg, event);
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
			<svg
				ref={svgRef}
				width={300}
				height={300}
				onClick={onClick}
				onContextMenu={onContextMenu}
				onMouseMove={onMouseMove}
				role="img"
			>
				{draft.map((circle, i) => (
					<circle
						key={i}
						cx={circle.x}
						cy={circle.y}
						r={circle.radius}
						fill={circle.isSelected ? "lightgray" : "none"}
						stroke="black"
						strokeWidth={1}
						pointerEvents="visibleStroke"
					/>
				))}
			</svg>
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

function getSvgPosition<T extends SVGSVGElement>(
	svg: T,
	{ clientX, clientY }: Pick<MouseEvent, "clientX" | "clientY">,
) {
	const { left, top } = svg.getBoundingClientRect();
	const x = clientX - left;
	const y = clientY - top;

	return { x, y };
}
