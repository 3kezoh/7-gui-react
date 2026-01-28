import type { RefObject } from "react";

type Unrefs<R extends RefObject<unknown>[]> = {
	[K in keyof R]: R[K] extends RefObject<infer T> ? NonNullable<T> : never;
};

/**
 * Unwraps a list of react refs.
 * @throws {Error} If one or more refs have a `null` current value.
 * @param refs The refs to unwrap.
 * @returns An array of unwrapped non-null refs.
 */
export function unref<R extends RefObject<unknown>[]>(...refs: R): Unrefs<R> {
	const unknowns = refs.map(({ current }) => current);

	unknowns.forEach((unknown) => {
		assertNotNull(unknown, "One or more refs is null");
	});

	return unknowns as Unrefs<R>;
}

function assertNotNull<T>(
	unknown: T,
	message = "Unexpected null value",
): asserts unknown is Exclude<T, null> {
	if (unknown === null) {
		throw new Error(message);
	}
}
