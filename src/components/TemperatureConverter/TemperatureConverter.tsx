import {
  UseTemperatureParams,
  isTemperature,
  useTemperature,
} from "../../hooks";
import { Input } from "../Input";

type TemperatureConverterProps = UseTemperatureParams;

/**
 * A component that converts temperature in Celsius to Fahrenheit and vice versa.
 */
export function TemperatureConverter(props: TemperatureConverterProps) {
  const [{ celsius, fahrenheit }, setTemperature] = useTemperature(props);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (isTemperature(name)) {
      return setTemperature(value, name);
    }
  }

  return (
    <div
      className="flex gap-4 p-4 border border-black w-fit"
      data-testid="temperatureConverter"
    >
      <Input
        className="max-w-[3rem]"
        type="number"
        name="celsius"
        value={celsius.toString()}
        onChange={onChange}
      />
      <label htmlFor="celsius">Celsius =</label>
      <Input
        className="max-w-[3rem]"
        type="number"
        name="fahrenheit"
        value={fahrenheit.toString()}
        onChange={onChange}
      />
      <label htmlFor="fahrenheit">Fahrenheit</label>
    </div>
  );
}

export default TemperatureConverter;
