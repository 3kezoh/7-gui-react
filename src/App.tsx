import { Counter, TemperatureConverter, FlightBooker } from "./components";
import { Timer } from "./components/Timer";

function App() {
  return (
    <div className="App">
      <Counter />
      <TemperatureConverter />
      <FlightBooker />
      <Timer />
    </div>
  );
}

export default App;
