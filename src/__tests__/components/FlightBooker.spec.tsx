import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlightBooker } from "../../components";

beforeEach(() => {
  vi.useFakeTimers({ now: new Date("1972-06-05") });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("FlightBooker", () => {
  it("should be in the document", () => {
    render(<FlightBooker />);

    const flightBooker = screen.getByTestId("flightBooker");

    expect(flightBooker).toBeInTheDocument();
  });

  describe("one-way flight", () => {
    it("should have the return date disabled", () => {
      render(<FlightBooker />);

      const returnDateInput = screen.getByTestId("returnDate");

      expect(returnDateInput).toBeDisabled();
    });

    it("should update the start date", async () => {
      const user = userEvent.setup({ delay: null });

      render(<FlightBooker />);

      const startDateInput = screen.getByTestId("startDate");

      await user.clear(startDateInput);

      await user.type(startDateInput, "1980-03-25");

      expect(startDateInput).toHaveValue("1980-03-25");
    });

    it("should informs the user that the booking is successful", async () => {
      const alertSpy = vi.spyOn(window, "alert");

      alertSpy.mockImplementation(() => null);

      const user = userEvent.setup({ delay: null });

      render(<FlightBooker />);

      const bookButton = screen.getByRole("button", { name: /book/i });

      await user.click(bookButton);

      expect(alertSpy).toHaveBeenCalledWith(
        "You have booked a one-way flight on 6/5/1972",
      );
    });

    it("should have the start date in red when it is invalid", async () => {
      const user = userEvent.setup({ delay: null });

      render(<FlightBooker />);

      const startDateInput = screen.getByTestId("startDate");

      await user.clear(startDateInput);

      expect(startDateInput).toHaveClass("text-red-600");
    });

    it("should disable the book button when the start date is invalid", async () => {
      const user = userEvent.setup({ delay: null });

      render(<FlightBooker />);

      const startDateInput = screen.getByTestId("startDate");

      await user.clear(startDateInput);

      const bookButton = screen.getByRole("button", { name: /book/i });

      expect(bookButton).toBeDisabled();
    });
  });

  describe("return flight", () => {
    it("should select a return flight", async () => {
      const user = userEvent.setup({ delay: null });

      render(<FlightBooker />);

      const flightSelect = screen.getByRole("combobox");

      const returnFlightOption = screen.getByRole("option", {
        name: /return flight/i,
      });

      await user.selectOptions(flightSelect, returnFlightOption);

      expect(flightSelect).toHaveValue("return flight");
    });

    it("should update the return date", async () => {
      const user = userEvent.setup({ delay: null });

      render(<FlightBooker />);

      const flightSelect = screen.getByRole("combobox");

      const returnFlightOption = screen.getByRole("option", {
        name: /return flight/i,
      });

      await user.selectOptions(flightSelect, returnFlightOption);

      const returnDateInput = screen.getByTestId("returnDate");

      await user.clear(returnDateInput);

      await user.type(returnDateInput, "1980-03-25");

      expect(returnDateInput).toHaveValue("1980-03-25");
    });

    it("should informs the user the booking is successful", async () => {
      const alertSpy = vi.spyOn(window, "alert");

      alertSpy.mockImplementation(() => null);

      const user = userEvent.setup({ delay: null });

      render(<FlightBooker />);

      const flightSelect = screen.getByRole("combobox");

      const returnFlightOption = screen.getByRole("option", {
        name: /return flight/i,
      });

      await user.selectOptions(flightSelect, returnFlightOption);

      const returnDateInput = screen.getByTestId("returnDate");

      await user.clear(returnDateInput);

      await user.type(returnDateInput, "1980-03-25");

      const bookButton = screen.getByRole("button", { name: /book/i });

      await user.click(bookButton);

      expect(alertSpy).toHaveBeenCalledWith(
        "You have booked a return flight on 6/5/1972 to 3/25/1980",
      );
    });

    it("should have the return date in red when it is invalid", async () => {
      const user = userEvent.setup({ delay: null });

      render(<FlightBooker />);

      const flightSelect = screen.getByRole("combobox");

      const returnFlightOption = screen.getByRole("option", {
        name: /return flight/i,
      });

      await user.selectOptions(flightSelect, returnFlightOption);

      const returnDateInput = screen.getByTestId("returnDate");

      await user.clear(returnDateInput);

      expect(returnDateInput).toHaveClass("text-red-600");
    });

    it("should disable the book button when the return date is invalid", async () => {
      const user = userEvent.setup({ delay: null });

      render(<FlightBooker />);

      const flightSelect = screen.getByRole("combobox");

      const returnFlightOption = screen.getByRole("option", {
        name: /return flight/i,
      });

      await user.selectOptions(flightSelect, returnFlightOption);

      const returnDateInput = screen.getByTestId("returnDate");

      await user.clear(returnDateInput);

      const bookButton = screen.getByRole("button", { name: /book/i });

      expect(bookButton).toBeDisabled();
    });

    it("should disable the book button when the return date is before or the same as the start date", async () => {
      const user = userEvent.setup({ delay: null });

      render(<FlightBooker />);

      const flightSelect = screen.getByRole("combobox");

      const returnFlightOption = screen.getByRole("option", {
        name: /return flight/i,
      });

      await user.selectOptions(flightSelect, returnFlightOption);

      const bookButton = screen.getByRole("button", { name: /book/i });

      expect(bookButton).toBeDisabled();
    });
  });

  it("should match the snapshot", () => {
    const { asFragment } = render(<FlightBooker />);

    expect(asFragment()).toMatchSnapshot();
  });
});
