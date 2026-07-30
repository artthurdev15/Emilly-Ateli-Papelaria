import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryCarousel />
      <FeaturedProducts />
    </>
  );
}
