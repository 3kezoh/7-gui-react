import classes from "./temperatureConverter.module.css";
import {
  useTemperature,
  UseTemperatureParams,
  isTemperature,
} from "../../hooks";

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
      className={classes.temperatureConverter}
      data-testid="temperatureConverter"
    >
      <input
        className={classes.temperature}
        type="number"
        name="celsius"
        value={celsius.toString()}
        onChange={onChange}
        id="celsius"
      />
      <label htmlFor="celsius">Celsius =</label>
      <input
        className={classes.temperature}
        type="number"
        name="fahrenheit"
        value={fahrenheit.toString()}
        onChange={onChange}
        id="fahrenheit"
      />
      <label htmlFor="fahrenheit">Fahrenheit</label>
    </div>
  );
}

export default TemperatureConverter;
