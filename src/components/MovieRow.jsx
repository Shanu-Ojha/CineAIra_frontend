import React, { useRef, useState, useEffect } from 'react'
import MovieCard from './MovieCard'

const MovieRow = ({ title, movies, onMovieClick }) => {

  const rowRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const filteredMovies = (movies || [])
    .filter((movie) => movie.poster_path)
    .slice(0, 20)

  useEffect(() => {
    checkArrows()
    const handleResize = () => checkArrows()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [filteredMovies])

  const checkArrows = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction) => {
    if (!rowRef.current) return

    const scrollAmount = rowRef.current.clientWidth * 0.8
    const targetScroll =
      direction === 'left'
        ? rowRef.current.scrollLeft - scrollAmount
        : rowRef.current.scrollLeft + scrollAmount

    rowRef.current.scrollLeft = targetScroll
    setTimeout(checkArrows, 0)
  }

  const handleScroll = () => checkArrows()

  if (filteredMovies.length === 0) return null

  return (
    <div className="relative group px-3 md:px-12 py-4 md:py-6">
      {/* Section Title */}
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
        {title}
      </h2>

      <div className="relative">

        {/* Left Arrow (visible on all devices) */}
        <button
          onClick={() => scroll('left')}
          className={`
            absolute left-0 top-0 bottom-0 z-20 w-10 md:w-16
            bg-black/60 hover:bg-black/80 text-white 
            flex items-center justify-center
            transition-all duration-300
            ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          aria-label="Scroll left"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Scrollable Row */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="
            flex 
            gap-3 md:gap-5
            overflow-x-scroll 
            scrollbar-hide 
            scroll-smooth 
            pb-4
          "
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="
                flex-shrink-0 
                w-28 sm:w-32 md:w-48 lg:w-56
                transition-transform duration-300
                md:hover:scale-105
              "
            >
              <MovieCard movie={movie} onClick={onMovieClick} />
            </div>
          ))}
        </div>

        {/* Right Arrow (visible on all devices) */}
        <button
          onClick={() => scroll('right')}
          className={`
            absolute right-0 top-0 bottom-0 z-20 w-10 md:w-16
            bg-black/60 hover:bg-black/80 text-white 
            flex items-center justify-center
            transition-all duration-300
            ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          aria-label="Scroll right"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

      </div>
    </div>
  )
}

export default MovieRow
