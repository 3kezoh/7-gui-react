import { useReducer } from "react";

type State = "BUTTON" | "CANVAS" | "DIV";

type Action = "OPEN_CONTEXT_MENU" | "OPEN_DIAMATER_SELECT" | "FOCUS_CANVAS";

function reducer(state: State, action: Action) {
	const transitions: Record<State, Partial<Record<Action, State>>> = {
		BUTTON: {
			FOCUS_CANVAS: "CANVAS",
			OPEN_DIAMATER_SELECT: "DIV",
		},
		CANVAS: {
			FOCUS_CANVAS: "CANVAS",
			OPEN_CONTEXT_MENU: "BUTTON",
		},
		DIV: {
			FOCUS_CANVAS: "CANVAS",
			OPEN_CONTEXT_MENU: "CANVAS",
		},
	};

	return transitions[state][action] ?? "CANVAS";
}

export function useFocus() {
	return useReducer(reducer, "CANVAS");
}

export default useFocus;
