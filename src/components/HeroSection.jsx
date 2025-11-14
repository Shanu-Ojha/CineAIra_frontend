import React, { useState, useEffect } from 'react'

const HeroSection = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentMovie =
    movies && movies.length > 0 && movies[currentIndex]
      ? movies[currentIndex]
      : null

  useEffect(() => {
    setCurrentIndex(0)
  }, [movies])

  const handleNext = () => {
    if (!movies || movies.length < 2) return
    setCurrentIndex((currentIndex + 1) % movies.length)
  }

  const handlePrev = () => {
    if (!movies || movies.length < 2) return
    setCurrentIndex(currentIndex === 0 ? movies.length - 1 : currentIndex - 1)
  }

  const handleDotClick = (index) => {
    if (!movies || index === currentIndex) return
    setCurrentIndex(index)
  }

  if (!movies || movies.length === 0 || !currentMovie) return null

  const backdropUrl = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : 'https://via.placeholder.com/1920x1080/000000/FFFFFF?text=No+Image'

  return (
    <div className="relative w-full h-[55vh] sm:h-[70vh] md:h-[80vh] min-h-[350px] overflow-hidden flex items-center">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-xl px-4 sm:px-8 md:px-16 space-y-3 sm:space-y-5">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white">
          {currentMovie.title || currentMovie.name}
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-white line-clamp-3">
          {currentMovie.overview}
        </p>

        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
          <button className="flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-white text-black font-semibold text-sm sm:text-base rounded hover:bg-white/85">
            <svg width="20" height="20" className="sm:w-5 sm:h-5">
              <path d="M8 5v14l11-7z" fill="black" />
            </svg>
            Play
          </button>

          <button className="flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-gray-600/70 text-white font-semibold text-sm sm:text-base rounded border border-white/50 hover:bg-gray-600/50">
            More Info
          </button>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20
          w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center
          bg-black/50 text-white rounded-full hover:bg-black/80"
      >
        <svg width="20" height="20" className="sm:w-6 sm:h-6" stroke="white">
          <polyline points="15 18 9 12 15 6" fill="none" strokeWidth="2" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20
          w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center
          bg-black/50 text-white rounded-full hover:bg-black/80"
      >
        <svg width="20" height="20" className="sm:w-6 sm:h-6" stroke="white">
          <polyline points="9 18 15 12 9 6" fill="none" strokeWidth="2" />
        </svg>
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-8 flex gap-2 sm:gap-3">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`h-2 sm:h-3 rounded-full transition-all
              ${i === currentIndex ? 'w-6 sm:w-8 bg-white' : 'w-2 sm:w-3 bg-white/50'}
            `}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSection
