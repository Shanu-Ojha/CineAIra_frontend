import React, { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import axios from 'axios'
import MovieRow from '../components/MovieRow'
import HeroSection from '../components/HeroSection'
import MovieModal from '../components/MovieModal'


const Home = () => {
  const [nowPlaying, setNowPlaying] = useState([])
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = 'http://localhost:3001/api/tmdb'

        const [nowPlayingRes, popularRes, topRatedRes, trendingRes] = await Promise.all([
          axios.get(`${baseURL}/nowplaying`),
          axios.get(`${baseURL}/popular`),
          axios.get(`${baseURL}/toprated`),
          axios.get(`${baseURL}/trending`)
        ])

        setNowPlaying(nowPlayingRes.data.results)
        setPopular(popularRes.data.results)
        setTopRated(topRatedRes.data.results)
        setTrending(trendingRes.data.results)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.movie-row',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }
      )
    }
  }, [loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <HeroSection movies={nowPlaying} />

      {/* Movie Rows */}
      <div className="space-y-8 pb-16">
        <MovieRow title="Now Playing" movies={nowPlaying} onMovieClick={setSelectedMovie} />
        <MovieRow title="Trending" movies={trending} onMovieClick={setSelectedMovie} />
        <MovieRow title="Popular" movies={popular} onMovieClick={setSelectedMovie} />
        <MovieRow title="Top Rated" movies={topRated} onMovieClick={setSelectedMovie} />

      </div>
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
    
  )
}

export default Home
