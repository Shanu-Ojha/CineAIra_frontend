import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogoClick = () => navigate('/')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={handleLogoClick}>
            <h1 className="text-2xl font-bold text-red-600 hover:text-red-500 transition-colors">
              CineAIra
            </h1>
          </div>

          {/* Mobile Search + Hamburger */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Search Input */}
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-full text-white placeholder-gray-400 w-32 focus:outline-none focus:border-red-500"
              />
            </form>

            {/* Hamburger Icon */}
            <button
              className="text-white text-3xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>

          {/* Desktop Search */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies, TV shows..."
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-gray-800/70 transition-all duration-300"
              />
            </form>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => navigate('/')} className="text-gray-300 hover:text-white transition-colors font-medium">Home</button>
            <button className="text-gray-300 hover:text-white transition-colors font-medium">Movies</button>
            <button className="text-gray-300 hover:text-white transition-colors font-medium">TV Shows</button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/90 p-4 space-y-4 rounded-lg mt-2">
            <button onClick={() => navigate('/')} className="block w-full text-left text-gray-300 hover:text-white text-lg">Home</button>
            <button className="block w-full text-left text-gray-300 hover:text-white text-lg">Movies</button>
            <button className="block w-full text-left text-gray-300 hover:text-white text-lg">TV Shows</button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
