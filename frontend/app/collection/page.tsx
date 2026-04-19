"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import CategoriesSection from "@/components/categories-section"

export default function CollectionPage() {
  return (
    <main className="min-h-screen bg-amber-50">
      <Header />
      <br />
      <br />

      {/* Collection Hero Section
      <section className="pt-32 pb-16 px-6 md:px-12 bg-gradient-to-b from-amber-100 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif text-amber-900 mb-4 text-balance">Our Collection</h1>
          <p className="text-amber-800 text-lg max-w-2xl">
            Discover our premium selection of handcrafted sweets and delicacies, carefully curated to bring you the
            finest flavors and traditions.
          </p>
          <div className="mt-6 h-1 w-24 bg-amber-600 rounded-full"></div>
        </div>
      </section> */}

      <CategoriesSection />

      {/* Footer */}
      <Footer />
    </main>
  )
}