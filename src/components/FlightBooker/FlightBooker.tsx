import { useReducer, useCallback, useMemo } from "react";
import classes from "./flightBooker.module.css";

type Flight = "one-way flight" | "return flight";

type FlightDate = "startDate" | "returnDate";

type ACTIONTYPE =
  | { type: FlightDate; payload: string }
  | { type: "flight"; payload: Flight };

type State = {
  flight: Flight;
  startDateAsString: string;
  returnDateAsString: string;
};

/**
 * Determines whether `str` is a {@link Flight}.
 */
function isFlight(str: string): str is Flight {
  return ["one-way flight", "return flight"].includes(str);
}

/**
 * Determines whether `str` is a {@link FlightDate}
 */
function isFlightDate(str: string): str is FlightDate {
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

    default:
      return state;
  }
}

export function FlightBooker() {
  const nowAsString = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [state, dispatch] = useReducer(reducer, {
    flight: "one-way flight",
    startDateAsString: nowAsString,
    returnDateAsString: nowAsString,
  });

  const { flight, startDateAsString, returnDateAsString } = state;

  /**
   * Dispatches the action to change the flight.
   */
  const onFlightChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = target;

      if (isFlight(value)) {
        dispatch({ type: "flight", payload: value });
      }
    },
    []
  );

  /**
   * Dispatches the action to change the flight dates.
   */
  const onFlightDateChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = target;

      if (isFlightDate(name)) {
        dispatch({ type: name, payload: value });
      }
    },
    []
  );

  /**
   * Memoizes values derived from `startDateAsString`.
   */
  const [startDate, startDateTime, isStartDateValid] = useMemo(() => {
    const startDate = new Date(startDateAsString);
    const startDateTime = startDate.getTime();
    const isStartDateValid = !Number.isNaN(startDateTime);

    return [startDate, startDateTime, isStartDateValid];
  }, [startDateAsString]);

  /**
   * Memoizes values derived from `returnDateAsString`.
   */
  const [returnDate, returnDateTime, isReturnDateValid] = useMemo(() => {
    const returnDate = new Date(returnDateAsString);
    const returnDateTime = returnDate.getTime();
    const isReturnDateValid = !Number.isNaN(returnDateTime);

    return [returnDate, returnDateTime, isReturnDateValid];
  }, [returnDateAsString]);

  const isOneWayFlight = useMemo(() => flight === "one-way flight", [flight]);

  /**
   * Informs the user of his selection.
   */
  const onBookClick = useCallback(() => {
    const dateTimeFormat = new Intl.DateTimeFormat("en-EN");

    const formattedStartDate = dateTimeFormat.format(startDate);

    if (isOneWayFlight) {
      return window.alert(
        `You have booked a ${flight} on ${formattedStartDate}`
      );
    }

    const formattedReturnDate = dateTimeFormat.format(returnDate);

    alert(
      `You have booked a ${flight} on ${formattedStartDate} to ${formattedReturnDate}`
    );
  }, [startDate, isOneWayFlight, returnDate, flight]);

  const isButtonDisabled = useMemo(() => {
    if (isOneWayFlight) {
      return !isStartDateValid;
    }

    const isBookable = returnDateTime > startDateTime;

    return !isStartDateValid || !isReturnDateValid || !isBookable;
  }, [
    returnDateTime,
    startDateTime,
    isOneWayFlight,
    isStartDateValid,
    isReturnDateValid,
  ]);

  return (
    <div className={classes.flightBooker} data-testid="flightBooker">
      <select value={flight} onChange={onFlightChange} data-testid="flight">
        <option value="one-way flight" data-testid="oneWayFlight">
          one-way flight
        </option>
        <option value="return flight" data-testid="returnFlight">
          return flight
        </option>
      </select>
      <input
        className={isStartDateValid ? undefined : classes.error}
        name="startDate"
        type="date"
        value={startDateAsString}
        onChange={onFlightDateChange}
        pattern="\d{4}-\d{2}-\d{2}"
        data-testid="startDate"
      />
      <input
        className={isReturnDateValid ? undefined : classes.error}
        disabled={isOneWayFlight}
        name="returnDate"
        type="date"
        value={returnDateAsString}
        onChange={onFlightDateChange}
        pattern="\d{4}-\d{2}-\d{2}"
        data-testid="returnDate"
      />
      <button
        onClick={onBookClick}
        disabled={isButtonDisabled}
        data-testid="book"
      >
        book
      </button>
    </div>
  );
}

export default FlightBooker;
