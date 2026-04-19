import Image from "next/image"

export default function About() {
  return (
    <main className="min-h-screen bg-amber-50 pt-24">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif text-amber-900 mb-4">About Surbhi Sweet Mart</h1>
          <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
        </div>

        {/* Shop Image */}
        <div className="mb-16">
          <Image
            src="/luxury-bakery-shop-interior-with-sweets-display.jpg"
            alt="Surbhi Sweet Mart Shop"
            width={1000}
            height={500}
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif text-amber-900 mb-6">Our Story</h2>

            <div className="space-y-6 text-amber-900 leading-relaxed">
              <p className="text-lg">
                Surbhi Sweet Mart was founded with a simple yet profound vision: to bring the authentic taste of
                traditional Indian sweets and bakery products to every household. What started as a small family venture
                has blossomed into a beloved destination for premium quality confectioneries and baked goods.
              </p>

              <p className="text-lg">
                Our journey began with a passion for preserving the rich culinary heritage of Indian sweets while
                embracing modern baking techniques. Every product we create is a testament to our commitment to
                excellence, using only the finest ingredients sourced from trusted suppliers.
              </p>

              <p className="text-lg">
                At Surbhi Sweet Mart, we believe that sweets are more than just desserts—they are moments of joy,
                celebrations of life, and expressions of love. Whether it's a traditional barfi, a delicate rasgulla, or
                our signature in-house bakes, each item is crafted with meticulous care and attention to detail.
              </p>

              <p className="text-lg">
                Our team of skilled artisans brings decades of combined experience to every batch we produce. We
                maintain the highest standards of hygiene and quality control, ensuring that every sweet that leaves our
                kitchen is nothing short of perfection.
              </p>

              <p className="text-lg">
                Today, Surbhi Sweet Mart stands as a symbol of trust, quality, and tradition. We are proud to serve our
                community and continue to innovate while honoring the timeless recipes that have been passed down
                through generations.
              </p>
            </div>

            {/* Values Section */}
            <div className="mt-12 pt-8 border-t border-amber-200">
              <h3 className="text-2xl font-serif text-amber-900 mb-8">Our Values</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-serif text-amber-600 mb-3">✓</div>
                  <h4 className="text-xl font-serif text-amber-900 mb-2">Quality</h4>
                  <p className="text-amber-800">
                    We never compromise on the quality of our ingredients or the craftsmanship of our products.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-serif text-amber-600 mb-3">✓</div>
                  <h4 className="text-xl font-serif text-amber-900 mb-2">Tradition</h4>
                  <p className="text-amber-800">
                    We honor time-tested recipes while embracing innovation to delight modern palates.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-serif text-amber-600 mb-3">✓</div>
                  <h4 className="text-xl font-serif text-amber-900 mb-2">Trust</h4>
                  <p className="text-amber-800">Your satisfaction and trust are the foundation of everything we do.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
