import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TemperatureConverter } from "../../components";

describe("TemperatureConverter", () => {
  it("should render the temperature converter", () => {
    render(<TemperatureConverter />);

    expect(screen.getByTestId("temperatureConverter")).toBeInTheDocument();
  });

  it("should render 100 Celsius 212 Fahrenheit", () => {
    render(<TemperatureConverter celsius={100} />);

    const celsiusInput = screen.getByTestId("celsius");
    const fahrenheitInput = screen.getByTestId("fahrenheit");

    expect(celsiusInput).toHaveValue(100);
    expect(fahrenheitInput).toHaveValue(212);
  });

  it("should render 23 Fahrenheit and -5 Celsius", () => {
    render(<TemperatureConverter fahrenheit={23} />);

    const celsiusInput = screen.getByTestId("celsius");
    const fahrenheitInput = screen.getByTestId("fahrenheit");

    expect(celsiusInput).toHaveValue(-5);
    expect(fahrenheitInput).toHaveValue(23);
  });

  it("should convert -13e3 Celsius to -23368 Fahrenheit", async () => {
    const user = userEvent.setup();

    render(<TemperatureConverter />);

    const celsiusInput = screen.getByTestId("celsius");
    const fahrenheitInput = screen.getByTestId("fahrenheit");

    await user.clear(celsiusInput);

    await user.type(celsiusInput, "-13e3");

    expect(fahrenheitInput).toHaveValue(-23368);
  });

  it("should convert -13 Fahrenheit to -25 Celsius", async () => {
    const user = userEvent.setup();

    render(<TemperatureConverter />);

    const celsiusInput = screen.getByTestId("celsius");
    const fahrenheitInput = screen.getByTestId("fahrenheit");

    await user.clear(fahrenheitInput);

    await user.type(fahrenheitInput, "-13");

    expect(celsiusInput).toHaveValue(-25);
  });

  it("should not convert a non-numeric value to Fahrenheit", async () => {
    const user = userEvent.setup();

    render(<TemperatureConverter />);

    const celsiusInput = screen.getByTestId("celsius");
    const fahrenheitInput = screen.getByTestId("fahrenheit");

    await user.clear(celsiusInput);

    await user.type(celsiusInput, "abc");

    expect(fahrenheitInput).toHaveValue(32);
  });

  it("should not convert a non-numeric value to Celsius", async () => {
    const user = userEvent.setup();

    render(<TemperatureConverter />);

    const celsiusInput = screen.getByTestId("celsius");
    const fahrenheitInput = screen.getByTestId("fahrenheit");

    await user.clear(fahrenheitInput);

    await user.type(fahrenheitInput, "abc");

    expect(celsiusInput).toHaveValue(0);
  });

  it("should not convert an empty value to Fahrenheit", async () => {
    const user = userEvent.setup();

    render(<TemperatureConverter />);

    const celsiusInput = screen.getByTestId("celsius");
    const fahrenheitInput = screen.getByTestId("fahrenheit");

    await user.clear(celsiusInput);

    expect(fahrenheitInput).toHaveValue(32);
  });

  it("should not convert an empty value to Celsius", async () => {
    const user = userEvent.setup();

    render(<TemperatureConverter />);

    const celsiusInput = screen.getByTestId("celsius");

    const fahrenheitInput = screen.getByTestId("fahrenheit");

    await user.clear(fahrenheitInput);

    expect(celsiusInput).toHaveValue(0);
  });

  it("should match the snapshot", () => {
    const { asFragment } = render(<TemperatureConverter />);

    expect(asFragment()).toMatchSnapshot();
  });
});
