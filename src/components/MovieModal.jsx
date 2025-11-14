import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
library.add(faPlay);

import { gsap } from 'gsap'
import {
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
  FaRegBookmark,
  FaBookmark,
} from 'react-icons/fa'

const MovieModal = ({ movie, onClose }) => {
  const overlayRef = useRef(null)
  const modalRef = useRef(null)
  const upvoteBtnRef = useRef(null)
  const downvoteBtnRef = useRef(null)
  const watchlistBtnRef = useRef(null)

  const [vote, setVote] = useState(null)
  const [inWatchlist, setInWatchlist] = useState(false)
  // Removed unused state 'watchlistAnim'

  // ✅ Trailer player states
  const [trailerKey, setTrailerKey] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [loadingTrailer, setLoadingTrailer] = useState(false)

  const trailerOverlayRef = useRef(null)
  const trailerIframeRef = useRef(null)

  // ✅ Animate modal open
  useEffect(() => {
    if (movie && overlayRef.current && modalRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
      gsap.fromTo(
        modalRef.current,
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
      )
    }
  }, [movie])

  // ✅ Trailer popup GSAP animation
  useEffect(() => {
    if (showTrailer && trailerOverlayRef.current) {
      gsap.fromTo(
        trailerOverlayRef.current,
        { opacity: 0, backdropFilter: 'blur(0px)' },
        { opacity: 1, backdropFilter: 'blur(6px)', duration: 0.4, ease: 'power2.out' }
      )
    }
  }, [showTrailer])

  // ✅ Load trailer key from backend
  const fetchTrailer = async () => {
    try {
      setLoadingTrailer(true)
      setShowTrailer(true)

      const res = await fetch(`http://localhost:3001/api/tmdb/trailer/${movie.id}`)
      const data = await res.json()

      if (data.key) {
        setTrailerKey(data.key)
      } else {
        setTrailerKey(null)
        setLoadingTrailer(false)
      }
    } catch (error) {
      console.error('Trailer fetch error:', error)
      setLoadingTrailer(false)
      setTrailerKey(null)
    }
  }

  // ✅ Animate iframe when loaded
  const handleIframeLoad = () => {
    setLoadingTrailer(false)

    if (trailerIframeRef.current) {
      gsap.fromTo(
        trailerIframeRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out' }
      )
    }
  }

  // ✅ Voting & Watchlist (your existing logic)
  const handleUpvote = () => {
    if (vote === 'up') {
      setVote(null)
      if (upvoteBtnRef.current) {
        gsap.to(upvoteBtnRef.current, { scale: 1, duration: 0.2 })
      }
    } else {
      setVote('up')
      if (upvoteBtnRef.current) {
        gsap.fromTo(upvoteBtnRef.current, { scale: 0.9 }, { scale: 1.15, duration: 0.25 })
      }
      if (downvoteBtnRef.current) {
        gsap.to(downvoteBtnRef.current, { scale: 1, duration: 0.2 })
      }
    }
  }

  const handleDownvote = () => {
    if (vote === 'down') {
      setVote(null)
      if (downvoteBtnRef.current) {
        gsap.to(downvoteBtnRef.current, { scale: 1, duration: 0.2 })
      }
    } else {
      setVote('down')
      if (downvoteBtnRef.current) {
        gsap.fromTo(downvoteBtnRef.current, { scale: 0.9 }, { scale: 1.15, duration: 0.25 })
      }
      if (upvoteBtnRef.current) {
        gsap.to(upvoteBtnRef.current, { scale: 1, duration: 0.2 })
      }
    }
  }

  const handleWatchlist = () => {
    setInWatchlist((prev) => !prev)
    if (watchlistBtnRef.current) {
      gsap.fromTo(
        watchlistBtnRef.current,
        { scale: 0.8 },
        {
          scale: 1.15,
          duration: 0.2,
          ease: 'back.out(2.5)',
          onComplete: () => {
            gsap.to(watchlistBtnRef.current, { scale: 1, duration: 0.17 })
          },
        }
      )
    }
  }

  if (!movie) return null

  const posterUrl =
    movie.backdrop_path || movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`
      : null

  const rating =
    typeof movie.vote_average === 'number'
      ? (movie.vote_average / 2).toFixed(1)
      : 'N/A'

  const releaseYear = movie.release_date
    ? movie.release_date.split('-')[0]
    : 'N/A'

  const releaseDate = movie.release_date || movie.first_air_date || 'Unknown'

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/85 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#18181f] text-white rounded-2xl overflow-hidden w-[96%] max-w-6xl"
      >
        {/* Close Modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl font-bold text-white/80 hover:text-white"
        >
          &times;
        </button>

        {/* Poster */}
        <div className="relative">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title || movie.name}
              className="w-full h-[28rem] object-cover opacity-70"
            />
          ) : (
            <div className="w-full h-[28rem] bg-gray-800 flex justify-center items-center">
              No Image Available
            </div>
          )}

          {/* Gradient */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#18181f] via-[#18181f]/90 to-transparent" />

          {/* Movie Info */}
          <div className="absolute inset-y-0 left-0 w-1/2 flex flex-col justify-end px-10 pb-10">
            <h2 className="text-4xl font-extrabold mb-3">{movie.title || movie.name}</h2>

            <div className="flex gap-4 text-gray-300">
              <span className="bg-white/10 px-2 py-1 rounded">{releaseYear}</span>
              <span>{releaseDate}</span>
            </div>

            <div className="flex items-center gap-1 my-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={`${i < Math.round(Number(rating)) ? 'text-yellow-400' : 'text-gray-600'}`}
                />
              ))}
              <span className="ml-2 text-yellow-300 font-bold">{rating}/5</span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-4">
              <button
                ref={watchlistBtnRef}
                onClick={handleWatchlist}
                className="px-5 py-2.5 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center gap-2"
              >
                {inWatchlist ? <FaBookmark /> : <FaRegBookmark />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>

              <button
                ref={upvoteBtnRef}
                onClick={handleUpvote}
                className="px-5 py-2.5 rounded-full bg-gray-800 hover:bg-green-600 flex items-center gap-2"
              >
                <FaThumbsUp /> Applaud
              </button>

              <button
                ref={downvoteBtnRef}
                onClick={handleDownvote}
                className="px-5 py-2.5 rounded-full bg-gray-800 hover:bg-red-600 flex items-center gap-2"
              >
                <FaThumbsDown /> Skip
              </button>

              {/* ✅ Play Trailer */}
              <button
                onClick={fetchTrailer}
                className="px-9 py-3.5 rounded-xl  bg-gray-800 hover:bg-red-400 flex items-center gap-2 font-bold"
              >
                <FontAwesomeIcon icon={["fas", "play"]} /> Play Trailer
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-8 py-8 text-gray-200 text-lg">
          {movie.overview || 'No description available.'}
        </div>
      </div>

      {/* ✅ TRAILER OVERLAY */}
      {showTrailer && (
        <div
          ref={trailerOverlayRef}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center"
        >
          {/* Close Trailer */}
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-6 right-10 text-white text-4xl hover:text-red-400"
          >
            ✕
          </button>

          {/* Loading Spinner */}
          {loadingTrailer && (
            <div className="absolute">
              <div className="h-20 w-20 border-4 border-gray-500 border-t-red-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Trailer iframe */}
          {trailerKey && (
            <iframe
              ref={trailerIframeRef}
              width="900"
              height="500"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              allow="autoplay"
              className={`rounded-xl shadow-xl ${loadingTrailer ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleIframeLoad}
              title="YouTube Trailer"
            ></iframe>
          )}
        </div>
      )}
    </div>
  )
}

export default MovieModal
