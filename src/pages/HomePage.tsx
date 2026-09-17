import HeroSection from '../sections/home/HeroSection';
import MaharashtraJourney from '../sections/home/MaharashtraJourney';
import CategoryExplorer from '../sections/home/CategoryExplorer';
import HiddenMaharashtra from '../sections/home/HiddenMaharashtra';
import ExploreNearMe from '../sections/home/ExploreNearMe';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <HeroSection />
      <MaharashtraJourney />
      <CategoryExplorer />
      <HiddenMaharashtra />
      <ExploreNearMe />
    </div>
  );
}
