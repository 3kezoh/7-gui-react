import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "../../components";

describe("Counter", () => {
  it("should be in the document", () => {
    render(<Counter />);

    const counter = screen.getByTestId("counter");

    expect(counter).toBeInTheDocument();
  });

  it("should render the counter with the correct initial value", () => {
    render(<Counter initialValue={10} />);

    const countElement = screen.getByText(10);

    expect(countElement).toBeInTheDocument();
  });

  it("should render the counter with the correct value after incrementing", async () => {
    const user = userEvent.setup();

    render(<Counter />);

    const incrementElement = screen.getByRole("button", { name: /count/i });

    await user.click(incrementElement);

    const countElement = screen.getByText(1);

    expect(countElement).toBeInTheDocument();
  });

  it("should render the counter with the correct value after incrementing multiple times", async () => {
    const user = userEvent.setup();

    render(<Counter />);

    const incrementElement = screen.getByRole("button", { name: /count/i });

    await user.tripleClick(incrementElement);

    const countElement = screen.getByText(3);

    expect(countElement).toBeInTheDocument();
  });

  it("should match the snapshot", () => {
    const { asFragment } = render(<Counter />);

    expect(asFragment()).toMatchSnapshot();
  });
});
