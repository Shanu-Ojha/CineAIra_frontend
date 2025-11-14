import React, { useState, useRef } from 'react'
import { gsap } from 'gsap'

const MovieCard = ({ movie, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const cardRef = useRef(null)

  // Skip rendering if no poster available
  if (!movie.poster_path) return null

  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`

  const handleMouseEnter = () => {
    setIsHovered(true)
    gsap.to(cardRef.current, {
      scale: 1.001,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const toggleLike = (e) => {
    e.stopPropagation()
    setIsLiked((prev) => !prev)
  }

  return (
    <div
      ref={cardRef}
      className="flex-shrink-0 w-48 cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick && onClick(movie)}
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <img
          src={posterUrl}
          alt={movie.title || movie.name}
          className="w-full h-72 object-cover transition-transform duration-300"
        />

        {/* Heart Icon */}
        <button
          onClick={toggleLike}
          className="absolute top-2 right-2 z-10 p-1 bg-black/40 rounded-full hover:bg-black/70 transition-colors duration-200"
          aria-label={isLiked ? "Unfavorite movie" : "Favorite movie"}
          tabIndex={0}
        >
          {isLiked ? (
            <svg
              className="w-6 h-6 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656l-6.01 6.011a1 1 0 01-1.414 0l-6.01-6.011a4 4 0 010-5.656z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 20 20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 015.656 5.656l-6.01 6.011a1 1 0 01-1.414 0l-6.01-6.011a4 4 0 010-5.656z"
              />
            </svg>
          )}
        </button>

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
              {movie.title || movie.name}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>
                {movie.release_date?.split('-')[0] ||
                  movie.first_air_date?.split('-')[0] ||
                  'N/A'}
              </span>
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
