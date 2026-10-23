import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Users,
  Calendar,
  Car,
  Clock3,
  Train,
  Bus,
  Bike,
  Check,
  Bookmark,
  Backpack,
  ChevronRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { sampleDestinations } from '../data/destinations';
import { decodeTrip, buildShareUrl, type ShareableTripInput } from '../lib/tripShare';
import TripPrintView from '../components/trip/TripPrintView';
import TripShareActions from '../components/trip/TripShareActions';
import type {
  ItineraryDay,
  TravelMode,
  StayType,
  TravelStyle,
  FoodPreference,
} from '../types';
import './TripPlannerPage.css';

const AVERAGE_SPEED_KMH: Record<TravelMode, number> = {
  car: 50,
  bus: 40,
  train: 60,
  bike: 45,
};

const ORIGIN_CITIES = [
  { name: 'Pune', distPune: 0, distMumbai: 150, coordinates: [73.8567, 18.5204] as [number, number] },
  { name: 'Mumbai', distPune: 150, distMumbai: 0, coordinates: [72.8777, 19.076] as [number, number] },
  { name: 'Nashik', distPune: 210, distMumbai: 165, coordinates: [73.7898, 19.9975] as [number, number] },
  { name: 'Chhatrapati Sambhajinagar', distPune: 235, distMumbai: 350, coordinates: [75.3433, 19.8762] as [number, number] },
  { name: 'Nagpur', distPune: 720, distMumbai: 800, coordinates: [79.0882, 21.1458] as [number, number] },
  { name: 'Kolhapur', distPune: 230, distMumbai: 390, coordinates: [74.2433, 16.705] as [number, number] },
];

const TRAIN_ALLOWANCE_BANDS = [
  { maxStraightLineKm: 150, allowancePerTraveler: 400, label: 'up to 150 km' },
  { maxStraightLineKm: 300, allowancePerTraveler: 700, label: '151–300 km' },
  { maxStraightLineKm: 600, allowancePerTraveler: 1200, label: '301–600 km' },
  { maxStraightLineKm: Infinity, allowancePerTraveler: 1800, label: 'over 600 km' },
];

function calculateStraightLineKm(
  origin: [number, number],
  destination: [number, number]
) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const [originLongitude, originLatitude] = origin;
  const [destinationLongitude, destinationLatitude] = destination;
  const latitudeDifference = toRadians(destinationLatitude - originLatitude);
  const longitudeDifference = toRadians(destinationLongitude - originLongitude);
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(originLatitude)) *
      Math.cos(toRadians(destinationLatitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function calculateRoadDetourFactor() {
  const pune = ORIGIN_CITIES.find((city) => city.name === 'Pune');
  const mumbai = ORIGIN_CITIES.find((city) => city.name === 'Mumbai');
  if (!pune || !mumbai) return 1;

  const ratios = sampleDestinations.flatMap((destination) => {
    const candidates = [
      { distance: destination.distanceFromPune, origin: pune },
      { distance: destination.distanceFromMumbai, origin: mumbai },
    ];

    return candidates.flatMap(({ distance, origin }) => {
      if (!Number.isFinite(distance) || distance <= 0) return [];
      const straightLineKm = calculateStraightLineKm(origin.coordinates, destination.location.coordinates);
      return straightLineKm > 0 ? [distance / straightLineKm] : [];
    });
  }).sort((a, b) => a - b);

  if (ratios.length === 0) return 1;
  const middle = Math.floor(ratios.length / 2);
  return ratios.length % 2 === 0
    ? (ratios[middle - 1] + ratios[middle]) / 2
    : ratios[middle];
}

const ROAD_DETOUR_FACTOR = calculateRoadDetourFactor();

export default function TripPlannerPage() {
  const { destinationSlug } = useParams<{ destinationSlug?: string }>();
  const [searchParams] = useSearchParams();
  const sharedTrip = useMemo(() => decodeTrip(searchParams.get('trip')), [searchParams]);

  // State
  const [selectedDestSlug, setSelectedDestSlug] = useState<string>(
    destinationSlug || sampleDestinations[0].slug
  );

  useEffect(() => {
    if (destinationSlug) {
      setSelectedDestSlug(destinationSlug);
    }
  }, [destinationSlug]);
  const [originCity, setOriginCity] = useState('Pune');
  const [departureTime, setDepartureTime] = useState('07:00');
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(2);
  const [travelMode, setTravelMode] = useState<TravelMode>('car');
  const [stayType, setStayType] = useState<StayType>('standard');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('balanced');
  const [foodPref, setFoodPref] = useState<FoodPreference>('both');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!sharedTrip) return;
    setSelectedDestSlug(sharedTrip.destination);
    setOriginCity(sharedTrip.origin.name);
    setDepartureTime(sharedTrip.departureTime);
    setTravelers(sharedTrip.people);
    setDays(sharedTrip.days);
    setTravelMode(sharedTrip.travelMode);
    setStayType(sharedTrip.stayType);
    setTravelStyle(sharedTrip.travelStyle);
    setFoodPref(sharedTrip.foodPreference);
  }, [sharedTrip]);

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

  const budgetTravelEstimate = useMemo(() => {
    const origin = ORIGIN_CITIES.find((city) => city.name === originCity);
    if (!origin) {
      return {
        source: 'rough-road' as const,
        oneWayKm: estimatedOneWayKm,
        roundTripKm: estimatedOneWayKm * 2,
        label: 'Approximate road distance',
      };
    }

    const straightLineKm = calculateStraightLineKm(origin.coordinates, activeDest.location.coordinates);
    const storedRoadDistance = originCity === 'Mumbai'
      ? activeDest.distanceFromMumbai
      : originCity === 'Pune'
        ? activeDest.distanceFromPune
        : undefined;
    const hasStoredRoadDistance = storedRoadDistance !== undefined &&
      Number.isFinite(storedRoadDistance) &&
      storedRoadDistance > 0;
    const roadDistance = hasStoredRoadDistance
      ? storedRoadDistance
      : Math.round(straightLineKm * ROAD_DETOUR_FACTOR);

    if (travelMode === 'train') {
      const storedRailDistance = activeDest.railDistancesByOrigin?.[originCity];
      if (storedRailDistance !== undefined && Number.isFinite(storedRailDistance) && storedRailDistance > 0) {
        return {
          source: 'stored-rail' as const,
          oneWayKm: storedRailDistance,
          roundTripKm: storedRailDistance * 2,
          label: 'Stored rail distance estimate',
        };
      }

      const allowanceBand = TRAIN_ALLOWANCE_BANDS.find((band) => straightLineKm <= band.maxStraightLineKm);
      const band = allowanceBand ?? TRAIN_ALLOWANCE_BANDS[TRAIN_ALLOWANCE_BANDS.length - 1];
      return {
        source: 'rough-train' as const,
        oneWayKm: straightLineKm,
        roundTripKm: straightLineKm * 2,
        allowancePerTraveler: band.allowancePerTraveler,
        label: `Rough train allowance (${band.label})`,
      };
    }

    return {
      source: hasStoredRoadDistance ? 'stored-road' as const : 'rough-road' as const,
      oneWayKm: roadDistance,
      roundTripKm: roadDistance * 2,
      label: hasStoredRoadDistance ? 'Stored distance estimate' : 'Approximate road distance',
    };
  }, [originCity, activeDest, travelMode, estimatedOneWayKm]);

  // Transparent Cost Calculations (Maharashtra research baseline)
  const costBreakdown = useMemo(() => {
    // 1. Travel calculation
    let travelRatePerKm = 10; // car
    if (travelMode === 'bike') travelRatePerKm = 4;
    if (travelMode === 'train') travelRatePerKm = 2.5;
    if (travelMode === 'bus') travelRatePerKm = 3.2;

    const travelTotal = travelMode === 'train' && budgetTravelEstimate.source === 'rough-train'
      ? budgetTravelEstimate.allowancePerTraveler * travelers
      : Math.round(
        budgetTravelEstimate.roundTripKm *
        travelRatePerKm *
        (travelMode === 'train' || travelMode === 'bus' ? travelers : 1)
      );

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
  }, [budgetTravelEstimate, travelMode, travelers, stayType, days, foodPref, activeDest]);

  // These are rough planning estimates, not live route or transit times.
  const estimatedTravelMinutes = useMemo(() => {
    const stopBufferHours = travelMode === 'train' ? 0.25 : 0.5;
    const hours = estimatedOneWayKm / AVERAGE_SPEED_KMH[travelMode] + stopBufferHours;
    return Math.ceil((hours * 60) / 15) * 15;
  }, [estimatedOneWayKm, travelMode]);

  const formatItineraryTime = (minutes: number) => {
    const dayOffset = Math.floor(minutes / (24 * 60));
    const timeInDay = minutes % (24 * 60);
    const hour = Math.floor(timeInDay / 60);
    const minute = timeInDay % 60;
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const formatted = `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`;
    return dayOffset > 0 ? `${formatted} (+${dayOffset} day)` : formatted;
  };

  const [departureHour24, departureMinuteValue] = departureTime.split(':').map(Number);
  const departureHour12 = departureHour24 % 12 || 12;
  const departurePeriod = departureHour24 >= 12 ? 'PM' : 'AM';

  const updateDepartureTime = (hour: number, minute: number, period: 'AM' | 'PM') => {
    const hour24 = (hour % 12) + (period === 'PM' ? 12 : 0);
    setDepartureTime(`${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  };

  // Day one is scheduled from the selected departure; later days keep their usual times.
  const generatedItinerary = useMemo(() => {
    const itinerary: ItineraryDay[] = [];
    const places = activeDest.topPlaces || [];
    const activities = activeDest.activities || [];
    const [departureHour, departureMinute] = departureTime.split(':').map(Number);
    const departureMinutes = departureHour * 60 + departureMinute;
    const arrivalMinutes = departureMinutes + estimatedTravelMinutes;

    for (let dayNum = 1; dayNum <= days; dayNum++) {
      if (dayNum === 1) {
        const events: ItineraryDay['events'] = [
          {
            time: formatItineraryTime(departureMinutes),
            title: `Depart from ${originCity}`,
            description: `Estimated journey of about ${Math.round(estimatedTravelMinutes / 60)} hours by ${travelMode}.`,
            type: 'travel',
          },
          {
            time: formatItineraryTime(arrivalMinutes),
            title: `Arrive & Check-in in ${activeDest.name}`,
            description: 'Settle into your accommodation and take a short rest.',
            type: 'rest',
          },
        ];

        const lunchMinutes = Math.max(12 * 60 + 30, arrivalMinutes + 30);
        const hasLunchWindow = arrivalMinutes <= 14 * 60 && lunchMinutes <= 14 * 60;
        if (hasLunchWindow) {
          events.push({
            time: formatItineraryTime(lunchMinutes),
            title: 'Regional Lunch',
            description: `Enjoy local specialities (${activeDest.foodAndCulture?.specialities?.slice(0, 2).join(', ') || 'local thali'}).`,
            type: 'food',
          });
        }

        const timeAfterArrival = hasLunchWindow ? lunchMinutes + 90 : arrivalMinutes + 60;
        const sightseeingMinutes = Math.max(15 * 60 + 30, timeAfterArrival);
        if (sightseeingMinutes <= 17 * 60) {
          events.push({
            time: formatItineraryTime(sightseeingMinutes),
            title: places[0]?.name || 'Local Sightseeing',
            description: places[0]?.description || 'Explore historic viewpoints and natural surroundings.',
            type: 'sightseeing',
          });
        }

        if (arrivalMinutes <= 17 * 60 + 30) {
          const lastEventMinutes = sightseeingMinutes <= 17 * 60
            ? sightseeingMinutes + 90
            : 19 * 60;
          const eveningMinutes = Math.max(19 * 60, lastEventMinutes);
          if (eveningMinutes <= 20 * 60 + 30) {
            events.push({
              time: formatItineraryTime(eveningMinutes),
              title: 'Evening Leisure & Dinner',
              description: 'Enjoy a relaxed evening and dinner at a local dining spot.',
              type: 'food',
            });
          }
        }

        itinerary.push({
          day: 1,
          title: `Departure & Arrival in ${activeDest.name}`,
          events,
        });
      } else if (dayNum === days) {
        itinerary.push({
          day: dayNum,
          title: `Farewell & Return Journey to ${originCity}`,
          events: [
            {
              time: '08:30 AM',
              title: activities[1]?.name || 'Morning Exploration',
              description: 'Last stroll through local marketplace or nature spots.',
              type: 'activity',
            },
            {
              time: '11:30 AM',
              title: 'Souvenir & Local Specialties Shopping',
              description: 'Pick up local crafts, spices, and regional farm produce.',
              type: 'activity',
            },
            {
              time: '02:00 PM',
              title: `Return Road Trip to ${originCity}`,
              description: `Safe drive back with fond memories of ${activeDest.name}.`,
              type: 'travel',
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
              description: activities[0]
                ? `Participate in ${activities[0].name} (${activities[0].duration}).`
                : 'Visit renowned architectural or natural sights.',
              type: 'activity',
            },
            {
              time: '01:30 PM',
              title: 'Traditional Feast',
              description: 'Authentic regional lunch featuring local flavours.',
              type: 'food',
            },
            {
              time: '04:00 PM',
              title: places[1]?.name || 'Cultural & Nature Exploration',
              description: places[1]?.description || 'Immerse in the quiet beauty of the destination.',
              type: 'sightseeing',
            },
            {
              time: '08:00 PM',
              title: 'Dinner & Star-Gazing',
              description: 'Relaxing dinner under the clear skies of Maharashtra.',
              type: 'food',
            },
          ],
        });
      }
    }
    return itinerary;
  }, [days, activeDest, originCity, departureTime, estimatedTravelMinutes, travelMode]);

  // Handle Save
  const handleSaveTrip = () => {
    const tripData = {
      destination: activeDest.name,
      destinationSlug: activeDest.slug,
      origin: originCity,
      days,
      travelers,
      travelMode,
      stayType,
      travelStyle,
      foodPref,
      departureTime,
      itinerary: generatedItinerary,
      cost: costBreakdown.total,
      costBreakdown: {
        travel: costBreakdown.travel,
        stay: costBreakdown.stay,
        food: costBreakdown.food,
        activities: costBreakdown.activities,
        misc: costBreakdown.misc,
      },
      savedAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('mahasafar_saved_trips') || '[]');
      if (!Array.isArray(existing)) {
        throw new Error('Saved trips data is not a list.');
      }
      existing.push(tripData);
      localStorage.setItem('mahasafar_saved_trips', JSON.stringify(existing));
      setSaveError('');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save trip', error);
      setSaveError('Could not save this trip in your browser. Please try again.');
      setSavedSuccess(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const shareInput: ShareableTripInput = {
    destination: activeDest.slug,
    origin: {
      name: originCity,
      coordinates: ORIGIN_CITIES.find((city) => city.name === originCity)?.coordinates ?? ORIGIN_CITIES[0].coordinates,
    },
    departureTime,
    people: travelers,
    days,
    travelMode,
    stayType,
    travelStyle,
    foodPreference: foodPref,
  };
  const shareUrl = buildShareUrl(shareInput);

  const isRoughBudget = budgetTravelEstimate.source === 'rough-road' ||
    budgetTravelEstimate.source === 'rough-train';

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
              <Backpack size={16} />
              <span>Trip planner</span>
            </div>
            <h1 className="planner-title">Plan your trip</h1>
            <p className="planner-subtitle">
              Tell us where you're headed and how you like to travel. You'll get honest cost estimates and a day-by-day plan to start from.
            </p>
            {sharedTrip && <p className="planner-shared-banner" role="status">Shared trip loaded — customize this trip to make it your own.</p>}
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

            <div className="planner-field">
              <label htmlFor="departure-hour" className="planner-label">
                <span>Departure Time</span>
              </label>
              <div className="departure-time-control">
                <div className="departure-time-control__icon" aria-hidden="true">
                  <Clock3 size={20} />
                </div>
                <div className="departure-time-control__inputs">
                  <div className="departure-time-control__part">
                    <label htmlFor="departure-hour">Hour</label>
                    <select
                      id="departure-hour"
                      value={departureHour12}
                      onChange={(event) =>
                        updateDepartureTime(Number(event.target.value), departureMinuteValue, departurePeriod)
                      }
                      aria-label="Departure hour"
                    >
                      {Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => (
                        <option key={hour} value={hour}>{String(hour).padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  <span className="departure-time-control__separator" aria-hidden="true">:</span>
                  <div className="departure-time-control__part">
                    <label htmlFor="departure-minute">Minute</label>
                    <select
                      id="departure-minute"
                      value={departureMinuteValue}
                      onChange={(event) =>
                        updateDepartureTime(departureHour12, Number(event.target.value), departurePeriod)
                      }
                      aria-label="Departure minute"
                    >
                      {Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, '0')).map((minute) => (
                        <option key={minute} value={minute}>{minute}</option>
                      ))}
                    </select>
                  </div>
                  <div className="departure-time-control__part departure-time-control__part--period">
                    <label htmlFor="departure-period">Period</label>
                    <select
                      id="departure-period"
                      value={departurePeriod}
                      onChange={(event) =>
                        updateDepartureTime(
                          departureHour12,
                          departureMinuteValue,
                          event.target.value === 'PM' ? 'PM' : 'AM'
                        )
                      }
                      aria-label="AM or PM"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
              <p className="planner-field-hint">
                Day one is planned around your chosen time and estimated travel duration.
              </p>
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
              <span className="cost-kicker">
                {isRoughBudget ? 'Rough Budget Estimate' : 'Estimated Total Budget'}
              </span>
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
                  {travelMode === 'train'
                    ? `${budgetTravelEstimate.label}${budgetTravelEstimate.source === 'rough-train' ? `, ₹${budgetTravelEstimate.allowancePerTraveler} per traveler × ${travelers}` : `, ~${Math.round(budgetTravelEstimate.roundTripKm)} km round trip`}`
                    : `Travel & Fuel (${travelMode}, ${budgetTravelEstimate.label.toLowerCase()} from ${originCity}, ~${Math.round(budgetTravelEstimate.roundTripKm)} km round trip)`}
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
              <span>
                {budgetTravelEstimate.source === 'rough-train'
                  ? `${budgetTravelEstimate.label} per traveler, based on straight-line distance (not rail distance); actual fares vary by train and class.`
                  : isRoughBudget
                    ? 'Travel distance and costs are approximate, not live route or fare information.'
                    : 'Travel cost uses the stored distance estimate; fares can vary by route and service.'}
              </span>
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
              {saveError && <p className="planner-save-error" role="alert">{saveError}</p>}

              <TripShareActions input={shareInput} destinationName={activeDest.name} total={costBreakdown.total} onPrint={handlePrint} />
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
              Carefully paced from {originCity} according to {travelStyle} travel style. Day one starts at {formatItineraryTime(
                Number(departureTime.split(':')[0]) * 60 + Number(departureTime.split(':')[1])
              )}; travel times are approximate.
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
                        <p className="itinerary-evt__desc">{evt.description}</p>
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
        <TripPrintView
          destination={activeDest.name}
          origin={originCity}
          departureTime={departureTime}
          travelers={travelers}
          days={days}
          travelMode={travelMode}
          stayType={stayType}
          costs={costBreakdown}
          itinerary={generatedItinerary}
          shareUrl={shareUrl}
        />
      </div>
    </div>
  );
}
