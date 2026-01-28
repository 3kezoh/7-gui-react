/**
 * Like `Array.prototype.at`, but guarantees the element exists.
 *
 * @param array The array to read from.
 * @param index The index to access (supports negative indexes).
 * @returns The element at the given index (non-undefined).
 * @throws {Error} If no element exists at the given index.
 */
export function at<T>(array: readonly T[], index: number): T {
	const value = array.at(index);

	assertNotUndefined(value, `at(): no element at index ${index}`);

	return value;
}

function assertNotUndefined<T>(
	unknown: T,
	message = "Unexpected undefined value",
): asserts unknown is Exclude<T, undefined> {
	if (unknown === undefined) {
		throw new Error(message);
	}
}
