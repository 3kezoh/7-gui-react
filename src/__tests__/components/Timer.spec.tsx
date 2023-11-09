import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timer } from "../../components";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe("Timer", () => {
  it("should be in the document", () => {
    render(<Timer />);

    const timer = screen.getByTestId("timer");

    expect(timer).toBeInTheDocument();
  });

  describe("As time goes by", () => {
    it("should display the elapsed time", () => {
      render(<Timer />);

      act(() => vi.advanceTimersByTime(100));

      const timeElement = screen.getByText("0.1s");

      expect(timeElement).toBeInTheDocument();
    });

    it("should have a progress bar that fills up", () => {
      render(<Timer />);

      act(() => vi.advanceTimersByTime(500));

      const progressElement = screen.getByRole<HTMLInputElement>("progressbar");

      expect(progressElement).toHaveValue(500);
    });
  });

  describe("After one second", () => {
    it("should display 1s", async () => {
      render(<Timer />);

      act(() => vi.advanceTimersByTime(1000));

      const timeElement = screen.getByText("1s");

      expect(timeElement).toBeInTheDocument();
    });

    it("should have the progress bar filled to the maximum", async () => {
      render(<Timer />);

      act(() => vi.advanceTimersByTime(1000));

      const progressElement = screen.getByRole<HTMLInputElement>("progressbar");

      expect(progressElement).toHaveValue(progressElement.max);
    });
  });

  describe("Using the duration slider", () => {
    it("should update the progress bar maximum", async () => {
      render(<Timer />);

      const sliderElement = screen.getByRole("slider");

      fireEvent.change(sliderElement, { target: { value: 2000 } });

      const progressElement = screen.getByRole<HTMLInputElement>("progressbar");

      expect(progressElement).toHaveAttribute("max", "2000");
    });

    it("should update the timer duration", async () => {
      render(<Timer />);

      const sliderElement = screen.getByRole("slider");

      fireEvent.change(sliderElement, { target: { value: 2000 } });

      act(() => vi.advanceTimersByTime(2000));

      const timeElement = screen.getByText("2s");

      expect(timeElement).toBeInTheDocument();
    });

    it("should make the timer pick up where it left off", async () => {
      render(<Timer />);

      act(() => vi.advanceTimersByTime(1000));

      const progressElement = screen.getByRole<HTMLInputElement>("progressbar");

      expect(progressElement).toHaveValue(progressElement.max);

      const sliderElement = screen.getByRole("slider");

      fireEvent.change(sliderElement, { target: { value: 2000 } });

      act(() => vi.advanceTimersByTime(3000));

      const timeElement = screen.getByText("4s");

      expect(timeElement).toBeInTheDocument();
    });
  });

  describe("A click on the reset button", () => {
    it("should reset the displayed time", async () => {
      const user = userEvent.setup({ delay: null });

      render(<Timer />);

      const resetElement = screen.getByRole("button", { name: /reset/i });

      await user.click(resetElement);

      const timeElement = screen.getByText("0s");

      expect(timeElement).toBeInTheDocument();
    });

    it("should reset the progress bar", async () => {
      const user = userEvent.setup({ delay: null });

      render(<Timer />);

      const resetElement = screen.getByRole("button", { name: /reset/i });

      await user.click(resetElement);

      const progressElement = screen.getByRole("progressbar");

      expect(progressElement).toHaveValue(0);
    });

    it("should not reset the duration", async () => {
      const user = userEvent.setup({ delay: null });

      render(<Timer />);

      const resetElement = screen.getByRole("button", { name: /reset/i });

      await user.click(resetElement);

      const sliderElement = screen.getByRole("slider");

      expect(sliderElement).toHaveValue("1000");
    });
  });

  it("should match the snapshot", () => {
    const { asFragment } = render(<Timer />);

    expect(asFragment()).toMatchSnapshot();
  });
});
