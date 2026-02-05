import { useReducer } from "react";

type State = "BUTTON" | "DIV" | "SVG";

type Action = "OPEN_CONTEXT_MENU" | "OPEN_DIAMATER_SELECT" | "FOCUS_SVG";

function reducer(state: State, action: Action) {
	const transitions: Record<State, Partial<Record<Action, State>>> = {
		BUTTON: {
			FOCUS_SVG: "SVG",
			OPEN_DIAMATER_SELECT: "DIV",
		},
		DIV: {
			FOCUS_SVG: "SVG",
			OPEN_CONTEXT_MENU: "SVG",
		},
		SVG: {
			FOCUS_SVG: "SVG",
			OPEN_CONTEXT_MENU: "BUTTON",
		},
	};

	return transitions[state][action] ?? "SVG";
}

export function useFocus() {
	return useReducer(reducer, "SVG");
}

export default useFocus;
