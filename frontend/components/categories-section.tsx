"use client"

const categories = [
  {
    id: 1,
    name: "Premium",
    description: "Exquisite selection of our finest handcrafted sweets",
    image: "https://cdn.igp.com/f_auto,q_auto,t_pnopt19prodlp/products/p-premium-gourmet-sweets-gift-box-151091-m.jpg",
  },
  {
    id: 2,
    name: "Festive Special",
    description: "Celebrate every occasion with our festive collection",
    image: "/festive-sweets-diwali.jpg",
  },
  {
    id: 3,
    name: "Regional Delights",
    description: "Authentic regional sweets from across India",
    image: "/regional-indian-sweets.jpg",
  },
  {
    id: 4,
    name: "Kokan Specials",
    description: "Traditional Kokan region specialties and delicacies",
    image: "https://peekncooksa.blob.core.windows.net/tall-recipe/puran-poli.jpg",
  },
]

export default function CategoriesSection() {
  return (
    <section className="py-20 px-6 md:px-12 bg-amber-50">
      <div className="max-w-7xl mx-auto">
         {/* {Section Header} */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-amber-900 mb-4">Our Collections</h2>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            Explore our curated selection of premium sweets and delicacies
          </p>
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-12 h-1 bg-amber-600"></div>
            <div className="w-8 h-1 bg-amber-400"></div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-lg mb-6 h-64 bg-amber-100">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-2xl font-serif text-amber-900 mb-2 group-hover:text-amber-700 transition-colors">
                  {category.name}
                </h3>
                <p className="text-amber-700 text-sm leading-relaxed">{category.description}</p>
              </div>

              {/* Hover Line */}
              <div className="flex justify-center mt-4">
                <div className="w-0 h-1 bg-amber-600 group-hover:w-12 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
