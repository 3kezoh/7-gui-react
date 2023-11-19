import { isFlight, isFlightDate, useFlightBooker } from "../../hooks";
import { Button } from "../Button";
import { Input } from "../Input";

export function FlightBooker() {
  const [state, { setFlight, setFlightDate }] = useFlightBooker();
  const { flight, startDateAsString, returnDateAsString } = state;
  const startDate = new Date(startDateAsString);
  const returnDate = new Date(returnDateAsString);
  const startDateTime = startDate.getTime();
  const returnDateTime = returnDate.getTime();
  const isStartDateValid = !Number.isNaN(startDateTime);
  const isReturnDateValid = !Number.isNaN(returnDateTime);
  const isOneWayFlight = flight === "one-way flight";

  /**
   * Dispatches the action to change the flight.
   */
  function onFlightChange({ target }: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = target;

    if (isFlight(value)) {
      setFlight(value);
    }
  }

  /**
   * Dispatches the action to change the flight dates.
   */
  function onFlightDateChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const { value, name } = target;

    if (isFlightDate(name)) {
      setFlightDate(name, value);
    }
  }

  /**
   * Informs the user of his selection.
   */
  function onBookClick() {
    const dateTimeFormat = new Intl.DateTimeFormat("en-EN");
    const formattedStartDate = dateTimeFormat.format(startDate);

    if (isOneWayFlight) {
      return alert(`You have booked a ${flight} on ${formattedStartDate}`);
    }

    const formattedReturnDate = dateTimeFormat.format(returnDate);

    alert(
      `You have booked a ${flight} on ${formattedStartDate} to ${formattedReturnDate}`,
    );
  }

  /**
   * Returns whether the flight is bookable
   */
  function isBookable() {
    if (isOneWayFlight) {
      return isStartDateValid;
    }

    const isReturnAfterStart = returnDateTime > startDateTime;

    return isStartDateValid && isReturnDateValid && isReturnAfterStart;
  }

  return (
    <div
      className="grid gap-4 p-4 border border-black w-fit"
      data-testid="flightBooker"
    >
      <select value={flight} onChange={onFlightChange}>
        <option value="one-way flight">one-way flight</option>
        <option value="return flight">return flight</option>
      </select>
      <Input
        className={isStartDateValid ? undefined : "text-red-600"}
        name="startDate"
        type="date"
        value={startDateAsString}
        onChange={onFlightDateChange}
        pattern="\d{4}-\d{2}-\d{2}"
        data-testid="startDate"
      />
      <Input
        className={isReturnDateValid ? undefined : "text-red-600"}
        disabled={isOneWayFlight}
        name="returnDate"
        type="date"
        value={returnDateAsString}
        onChange={onFlightDateChange}
        pattern="\d{4}-\d{2}-\d{2}"
        data-testid="returnDate"
      />
      <Button onClick={onBookClick} disabled={!isBookable()}>
        Book
      </Button>
    </div>
  );
}

export default FlightBooker;
