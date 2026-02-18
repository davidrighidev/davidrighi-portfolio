import QuoteSection from "./components/QuoteSection";
import HeroSection from "./components/HeroSection";
import Showreel from "./components/Showreel";
import WorkCards from "./components/WorkCards";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Showreel />

      <QuoteSection />
      <WorkCards />
    </>
  );
}
