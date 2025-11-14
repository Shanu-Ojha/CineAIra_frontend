import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import axios from 'axios'
import SearchResults from '../components/SearchResults'
import SkeletonLoader from '../components/SkeletonLoader'

const Search = () => {
  const [searchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState({
    tmdbResults: [],
    recommendations: []
  })
  const [tmdbLoading, setTmdbLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [tmdbError, setTmdbError] = useState(null)
  const [aiError, setAiError] = useState(null)
  const query = searchParams.get('q')

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery) => {
    // Reset states
    setTmdbError(null)
    setAiError(null)
    setSearchResults({ tmdbResults: [], recommendations: [] })
    
    // Start TMDB search immediately
    setTmdbLoading(true)
    try {
      const searchResponse = await axios.get(`http://localhost:3001/api/tmdb/search?query=${encodeURIComponent(searchQuery)}`)
      setSearchResults(prev => ({
        ...prev,
        tmdbResults: searchResponse.data.results || []
      }))
    } catch (error) {
      console.error('TMDB search error:', error)
      setTmdbError('Failed to fetch search results')
    } finally {
      setTmdbLoading(false)
    }

    // Start AI recommendations in parallel
    setAiLoading(true)
    try {
      const recommendResponse = await axios.get(`http://localhost:3001/api/ai/recommend?query=${encodeURIComponent(searchQuery)}`)
      setSearchResults(prev => ({
        ...prev,
        recommendations: recommendResponse.data.recommendations || []
      }))
    } catch (error) {
      console.error('AI recommendations error:', error)
      setAiError('Failed to fetch AI recommendations')
    } finally {
      setAiLoading(false)
    }
  }

  useEffect(() => {
    if (searchResults.tmdbResults?.length > 0) {
      gsap.fromTo('.search-result', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
      )
    }
  }, [searchResults])

  if (!query) {
    return (
      <div className="pt-16 min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Search for Movies & TV Shows</h1>
          <p className="text-gray-400">Enter a movie or TV show name to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Search Results for "{query}"
        </h1>

        <SearchResults 
          results={searchResults} 
          tmdbLoading={tmdbLoading}
          aiLoading={aiLoading}
          tmdbError={tmdbError}
          aiError={aiError}
          onRetry={performSearch}
          query={query}
        />
      </div>
    </div>
  )
}

export default Search
