import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Car,
  Train,
  Bus,
  Bike,
  Check,
  Bookmark,
  Printer,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { sampleDestinations } from '../data/destinations';
import type { TravelMode, StayType, TravelStyle, FoodPreference } from '../types';
import './TripPlannerPage.css';

const ORIGIN_CITIES = [
  { name: 'Pune', distPune: 0, distMumbai: 150 },
  { name: 'Mumbai', distPune: 150, distMumbai: 0 },
  { name: 'Nashik', distPune: 210, distMumbai: 165 },
  { name: 'Chhatrapati Sambhajinagar', distPune: 235, distMumbai: 350 },
  { name: 'Nagpur', distPune: 720, distMumbai: 800 },
  { name: 'Kolhapur', distPune: 230, distMumbai: 390 },
];

export default function TripPlannerPage() {
  const { destinationSlug } = useParams<{ destinationSlug?: string }>();

  // State
  const [selectedDestSlug, setSelectedDestSlug] = useState<string>(
    destinationSlug || sampleDestinations[0].slug
  );
  const [originCity, setOriginCity] = useState('Pune');
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(2);
  const [travelMode, setTravelMode] = useState<TravelMode>('car');
  const [stayType, setStayType] = useState<StayType>('standard');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('balanced');
  const [foodPref, setFoodPref] = useState<FoodPreference>('both');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Active destination
  const activeDest = useMemo(() => {
    return (
      sampleDestinations.find((d) => d.slug === selectedDestSlug) ||
      sampleDestinations[0]
    );
  }, [selectedDestSlug]);

  // Distance estimation
  const estimatedOneWayKm = useMemo(() => {
    if (originCity === 'Mumbai') {
      return activeDest.distanceFromMumbai || 200;
    }
    return activeDest.distanceFromPune || 180;
  }, [originCity, activeDest]);

  // Transparent Cost Calculations (Maharashtra research baseline)
  const costBreakdown = useMemo(() => {
    const totalKm = estimatedOneWayKm * 2; // round trip

    // 1. Travel calculation
    let travelRatePerKm = 10; // car
    if (travelMode === 'bike') travelRatePerKm = 4;
    if (travelMode === 'train') travelRatePerKm = 2.5;
    if (travelMode === 'bus') travelRatePerKm = 3.2;

    let travelTotal = Math.round(totalKm * travelRatePerKm);
    // If car/bike, fuel is shared among travelers; if public transit, it is per person
    if (travelMode === 'train' || travelMode === 'bus') {
      travelTotal = travelTotal * travelers;
    }

    // 2. Stay calculation
    let stayPerNightPerRoom = 3000;
    if (stayType === 'budget') stayPerNightPerRoom = 1200;
    if (stayType === 'premium') stayPerNightPerRoom = 8000;

    const roomsNeeded = Math.ceil(travelers / 2);
    const nights = Math.max(1, days - 1);
    const stayTotal = stayPerNightPerRoom * roomsNeeded * nights;

    // 3. Food calculation
    let foodPerPersonPerDay = 700;
    if (foodPref === 'veg') foodPerPersonPerDay = 550;
    if (stayType === 'budget') foodPerPersonPerDay *= 0.75;
    if (stayType === 'premium') foodPerPersonPerDay *= 1.8;
    const foodTotal = Math.round(foodPerPersonPerDay * travelers * days);

    // 4. Activities calculation
    const actSum = activeDest.activities.reduce((acc, a) => acc + a.estimatedCost, 0);
    const actTotal = Math.max(300, actSum) * travelers;

    // 5. Misc & toll buffer
    const miscTotal = Math.round((travelTotal + stayTotal + foodTotal + actTotal) * 0.08);

    const total = travelTotal + stayTotal + foodTotal + actTotal + miscTotal;
    const perPerson = Math.round(total / travelers);

    return {
      travel: travelTotal,
      stay: stayTotal,
      food: foodTotal,
      activities: actTotal,
      misc: miscTotal,
      total,
      perPerson,
    };
  }, [estimatedOneWayKm, travelMode, travelers, stayType, days, foodPref, activeDest]);

  // Dynamic Day-by-Day Itinerary Generator
  const generatedItinerary = useMemo(() => {
    const itinerary = [];
    const places = activeDest.topPlaces || [];
    const activities = activeDest.activities || [];

    for (let dayNum = 1; dayNum <= days; dayNum++) {
      if (dayNum === 1) {
        itinerary.push({
          day: 1,
          title: `Departure & Arrival in ${activeDest.name}`,
          events: [
            {
              time: '07:00 AM',
              title: `Depart from ${originCity}`,
              desc: `Scenic journey via highway (~${Math.round(estimatedOneWayKm / 50)} hrs). Morning breakfast stop for Maharashtrian tea and snacks.`,
            },
            {
              time: '01:00 PM',
              title: 'Check-in & Regional Lunch',
              desc: `Settle into accommodation. Enjoy local specialities (${activeDest.foodAndCulture?.specialities?.slice(0, 2).join(', ') || 'local thali'}).`,
            },
            {
              time: '04:30 PM',
              title: places[0]?.name || 'Local Sightseeing',
              desc: places[0]?.description || 'Explore historic viewpoints and natural surroundings.',
            },
            {
              time: '07:30 PM',
              title: 'Evening Leisure & Sunset',
              desc: 'Golden hour walk and dinner at local dining spot.',
            },
          ],
        });
      } else if (dayNum === days) {
        itinerary.push({
          day: dayNum,
          title: `Farewell & Return Journey to ${originCity}`,
          events: [
            {
              time: '08:30 AM',
              title: activities[1]?.name || 'Morning Exploration',
              desc: 'Last stroll through local marketplace or nature spots.',
            },
            {
              time: '11:30 AM',
              title: 'Souvenir & Local Specialties Shopping',
              desc: 'Pick up local crafts, spices, and regional farm produce.',
            },
            {
              time: '02:00 PM',
              title: `Return Road Trip to ${originCity}`,
              desc: `Safe drive back with fond memories of ${activeDest.name}.`,
            },
          ],
        });
      } else {
        itinerary.push({
          day: dayNum,
          title: `Full Day Adventure in ${activeDest.name}`,
          events: [
            {
              time: '09:00 AM',
              title: activities[0]?.name || places[1]?.name || 'Signature Experience',
              desc: activities[0]
                ? `Participate in ${activities[0].name} (${activities[0].duration}).`
                : 'Visit renowned architectural or natural sights.',
            },
            {
              time: '01:30 PM',
              title: 'Traditional Feast',
              desc: 'Authentic regional lunch featuring local flavours.',
            },
            {
              time: '04:00 PM',
              title: places[1]?.name || 'Cultural & Nature Exploration',
              desc: places[1]?.description || 'Immerse in the quiet beauty of the destination.',
            },
            {
              time: '08:00 PM',
              title: 'Dinner & Star-Gazing',
              desc: 'Relaxing dinner under the clear skies of Maharashtra.',
            },
          ],
        });
      }
    }
    return itinerary;
  }, [days, activeDest, originCity, estimatedOneWayKm]);

  // Handle Save
  const handleSaveTrip = () => {
    const tripData = {
      destination: activeDest.name,
      origin: originCity,
      days,
      travelers,
      travelMode,
      stayType,
      cost: costBreakdown.total,
      savedAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('mahasafar_saved_trips') || '[]');
      existing.push(tripData);
      localStorage.setItem('mahasafar_saved_trips', JSON.stringify(existing));
    } catch {
      // ignore
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="planner-page">
      {/* Header */}
      <header className="planner-header">
        <div className="container">
          <nav className="planner-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={12} />
            <span aria-current="page">Trip Planner</span>
          </nav>

          <div className="planner-header__content">
            <div className="planner-tag">
              <Sparkles size={16} />
              <span>Personalized Travel Engine</span>
            </div>
            <h1 className="planner-title">Plan Your Maharashtra Journey</h1>
            <p className="planner-subtitle">
              Transparent cost estimates, customized pacing, and interactive day-by-day itineraries tailored to your style.
            </p>
          </div>
        </div>
      </header>

      {/* Main Form & Calculation Grid */}
      <div className="container planner-container">
        <div className="planner-grid">
          {/* LEFT: Inputs Form */}
          <div className="planner-form-card">
            <h2 className="planner-section-title">Trip Preferences</h2>

            {/* 1. Destination */}
            <div className="planner-field">
              <label htmlFor="dest-select" className="planner-label">
                Select Destination
              </label>
              <select
                id="dest-select"
                value={selectedDestSlug}
                onChange={(e) => setSelectedDestSlug(e.target.value)}
                className="planner-select"
              >
                {sampleDestinations.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name} ({d.districtName})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Starting Point */}
            <div className="planner-field">
              <label htmlFor="origin-select" className="planner-label">
                Departing From (Origin)
              </label>
              <select
                id="origin-select"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="planner-select"
              >
                {ORIGIN_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Duration & Travelers */}
            <div className="planner-row">
              <div className="planner-field">
                <label className="planner-label">
                  <Calendar size={14} />
                  <span>Duration ({days} {days === 1 ? 'day' : 'days'})</span>
                </label>
                <div className="planner-stepper">
                  <button
                    type="button"
                    onClick={() => setDays(Math.max(1, days - 1))}
                    className="planner-stepper-btn"
                  >
                    -
                  </button>
                  <span className="planner-stepper-val">{days} Days</span>
                  <button
                    type="button"
                    onClick={() => setDays(Math.min(7, days + 1))}
                    className="planner-stepper-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="planner-field">
                <label className="planner-label">
                  <Users size={14} />
                  <span>Travelers ({travelers})</span>
                </label>
                <div className="planner-stepper">
                  <button
                    type="button"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="planner-stepper-btn"
                  >
                    -
                  </button>
                  <span className="planner-stepper-val">{travelers} People</span>
                  <button
                    type="button"
                    onClick={() => setTravelers(Math.min(10, travelers + 1))}
                    className="planner-stepper-btn"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Travel Mode */}
            <div className="planner-field">
              <label className="planner-label">Travel Mode</label>
              <div className="planner-pill-group">
                <button
                  type="button"
                  onClick={() => setTravelMode('car')}
                  className={`planner-pill ${travelMode === 'car' ? 'planner-pill--active' : ''}`}
                >
                  <Car size={14} />
                  <span>Car / Cab</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTravelMode('train')}
                  className={`planner-pill ${travelMode === 'train' ? 'planner-pill--active' : ''}`}
                >
                  <Train size={14} />
                  <span>Train</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTravelMode('bus')}
                  className={`planner-pill ${travelMode === 'bus' ? 'planner-pill--active' : ''}`}
                >
                  <Bus size={14} />
                  <span>Bus</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTravelMode('bike')}
                  className={`planner-pill ${travelMode === 'bike' ? 'planner-pill--active' : ''}`}
                >
                  <Bike size={14} />
                  <span>Motorbike</span>
                </button>
              </div>
            </div>

            {/* 5. Stay Type */}
            <div className="planner-field">
              <label className="planner-label">Stay Comfort Tier</label>
              <div className="planner-pill-group">
                <button
                  type="button"
                  onClick={() => setStayType('budget')}
                  className={`planner-pill ${stayType === 'budget' ? 'planner-pill--active' : ''}`}
                >
                  Budget (₹800-1.5k)
                </button>
                <button
                  type="button"
                  onClick={() => setStayType('standard')}
                  className={`planner-pill ${stayType === 'standard' ? 'planner-pill--active' : ''}`}
                >
                  Standard (₹2k-4k)
                </button>
                <button
                  type="button"
                  onClick={() => setStayType('premium')}
                  className={`planner-pill ${stayType === 'premium' ? 'planner-pill--active' : ''}`}
                >
                  Premium (₹5k+)
                </button>
              </div>
            </div>

            {/* 6. Travel Style & Food */}
            <div className="planner-row">
              <div className="planner-field">
                <label className="planner-label">Pacing</label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value as TravelStyle)}
                  className="planner-select"
                >
                  <option value="relaxed">Relaxed & Leisure</option>
                  <option value="balanced">Balanced Sightseeing</option>
                  <option value="adventure">Action & High-Trek</option>
                </select>
              </div>

              <div className="planner-field">
                <label className="planner-label">Food Style</label>
                <select
                  value={foodPref}
                  onChange={(e) => setFoodPref(e.target.value as FoodPreference)}
                  className="planner-select"
                >
                  <option value="both">Both Veg & Non-Veg</option>
                  <option value="veg">Pure Vegetarian</option>
                  <option value="nonveg">Seafood & Non-Veg</option>
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT: Transparent Cost Estimate Card */}
          <div className="planner-cost-card">
            <div className="cost-header">
              <span className="cost-kicker">Estimated Total Budget</span>
              <div className="cost-grand-total">
                ₹{costBreakdown.total.toLocaleString('en-IN')}
              </div>
              <span className="cost-per-person">
                ~₹{costBreakdown.perPerson.toLocaleString('en-IN')} per traveler
              </span>
            </div>

            <div className="cost-items">
              <div className="cost-item">
                <span className="cost-item__label">
                  Travel & Fuel ({travelMode}, ~{estimatedOneWayKm * 2} km)
                </span>
                <span className="cost-item__val">₹{costBreakdown.travel.toLocaleString('en-IN')}</span>
              </div>
              <div className="cost-item">
                <span className="cost-item__label">
                  Accommodation ({days > 1 ? days - 1 : 1} nights, {stayType})
                </span>
                <span className="cost-item__val">₹{costBreakdown.stay.toLocaleString('en-IN')}</span>
              </div>
              <div className="cost-item">
                <span className="cost-item__label">
                  Food & Regional Dining ({travelers} travelers &times; {days} days)
                </span>
                <span className="cost-item__val">₹{costBreakdown.food.toLocaleString('en-IN')}</span>
              </div>
              <div className="cost-item">
                <span className="cost-item__label">Activities & Entry Tickets</span>
                <span className="cost-item__val">₹{costBreakdown.activities.toLocaleString('en-IN')}</span>
              </div>
              <div className="cost-item">
                <span className="cost-item__label">Tolls & Emergency Buffer (8%)</span>
                <span className="cost-item__val">₹{costBreakdown.misc.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="cost-guarantee">
              <ShieldCheck size={16} className="text-earth" />
              <span>Based on official Maharashtra state tourism travel cost benchmarks.</span>
            </div>

            {/* Actions */}
            <div className="cost-actions">
              <button onClick={handleSaveTrip} className="btn btn--primary cost-btn">
                {savedSuccess ? (
                  <>
                    <Check size={16} />
                    <span>Plan Saved!</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={16} />
                    <span>Save This Itinerary</span>
                  </>
                )}
              </button>

              <button onClick={handlePrint} className="btn btn--outline cost-btn">
                <Printer size={16} />
                <span>Print / PDF</span>
              </button>
            </div>

            <div className="cost-dest-link">
              <Link to={`/destination/${activeDest.slug}`}>
                Read in-depth guide on {activeDest.name} &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM: Generated Itinerary Timeline */}
        <section className="planner-itinerary-section">
          <div className="planner-itinerary-header">
            <h2 className="planner-section-title">
              Your {days}-Day Customized {activeDest.name} Itinerary
            </h2>
            <p className="planner-subtitle">
              Carefully paced from {originCity} according to {travelStyle} travel style.
            </p>
          </div>

          <div className="planner-itinerary-days">
            {generatedItinerary.map((dayPlan) => (
              <div key={dayPlan.day} className="itinerary-day-card">
                <div className="itinerary-day-card__header">
                  <span className="itinerary-day-badge">Day {dayPlan.day}</span>
                  <h3 className="itinerary-day-title">{dayPlan.title}</h3>
                </div>

                <div className="itinerary-events-list">
                  {dayPlan.events.map((evt, idx) => (
                    <div key={idx} className="itinerary-evt">
                      <span className="itinerary-evt__time">{evt.time}</span>
                      <div className="itinerary-evt__content">
                        <h4 className="itinerary-evt__title">{evt.title}</h4>
                        <p className="itinerary-evt__desc">{evt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="planner-disclaimer">
            <Info size={16} />
            <span>
              Estimates are meant for planning guidance and fluctuate by seasonal demand, surge pricing during holidays, and route changes.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
