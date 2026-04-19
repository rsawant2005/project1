"use client"

import { useState, useEffect } from "react"

const SWEETS_IMAGES = [
  {
    src: "/sweets-carousel-1.jpg",
    alt: "Assorted Indian sweets and mithai",
  },
  {
    src: "https://www.shutterstock.com/image-photo/three-chocolates-cake-chocolate-drips-600nw-1921040348.jpg",
    alt: "Colorful traditional sweets collection",
  },
  {
    src: "https://t4.ftcdn.net/jpg/02/08/38/95/360_F_208389537_XYn1ukJfse2kVLxJYJpiBcjEkAHrWfBt.jpg",
    alt: "Premium sweets hamper display",
  },
  {
    src: "https://media.gettyimages.com/id/592620184/video/close-up-of-gulabjamuns-in-the-bowl.jpg?s=640x640&k=20&c=0zkcOyTpdMZPoINLbn5JCUPNkRAN196D9pBbNomkjHk=",
    alt: "Delicious Indian desserts and treats",
  },
]

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SWEETS_IMAGES.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Carousel Images */}
      <div className="relative w-full h-full">
        {SWEETS_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-amber-900/50 to-transparent"></div>
      </div>
    </div>
  )
}
