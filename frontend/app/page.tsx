import Header from "@/components/header"
import HeroCarousel from "@/components/hero-carousel"
import CategoriesSection from "@/components/categories-section"
import BestSellerSection from "@/components/best-seller-section"
import SnacksSection from "@/components/snacks-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden mt-16">
        <div className="absolute inset-0 -z-10">
          <HeroCarousel />
        </div>

        {/* Left Content - positioned on top of carousel */}
        <div className="w-full lg:w-1/2 px-6 md:px-12 py-12 md:py-0 flex flex-col justify-center relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-amber-50 mb-6 leading-tight">SURBHI</h1>
          <h2 className="text-3xl md:text-4xl font-serif text-amber-200 mb-8 leading-tight">SWEET MART</h2>

          <p className="text-base md:text-lg text-amber-100 mb-12 max-w-md leading-relaxed">
            Indulge in the finest traditional Indian sweets and delicacies, crafted with love and premium ingredients
            for every celebration.
          </p>

          {/* Decorative element */}
          <div className="flex gap-2">
            <div className="w-12 h-1 bg-amber-400"></div>
            <div className="w-8 h-1 bg-amber-600"></div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesSection />

      {/* Best Seller and Snacks sections */}
      <BestSellerSection />
      <SnacksSection />

      {/* Footer Component */}
      <Footer />
    </main>
  )
}
