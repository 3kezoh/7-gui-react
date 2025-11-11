import {
	Counter,
	CRUD,
	FlightBooker,
	TemperatureConverter,
	Timer,
} from "./components";

function App() {
	return (
		<div className="container mx-auto p-4 grid gap-4">
			<Counter />
			<TemperatureConverter />
			<FlightBooker />
			<Timer />
			<CRUD />
		</div>
	);
}

export default App;
