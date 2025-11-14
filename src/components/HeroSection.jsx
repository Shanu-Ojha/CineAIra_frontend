import React, { useState, useEffect } from 'react'

const HeroSection = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Always determine currentMovie from movies and currentIndex
  const currentMovie =
    movies && Array.isArray(movies) && movies.length > 0 && movies[currentIndex]
      ? movies[currentIndex]
      : null

  // Reset currentIndex if movies list changes/disappears
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

  // Don't render at all if there's no valid data
  if (
    !movies ||
    !Array.isArray(movies) ||
    movies.length === 0 ||
    currentIndex < 0 ||
    currentIndex >= movies.length ||
    !currentMovie
  ) {
    return null
  }

  const backdropUrl = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : 'https://via.placeholder.com/1920x1080/000000/FFFFFF?text=No+Image'

  return (
    <div className="relative w-full h-[80vh] min-h-[500px] overflow-hidden flex items-center">
      {/* Backdrop Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backdropUrl})`,
          transformOrigin: 'center'
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/90 via-black/60 to-black/30" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-2xl px-8 md:px-16 space-y-4 md:space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-[2px_2px_8px_rgba(0,0,0,0.8)]">
          {currentMovie.title ?? currentMovie.name ?? 'Untitled'}
        </h1>

        <p className="text-base md:text-lg text-white leading-relaxed line-clamp-3 drop-shadow-[1px_1px_4px_rgba(0,0,0,0.8)]">
          {currentMovie.overview || 'No description available.'}
        </p>

        <div className="flex flex-wrap gap-3 md:gap-4">
          <button className="flex items-center gap-2 px-6 md:px-8 py-3 bg-white text-black font-semibold text-base md:text-lg rounded hover:bg-white/85 transition-all duration-300 hover:scale-105">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>

          <button className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gray-600/70 text-white font-semibold text-base md:text-lg rounded border border-white/50 hover:bg-gray-600/50 transition-all duration-300 hover:scale-105">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            More Info
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={handlePrev}
        disabled={movies.length <= 1}
        aria-label="Previous movie"
        type="button"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={handleNext}
        disabled={movies.length <= 1}
        aria-label="Next movie"
        type="button"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-6 md:bottom-8 right-8 md:right-16 z-20 flex items-center gap-5">
        <div className="flex gap-2.5">
          {movies &&
            movies.map((_, index) => (
              <button
                type="button"
                key={index}
                className={`h-3 rounded-full transition-all duration-300 hover:bg-white/80 hover:scale-110 ${
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-3 bg-white/50'
                }`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to movie ${index + 1}`}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default HeroSection
