import { useMemo, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, Calendar, ChevronRight, ExternalLink, Hotel, LoaderCircle, MapPin, Navigation, Route, Backpack, Ticket, Users, Utensils, Wallet } from 'lucide-react';
import { sampleDestinations } from '../data/destinations';
import './ExplorePage.css';

type BudgetRange = 'budget' | 'standard' | 'premium';
interface RouteSelection { from: string; to: string; }

const STARTING_POINT_SUGGESTIONS = ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Kolhapur', 'Chhatrapati Sambhajinagar'];
const TRAVEL_PREFERENCES = ['Nature', 'Forts', 'Beaches', 'Temples', 'Adventure', 'Historical'];
const BUDGET_ASSUMPTIONS: Record<BudgetRange, { stay: number; food: number; transport: number; activities: number; label: string }> = {
  budget: { stay: 1300, food: 600, transport: 1200, activities: 350, label: 'Budget' },
  standard: { stay: 3000, food: 950, transport: 2200, activities: 800, label: 'Standard' },
  premium: { stay: 7000, food: 1800, transport: 4000, activities: 1600, label: 'Premium' },
};

function destinationFromSlug(slug?: string) { return sampleDestinations.find((destination) => destination.slug === slug); }
function createDirectionsUrl({ from, to }: RouteSelection) { return `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', origin: from, destination: to, travelmode: 'driving' })}`; }
function createMapEmbedUrl({ from, to }: RouteSelection) { return `https://www.google.com/maps?${new URLSearchParams({ output: 'embed', f: 'd', saddr: from, daddr: to, dirflg: 'd' })}`; }

export default function ExplorePage() {
  const { destinationSlug } = useParams<{ destinationSlug?: string }>();
  const routeDestination = destinationFromSlug(destinationSlug);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(routeDestination?.name ?? '');
  const [route, setRoute] = useState<RouteSelection | null>(null);
  const [routeError, setRouteError] = useState('');
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(2);
  const [budget, setBudget] = useState<BudgetRange>('standard');
  const [preferences, setPreferences] = useState<string[]>(['Nature']);
  const [hasPlan, setHasPlan] = useState(false);

  const selectedDestination = useMemo(() => {
    const normalizedTo = to.trim().toLowerCase();
    return sampleDestinations.find((destination) => destination.name.toLowerCase() === normalizedTo || destination.districtName.toLowerCase() === normalizedTo);
  }, [to]);
  const suggestions = useMemo(() => [...new Set([...STARTING_POINT_SUGGESTIONS, ...sampleDestinations.map((destination) => destination.name)])], []);
  const directionsUrl = route ? createDirectionsUrl(route) : '';
  const mapUrl = route ? createMapEmbedUrl(route) : '';
  const assumptions = BUDGET_ASSUMPTIONS[budget];
  const costBreakdown = useMemo(() => {
    const accommodation = assumptions.stay * Math.ceil(travelers / 2) * Math.max(0, days - 1);
    const food = assumptions.food * travelers * days;
    const transport = assumptions.transport * travelers;
    const activities = assumptions.activities * travelers * days;
    return { accommodation, food, transport, activities, total: accommodation + food + transport + activities };
  }, [assumptions, days, travelers]);

  const itinerary = useMemo(() => {
    if (!hasPlan || !route) return [];
    const places = selectedDestination?.topPlaces ?? [];
    return Array.from({ length: days }, (_, index) => {
      const day = index + 1;
      if (day === 1) return { day, title: `Arrive in ${route.to}`, items: [
        `Travel from ${route.from}; check live timing and the chosen route in Google Maps before departure.`,
        `Check in around ${selectedDestination?.districtName ?? route.to} and take time to settle in.`,
        places[0]?.name ? `Visit ${places[0].name}: ${places[0].description}` : `Start with a short orientation walk around ${route.to}.`,
      ] };
      if (day === days && days > 1) {
        const place = places[(day - 2) % Math.max(places.length, 1)];
        return { day, title: 'Final highlights & onward travel', items: [
          place?.name ? `Visit ${place.name}: ${place.description}` : `Leave time for a final local experience in ${route.to}.`,
          `Return to ${route.from} or continue onward. Confirm live road, rail, or bus timing before leaving.`,
        ] };
      }
      const firstPlace = places[((day - 2) * 2) % Math.max(places.length, 1)];
      const secondPlace = places[(((day - 2) * 2) + 1) % Math.max(places.length, 1)];
      return { day, title: `${route.to} at your pace`, items: [
        firstPlace?.name ? `Begin with ${firstPlace.name}: ${firstPlace.description}` : `Choose a ${preferences.join(', ').toLowerCase()} experience near ${route.to}.`,
        secondPlace?.name ? `Continue to ${secondPlace.name}: ${secondPlace.description}` : 'Keep the afternoon flexible for local transport and weather conditions.',
        'Plan a meal break and confirm opening hours for each stop on the day.',
      ] };
    });
  }, [days, hasPlan, preferences, route, selectedDestination]);

  const updateRoute = () => {
    if (!from.trim() || !to.trim()) { setRouteError('Enter both a starting location and destination to show directions.'); return false; }
    setRouteError(''); setMapError(false); setIsMapLoading(true); setRoute({ from: from.trim(), to: to.trim() }); return true;
  };
  const handleShowRoute = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); updateRoute(); };
  const handleGeneratePlan = () => { if (updateRoute()) setHasPlan(true); };
  const togglePreference = (preference: string) => setPreferences((current) => current.includes(preference) ? current.length > 1 ? current.filter((item) => item !== preference) : current : [...current, preference]);

  return <div className="planner-page">
    <header className="planner-header"><div className="container"><nav className="planner-breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={12} /><span aria-current="page">Explore</span></nav><div className="planner-header__content"><div className="planner-tag"><Backpack size={16} /><span>Route explorer & trip planner</span></div><h1 className="planner-title">Let's map out your trip</h1><p className="planner-subtitle">Pick your route first, then build a day-by-day plan right below the map.</p></div></div></header>
    <div className="container planner-container">
      <section className="route-explorer" aria-labelledby="route-explorer-title"><div className="route-explorer__heading"><div><span className="planner-tag"><Route size={16} /> Plan a route</span><h2 id="route-explorer-title" className="planner-section-title">Where would you like to go?</h2></div><p>Type in where you're starting and pick a Maharashtra destination. Live directions come from Google Maps.</p></div><form className="route-explorer__form" onSubmit={handleShowRoute} noValidate><div className="route-field"><label htmlFor="route-from"><Navigation size={15} /> From</label><input id="route-from" list="mahasafar-locations" value={from} onChange={(event) => { setFrom(event.target.value); setHasPlan(false); }} placeholder="Mumbai, Pune, or your starting point" /></div><div className="route-field"><label htmlFor="route-to"><MapPin size={15} /> To</label><input id="route-to" list="mahasafar-locations" value={to} onChange={(event) => { setTo(event.target.value); setHasPlan(false); }} placeholder="Choose a Maharashtra destination" /></div><datalist id="mahasafar-locations">{suggestions.map((suggestion) => <option key={suggestion} value={suggestion} />)}</datalist><button className="btn btn--primary route-explorer__submit" type="submit"><Navigation size={16} /> Show Route</button></form>{routeError && <p className="route-explorer__error" role="alert"><AlertCircle size={16} /> {routeError}</p>}</section>
      <section className="route-map" aria-live="polite" aria-label="Route map">{route ? <><div className="route-map__meta"><div><span>Route</span><strong>{route.from} <Route size={14} /> {route.to}</strong></div><a href={directionsUrl} target="_blank" rel="noreferrer" className="route-map__directions">Open live directions <ExternalLink size={14} /></a></div><div className="route-map__canvas">{isMapLoading && <div className="route-map__loading"><LoaderCircle size={24} /> Loading live map…</div>}{mapError ? <div className="route-map__fallback"><AlertCircle size={22} /><p>We could not load the embedded map. Open live directions to see the route and travel details.</p><a href={directionsUrl} target="_blank" rel="noreferrer" className="btn btn--primary">Open Google Maps <ExternalLink size={15} /></a></div> : <iframe title={`Directions from ${route.from} to ${route.to}`} src={mapUrl} onLoad={() => setIsMapLoading(false)} onError={() => { setIsMapLoading(false); setMapError(true); }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}</div><p className="route-map__note">Distance and travel time are deliberately shown only in live directions, where they can reflect current route and traffic information.</p></> : <div className="route-map__empty"><MapPin size={30} /><h2>Your route map will appear here</h2><p>Enter both locations and select “Show Route” to load live directions with route markers.</p></div>}</section>
      <section className="planner-trip" aria-labelledby="trip-planner-title"><div className="planner-trip__heading"><div><span className="planner-tag"><Backpack size={16} /> Built from our local guide</span><h2 id="trip-planner-title" className="planner-section-title">Plan Your Trip</h2></div><p>We've carried your route over, so there's nothing to type in twice.</p></div><div className="planner-trip__route-summary"><span><Navigation size={15} /> Starting location <strong>{from || 'Not selected'}</strong></span><span><MapPin size={15} /> Destination <strong>{to || 'Not selected'}</strong></span></div><div className="planner-grid"><div className="planner-form-card"><div className="planner-row"><div className="planner-field"><label htmlFor="trip-date" className="planner-label"><Calendar size={14} /> Travel start date</label><input id="trip-date" type="date" className="planner-select" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></div><div className="planner-field"><label htmlFor="traveler-count" className="planner-label"><Users size={14} /> Travellers</label><input id="traveler-count" type="number" min="1" max="20" className="planner-select" value={travelers} onChange={(event) => setTravelers(Math.min(20, Math.max(1, Number(event.target.value) || 1)))} /></div></div><div className="planner-row"><div className="planner-field"><label htmlFor="day-count" className="planner-label"><Calendar size={14} /> Number of days</label><input id="day-count" type="number" min="1" max="14" className="planner-select" value={days} onChange={(event) => setDays(Math.min(14, Math.max(1, Number(event.target.value) || 1)))} /></div><div className="planner-field"><label htmlFor="budget-range" className="planner-label"><Wallet size={14} /> Budget range</label><select id="budget-range" className="planner-select" value={budget} onChange={(event) => setBudget(event.target.value as BudgetRange)}><option value="budget">Budget</option><option value="standard">Standard</option><option value="premium">Premium</option></select></div></div><div className="planner-field"><span className="planner-label">Travel preferences</span><div className="planner-pill-group">{TRAVEL_PREFERENCES.map((preference) => <button type="button" key={preference} onClick={() => togglePreference(preference)} className={`planner-pill ${preferences.includes(preference) ? 'planner-pill--active' : ''}`}>{preference}</button>)}</div></div><button type="button" className="btn btn--primary planner-generate" onClick={handleGeneratePlan}><Backpack size={16} /> Build my plan</button></div><aside className="planner-cost-card"><div className="cost-header"><span className="cost-kicker">Planning estimate — not a quote</span><div className="cost-grand-total">₹{costBreakdown.total.toLocaleString('en-IN')}</div><span className="cost-per-person">Approx. ₹{Math.round(costBreakdown.total / travelers).toLocaleString('en-IN')} per traveller</span></div><div className="cost-items"><div className="cost-item"><span className="cost-item__label"><Hotel size={14} /> Accommodation</span><span className="cost-item__val">₹{costBreakdown.accommodation.toLocaleString('en-IN')}</span></div><div className="cost-item"><span className="cost-item__label"><Utensils size={14} /> Food</span><span className="cost-item__val">₹{costBreakdown.food.toLocaleString('en-IN')}</span></div><div className="cost-item"><span className="cost-item__label"><Navigation size={14} /> Transport allowance</span><span className="cost-item__val">₹{costBreakdown.transport.toLocaleString('en-IN')}</span></div><div className="cost-item"><span className="cost-item__label"><Ticket size={14} /> Activities</span><span className="cost-item__val">₹{costBreakdown.activities.toLocaleString('en-IN')}</span></div></div><div className="cost-guarantee"><AlertCircle size={16} className="text-earth" /><span>{assumptions.label} planning allowances are generic estimates, not live hotel, fare, activity, or availability data. Confirm actual costs before booking.</span></div><p className="planner-stay-note"><strong>Stay suggestion:</strong> Look for hotels, hostels, homestays, or budget stays around {selectedDestination?.districtName ?? (to || 'your destination')} transport and town centre. Compare current options before booking.</p></aside></div></section>
      {hasPlan && route && <section className="planner-itinerary-section" aria-live="polite"><div className="planner-itinerary-header"><h2 className="planner-section-title">Your {days}-Day {route.to} Itinerary</h2><p className="planner-subtitle">{startDate ? `Starting ${new Date(`${startDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}. ` : ''}Put together from our destination guide and the preferences you picked.</p></div>{!selectedDestination && <div className="planner-disclaimer"><AlertCircle size={16} /><span>We do not yet have a detailed MahaSafar guide for “{route.to}”. This is a flexible planning framework; check local conditions and verified listings before you travel.</span></div>}<div className="planner-itinerary-days">{itinerary.map((dayPlan) => <article key={dayPlan.day} className="itinerary-day-card"><div className="itinerary-day-card__header"><span className="itinerary-day-badge">Day {dayPlan.day}</span><h3 className="itinerary-day-title">{dayPlan.title}</h3></div><ul className="itinerary-events-list">{dayPlan.items.map((item) => <li key={item} className="itinerary-evt"><span className="itinerary-evt__time">Plan</span><p className="itinerary-evt__desc">{item}</p></li>)}</ul></article>)}</div><div className="planner-disclaimer"><AlertCircle size={16} /><span>Opening hours, weather, road conditions, transit schedules, accommodation availability, and exact costs change. Verify them with live sources before booking or departing.</span></div></section>}
    </div>
  </div>;
}

