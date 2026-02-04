import type { SetStateAction } from "react";
import { useReducer } from "react";
import { at } from "../utils";

type State<T> = {
	commits: T[];
	stash: T[];
};

type Action<T> =
	| { type: "UNDO" }
	| { type: "REDO" }
	| { type: "COMMIT"; value: T };

function reducer<T>({ commits, stash }: State<T>, action: Action<T>) {
	if (action.type === "UNDO") {
		if (commits.length >= 2) {
			return {
				commits: commits.slice(0, -1),
				stash: [...stash, at(commits, -1)],
			};
		}

		return { commits, stash };
	}

	if (action.type === "REDO") {
		if (stash.length >= 1) {
			return {
				commits: [...commits, at(stash, -1)],
				stash: stash.slice(0, -1),
			};
		}

		return { commits, stash };
	}

	return {
		commits: [...commits, action.value],
		stash: [],
	};
}

export function useHistory<T>(initialState: T) {
	const [{ commits, stash }, dispatch] = useReducer(reducer, {
		commits: [initialState],
		stash: [],
	});

	const current = at(commits, -1);

	function commit(value: SetStateAction<T>) {
		if (isUpdater<T>(value)) {
			return dispatch({ type: "COMMIT", value: value(current) });
		}

		dispatch({ type: "COMMIT", value });
	}

	function redo() {
		dispatch({ type: "REDO" });
	}

	function undo() {
		dispatch({ type: "UNDO" });
	}

	const canRedo = stash.length >= 1;
	const canUndo = commits.length >= 2;

	return [at(commits, -1), { canRedo, canUndo, commit, redo, undo }] as const;
}

type Updater<T> = (state: T) => T;

function isUpdater<T>(unknown: unknown): unknown is Updater<T> {
	return typeof unknown === "function";
}
