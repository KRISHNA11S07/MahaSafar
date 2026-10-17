import { useEffect, useState } from 'react';
import HeroSection from '../sections/home/HeroSection';
import MaharashtraJourney from '../sections/home/MaharashtraJourney';
import CategoryExplorer from '../sections/home/CategoryExplorer';
import HiddenMaharashtra from '../sections/home/HiddenMaharashtra';
import ExploreNearMe from '../sections/home/ExploreNearMe';
import type { LiveLocation } from '../types';
import './HomePage.css';

// React Strict Mode intentionally re-runs effects in development. Keep the native
// request to one attempt per page load so it never produces duplicate prompts.
let hasRequestedHomeLocation = false;

export default function HomePage() {
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);

  useEffect(() => {
    if (hasRequestedHomeLocation || !navigator.geolocation) return;
    hasRequestedHomeLocation = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLiveLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      () => {
        // A denial or device error is intentionally non-blocking.
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, []);

  return (
    <div className="home-page">
      <HeroSection />
      <MaharashtraJourney />
      <CategoryExplorer />
      <HiddenMaharashtra />
      <ExploreNearMe liveLocation={liveLocation} />
    </div>
  );
}
