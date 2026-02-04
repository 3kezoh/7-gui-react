import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { TemperatureConverter } from "@/components";

describe("TemperatureConverter", () => {
	it("should be in the document", async () => {
		const screen = await render(<TemperatureConverter />);

		const temperatureConverter = screen.getByTestId("temperatureConverter");

		expect(temperatureConverter).toBeInTheDocument();
	});

	it("should render 100 Celsius and 212 Fahrenheit", async () => {
		const screen = await render(<TemperatureConverter celsius={100} />);

		const celsiusElement = screen.getByLabelText(/Celsius =/i);
		const fahrenheitElement = screen.getByLabelText(/Fahrenheit/i);

		expect(celsiusElement).toHaveValue(100);
		expect(fahrenheitElement).toHaveValue(212);
	});

	it("should render 23 Fahrenheit and -5 Celsius", async () => {
		const screen = await render(<TemperatureConverter fahrenheit={23} />);

		const celsiusElement = screen.getByLabelText(/Celsius =/i);
		const fahrenheitElement = screen.getByLabelText(/Fahrenheit/i);

		expect(celsiusElement).toHaveValue(-5);
		expect(fahrenheitElement).toHaveValue(23);
	});

	it("should convert -13e3 Celsius to -23368 Fahrenheit", async () => {
		const user = userEvent.setup();

		const screen = await render(<TemperatureConverter />);

		const celsiusElement = screen.getByLabelText(/Celsius =/i);
		const fahrenheitElement = screen.getByLabelText(/Fahrenheit/i);

		await user.clear(celsiusElement);

		await user.fill(celsiusElement, "-13e3");

		expect(fahrenheitElement).toHaveValue(-23368);
	});

	it("should convert -13 Fahrenheit to -25 Celsius", async () => {
		const user = userEvent.setup();

		const screen = await render(<TemperatureConverter />);

		const celsiusElement = screen.getByLabelText(/Celsius =/i);
		const fahrenheitElement = screen.getByLabelText(/Fahrenheit/i);

		await user.fill(fahrenheitElement, "-13");

		expect(celsiusElement).toHaveValue(-25);
	});

	it("should not convert a non-numeric value to Fahrenheit", async () => {
		const user = userEvent.setup();

		const screen = await render(<TemperatureConverter />);

		const celsiusLocator = screen.getByLabelText(/Celsius =/i);
		const fahrenheitLocator = screen.getByLabelText(/Fahrenheit/i);

		await user.type(celsiusLocator, "abc");

		expect(fahrenheitLocator).toHaveValue(32);
	});

	it("should not convert a non-numeric value to Celsius", async () => {
		const user = userEvent.setup();

		const screen = await render(<TemperatureConverter />);

		const celsiusElement = screen.getByLabelText(/Celsius =/i);
		const fahrenheitElement = screen.getByLabelText(/Fahrenheit/i);

		await user.clear(fahrenheitElement);

		await user.type(fahrenheitElement, "abc");

		expect(celsiusElement).toHaveValue(0);
	});

	it("should not convert an empty value to Fahrenheit", async () => {
		const user = userEvent.setup();

		const screen = await render(<TemperatureConverter />);

		const celsiusElement = screen.getByLabelText(/Celsius =/i);
		const fahrenheitElement = screen.getByLabelText(/Fahrenheit/i);

		await user.clear(celsiusElement);

		expect(fahrenheitElement).toHaveValue(32);
	});

	it("should not convert an empty value to Celsius", async () => {
		const user = userEvent.setup();

		const screen = await render(<TemperatureConverter />);

		const celsiusElement = screen.getByLabelText(/Celsius =/i);

		const fahrenheitElement = screen.getByLabelText(/Fahrenheit/i);

		await user.clear(fahrenheitElement);

		expect(celsiusElement).toHaveValue(0);
	});
});
