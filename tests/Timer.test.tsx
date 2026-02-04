import { act as _act } from "react";
import { page, userEvent } from "vitest/browser";
import { Timer } from "@/components";

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.runOnlyPendingTimers();
	vi.useRealTimers();
});

describe("Timer", () => {
	it("should be in the document", async () => {
		const screen = await page.render(<Timer />);

		const timer = screen.getByTestId("timer");

		expect(timer).toBeInTheDocument();
	});

	describe("As time goes by", async () => {
		it("should display the elapsed time", async () => {
			const screen = await page.render(<Timer />);

			await act(() => vi.advanceTimersByTime(100));

			const timeElement = screen.getByText("0.1s");

			expect(timeElement).toBeInTheDocument();
		});

		it("should have a progress bar that fills up", async () => {
			const screen = await page.render(<Timer />);

			await act(() => vi.advanceTimersByTime(500));

			const progressElement = screen.getByRole("progressbar");

			expect(progressElement).toHaveValue(500);
		});
	});

	describe("After one second", async () => {
		it("should display 1s", async () => {
			const screen = await page.render(<Timer />);

			await act(() => vi.advanceTimersByTime(1000));

			const timeElement = screen.getByText("1s");

			expect(timeElement).toBeInTheDocument();
		});

		it("should have the progress bar filled to the maximum", async () => {
			const screen = await page.render(<Timer />);

			await act(() => vi.advanceTimersByTime(1000));

			const progressElement = screen
				.getByRole("progressbar")
				.element() as HTMLProgressElement;

			expect(progressElement).toHaveValue(progressElement.max);
		});
	});

	describe("Using the duration slider", async () => {
		it("should update the progress bar maximum", async () => {
			const screen = await page.render(<Timer />);

			const sliderElement = screen.getByRole("slider");

			await userEvent.fill(sliderElement, "2000");

			const progressElement = screen.getByRole("progressbar");

			expect(progressElement).toHaveAttribute("max", "2000");
		});

		it("should update the timer duration", async () => {
			const screen = await page.render(<Timer />);

			const sliderElement = screen.getByRole("slider");
			await userEvent.fill(sliderElement, "2000");

			await act(async () => vi.advanceTimersByTime(2000));

			const timeElement = screen.getByText("2s");

			expect(timeElement).toBeInTheDocument();
		});

		it("should make the timer pick up where it left off", async () => {
			const screen = await page.render(<Timer />);

			await act(() => vi.advanceTimersByTime(1000));

			const progressElement = screen
				.getByRole("progressbar")
				.element() as HTMLProgressElement;

			expect(progressElement).toHaveValue(progressElement.max);

			const sliderElement = screen.getByRole("slider");
			await userEvent.fill(sliderElement, "2000");

			await act(async () => vi.advanceTimersByTime(3000));

			const timeElement = screen.getByText("4s");

			expect(timeElement).toBeInTheDocument();
		});
	});

	describe("A click on the reset button", async () => {
		it("should reset the displayed time", async () => {
			const screen = await page.render(<Timer />);

			const resetElement = screen.getByRole("button", { name: /reset/i });

			await userEvent.click(resetElement);

			const timeElement = screen.getByText("0s");

			expect(timeElement).toBeInTheDocument();
		});

		it("should reset the progress bar", async () => {
			const screen = await page.render(<Timer />);

			const resetElement = screen.getByRole("button", { name: /reset/i });

			await userEvent.click(resetElement);

			const progressElement = screen.getByRole("progressbar");

			expect(progressElement).toHaveValue(0);
		});

		it("should not reset the duration", async () => {
			const screen = await page.render(<Timer />);

			const resetElement = screen.getByRole("button", { name: /reset/i });

			await userEvent.click(resetElement);

			const sliderElement = screen.getByRole("slider");

			expect(sliderElement).toHaveValue("1000");
		});
	});
});

async function act<T>(callback: () => T | Promise<T>): Promise<T> {
	// @ts-expect-error
	globalThis.IS_REACT_ACT_ENVIRONMENT = true;

	const awaited = await _act(callback);

	// @ts-expect-error
	globalThis.IS_REACT_ACT_ENVIRONMENT = false;

	return awaited;
}
