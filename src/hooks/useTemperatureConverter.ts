import { useCallback, useReducer } from "react";
import { isNumeric, toCelsius, toFahrenheit } from "../utils";

type Temperature = "celsius" | "fahrenheit";

type ACTIONTYPE = { type: Temperature; payload: string };

type InitialState = {
  celsius: number | string;
  fahrenheit: number | string;
};

const initialState = {
  celsius: 0,
  fahrenheit: 32,
};

/**
 * Determines whether `str` is a `Temperature`.
 */
export function isTemperature(str: string): str is Temperature {
  return ["celsius", "fahrenheit"].includes(str);
}

/**
 * Determines the initial state of the reducer.
 */
function getInitialState({ celsius, fahrenheit }: UseTemperatureParams) {
  if (celsius && isFinite(celsius)) {
    return { celsius, fahrenheit: toFahrenheit(celsius) };
  }

  if (fahrenheit && isFinite(fahrenheit)) {
    return { celsius: toCelsius(fahrenheit), fahrenheit };
  }

  return initialState;
}

function reducer(state: InitialState, { type, payload }: ACTIONTYPE) {
  switch (type) {
    case "celsius":
      return {
        ...state,
        celsius: payload,
        ...(isNumeric(payload) && { fahrenheit: toFahrenheit(+payload) }),
      };

    case "fahrenheit":
      return {
        ...state,
        fahrenheit: payload,
        ...(isNumeric(payload) && { celsius: toCelsius(+payload) }),
      };

    /* c8 ignore next 2 */
    default:
      return state;
  }
}

export type UseTemperatureParams =
  | {
      /** The initial temperature in degrees Celsius, the default value is 0. */
      celsius?: number;
      /** This value cannot be set if `celsius` is set. */
      fahrenheit?: never;
    }
  | {
      /** This value cannot be set if `fahrenheit` is set. */
      celsius?: never;
      /** The initial temperature in degrees Fahrenheit, the default value is 32. */
      fahrenheit?: number;
    };

export function useTemperature(params: UseTemperatureParams) {
  const initialState = getInitialState(params);

  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * Updates the temperature in the specified `unit`, the other unit(s) will be
   * automatically converted if possible.
   */
  const setTemperature = useCallback(
    (value: string, unit: Temperature) =>
      dispatch({ type: unit, payload: value }),
    []
  );

  return [state, setTemperature] as const;
}
