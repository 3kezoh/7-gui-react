import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "../../components";

describe("Counter", () => {
  it("should render the counter", () => {
    render(<Counter />);

    expect(screen.getByTestId("counter")).toBeInTheDocument();
  });

  it("should render the counter with the correct initial value", () => {
    render(<Counter initialValue={10} />);

    const countElement = screen.getByTestId("count");

    expect(countElement).toHaveTextContent("10");
  });

  it("should render the counter with the correct value after incrementing", async () => {
    const user = userEvent.setup();

    render(<Counter />);

    const incrementElement = screen.getByTestId("increment");

    await user.click(incrementElement);

    const countElement = screen.getByTestId("count");

    expect(countElement).toHaveTextContent("1");
  });

  it("should render the counter with the correct value after incrementing multiple times", async () => {
    const user = userEvent.setup();

    render(<Counter />);

    const incrementElement = screen.getByTestId("increment");

    await user.tripleClick(incrementElement);

    const countElement = screen.getByTestId("count");

    expect(countElement).toHaveTextContent("3");
  });

  it("should match the snapshot", () => {
    const { asFragment } = render(<Counter />);

    expect(asFragment()).toMatchSnapshot();
  });
});
