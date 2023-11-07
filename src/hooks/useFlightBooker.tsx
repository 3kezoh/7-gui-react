import { useReducer } from "react";

type Flight = "one-way flight" | "return flight";

type FlightDate = "startDate" | "returnDate";

type State = {
  flight: Flight;
  startDateAsString: string;
  returnDateAsString: string;
};

type ACTIONTYPE =
  | { type: FlightDate; payload: string }
  | { type: "flight"; payload: Flight };

/**
 * Determines whether `str` is a {@link Flight}.
 */
export function isFlight(str: string): str is Flight {
  return ["one-way flight", "return flight"].includes(str);
}

/**
 * Determines whether `str` is a {@link FlightDate}
 */
export function isFlightDate(str: string): str is FlightDate {
  return ["startDate", "returnDate"].includes(str);
}

function reducer(state: State, { type, payload }: ACTIONTYPE): State {
  switch (type) {
    case "flight":
      return {
        ...state,
        flight: payload,
      };

    case "startDate":
      return {
        ...state,
        startDateAsString: payload,
      };

    case "returnDate":
      return {
        ...state,
        returnDateAsString: payload,
      };

    /* c8 ignore next 2 */
    default:
      return state;
  }
}

export function useFlightBooker(initialState?: Partial<State>) {
  const nowAsString = new Date().toISOString().slice(0, 10);

  const defaultState = {
    flight: "one-way flight",
    startDateAsString: nowAsString,
    returnDateAsString: nowAsString,
  } satisfies State;

  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    ...initialState,
  });

  function setFlight(payload: Flight) {
    dispatch({ type: "flight", payload });
  }

  function setFlightDate(type: FlightDate, payload: string) {
    dispatch({ type, payload });
  }

  return [state, { setFlight, setFlightDate }] as const;
}
