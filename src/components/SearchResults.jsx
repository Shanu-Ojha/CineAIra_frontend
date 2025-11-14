import React, { useState, useEffect, useRef } from 'react'
import MovieCard from './MovieCard'
import SkeletonLoader from './SkeletonLoader'
import MovieModal from './MovieModal'


const SearchResults = ({ results, tmdbLoading, aiLoading, tmdbError, aiError, onRetry, query }) => {
  const { tmdbResults = [], recommendations = [] } = results
  const [sortBy, setSortBy] = useState('default') // 'default', 'rating', 'year'
  const [showScrollTop, setShowScrollTop] = useState(false)
  const resultsRef = useRef(null)
  const tmdbSectionRef = useRef(null)
  const aiSectionRef = useRef(null)
  const [selectedMovie, setSelectedMovie] = useState(null)


  // Filter out movies without posters
  const filterMoviesWithPosters = (movies) => {
    return movies.filter(movie => movie.poster_path)
  }

  // Sort results
  const sortResults = (results) => {
    if (sortBy === 'rating') {
      return [...results].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    }
    if (sortBy === 'year') {
      return [...results].sort((a, b) => {
        const yearA = a.release_date || a.first_air_date || ''
        const yearB = b.release_date || b.first_air_date || ''
        return yearB.localeCompare(yearA)
      })
    }
    return results
  }

  // Apply filtering and sorting - LIMIT TMDB TO 15
  const filteredTmdbResults = filterMoviesWithPosters(tmdbResults).slice(0, 15)
  const filteredRecommendations = filterMoviesWithPosters(recommendations)
  const sortedTmdbResults = sortResults(filteredTmdbResults)
  const sortedRecommendations = sortResults(filteredRecommendations)

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <div ref={resultsRef} className="min-h-screen bg-gray-900 py-8 px-4 md:px-8 lg:px-16">
      {/* Header with Controls */}
      {(sortedTmdbResults.length > 0 || sortedRecommendations.length > 0 || aiLoading) && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Results Count */}
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-1">
                Search Results {query && `for "${query}"`}
              </h2>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="default">Sort: Default</option>
                <option value="rating">Sort: Rating</option>
                <option value="year">Sort: Year</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TMDB Results Section */}
      <div className="max-w-7xl mx-auto mb-12">
        {tmdbLoading ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : tmdbError ? (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold">Error loading results</p>
            </div>
            <p className="text-gray-400 mb-4">{tmdbError}</p>
            <button
              onClick={onRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : sortedTmdbResults.length > 0 ? (
          <div ref={tmdbSectionRef}>
            <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded"></span>
              Search Results ({sortedTmdbResults.length})
            </h3>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {sortedTmdbResults.map((movie) => (
                <div key={movie.id} className="result-card">
                  <MovieCard movie={movie} onClick={setSelectedMovie} />
                </div>
              ))}
              {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
              )}

            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-400 text-lg">No results found</p>
            <p className="text-gray-500 text-sm mt-2">Try searching for a different movie or TV show</p>
          </div>
        )}
      </div>

      {/* AI Recommendations Section - With Skeleton Loading */}
      {(aiLoading || sortedRecommendations.length > 0) && (
        <div className="bg-gradient-to-br from-yellow-900/30 via-amber-900/20 to-orange-900/30 border border-yellow-600/30 rounded-2xl p-6 md:p-8">
          <div className="max-w-7xl mx-auto" ref={aiSectionRef}>
            <h3 className="text-yellow-200 text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full"></span>
              <span className="flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                AI Recommendations
              </span>
            </h3>

            {/* AI is analyzing... */}
            {aiLoading ? (
              <>
                {/* Improved AI Loader */}
                <div className="flex flex-col items-center justify-center mb-8 py-6">
                  {/* Animated Brain/Sparkles Icon */}
                  <div className="relative mb-4">
                    {/* Pulsing Glow Background */}
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />

                    {/* Main Icon */}
                    <div className="relative">
                      <svg
                        className="w-16 h-16 text-yellow-400 animate-bounce"
                        style={{ animationDuration: '1.5s' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>

                      {/* Floating Sparkles */}
                      <div className="absolute -top-1 -right-1">
                        <svg className="w-4 h-4 text-yellow-300 animate-ping" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Fun Loading Text with Typing Effect */}
                  <div className="text-yellow-100 font-semibold text-lg mb-2">
                    AI Brain at Work
                    <span className="inline-flex ml-1">
                      <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                    </span>
                  </div>

                  <p className="text-yellow-200/70 text-sm">Finding movies you'll love!</p>
                </div>

                {/* Skeleton Cards */}
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {[...Array(5)].map((_, i) => (
                    <SkeletonLoader key={i} />
                  ))}
                </div>
              </>
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {sortedRecommendations.map((movie) => (
                  <div key={movie.id} className="result-card">
                    <MovieCard movie={movie} onClick={setSelectedMovie} />
                  </div>
                ))}
                {selectedMovie && (
                  <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* AI Error State */}
      {aiError && !aiLoading && (
        <div className="max-w-7xl mx-auto mt-8">
          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-yellow-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-yellow-400 font-semibold mb-1">AI Recommendations Unavailable</p>
            <p className="text-yellow-300/70 text-sm">Unable to find similar movies at this time</p>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchResults
