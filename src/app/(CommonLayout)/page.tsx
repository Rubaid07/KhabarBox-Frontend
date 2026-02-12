import HeroSection from "@/components/homePage/hero/hero";
import PopularMeals from "@/components/homePage/PopularMeals";
import TrendingCuisines from "@/components/homePage/TrendingCuisines";

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <TrendingCuisines />
      <PopularMeals />
    </div>
  );
}
