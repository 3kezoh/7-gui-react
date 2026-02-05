import { render } from "vitest-browser-react";
import { CircleDrawer } from "../src/components";

describe("CircleDrawer", () => {
	it("should be in the document", async () => {
		const screen = await render(<CircleDrawer />);

		const circleDrawer = screen.getByTestId("circleDrawer");

		expect(circleDrawer).toBeInTheDocument();
	});

	it("should match the snapshot", async () => {
		const { asFragment } = await render(<CircleDrawer />);

		const fragment = asFragment();

		expect(fragment).toMatchFileSnapshot("./snapshots/circle-drawer.html");
	});
});
