import type { ItineraryDay, StayType, TravelMode } from '../../types';
import './TripPrintView.css';

interface PrintCosts { travel?: number; stay?: number; food?: number; activities?: number; misc?: number; total: number; }

interface TripPrintViewProps {
  className?: string;
  destination: string;
  origin: string;
  departureTime: string;
  travelers: number;
  days: number;
  travelMode: TravelMode;
  stayType: StayType;
  costs: PrintCosts;
  itinerary: ItineraryDay[];
  shareUrl: string;
}

export default function TripPrintView(props: TripPrintViewProps) {
  const costRows = [
    ['Travel', props.costs.travel], ['Stay', props.costs.stay], ['Food', props.costs.food],
    ['Activities', props.costs.activities], ['Buffer', props.costs.misc],
  ].filter((row): row is [string, number] => typeof row[1] === 'number');
  return (
    <article className={`trip-print-view ${props.className ?? ''}`} aria-label="Printable trip plan">
      <header><span>MahaSafar</span><h1>{props.destination} trip plan</h1><p>From {props.origin} · {props.days} days · {props.travelers} travelers</p></header>
      <dl className="trip-print-view__details">
        <div><dt>Departure</dt><dd>{props.departureTime}</dd></div><div><dt>Travel mode</dt><dd>{props.travelMode}</dd></div><div><dt>Stay</dt><dd>{props.stayType}</dd></div>
      </dl>
      <h2>Estimated costs</h2>
      <table><tbody>{costRows.map(([label, cost]) => <tr key={label}><th>{label}</th><td>₹{cost.toLocaleString('en-IN')}</td></tr>)}<tr><th>Total</th><td>₹{props.costs.total.toLocaleString('en-IN')}</td></tr></tbody></table>
      <h2>Day-wise itinerary</h2>
      {props.itinerary.map((day) => <section className="trip-print-view__day" key={day.day}><h3>Day {day.day}: {day.title}</h3>{day.events.map((event, index) => <div key={index}><time>{event.time}</time><strong>{event.title}</strong><p>{event.description}</p></div>)}</section>)}
      <footer><p>Costs are estimates. Check live prices and timings before travel.</p><p>Trip link: {props.shareUrl}</p></footer>
    </article>
  );
}
