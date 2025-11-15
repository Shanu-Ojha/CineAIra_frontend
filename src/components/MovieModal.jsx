import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import API_BASE_URL from '../config';
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

  // Refs
  const overlayRef = useRef(null)
  const modalRef = useRef(null)

  const upvoteBtnRef = useRef(null)
  const downvoteBtnRef = useRef(null)
  const watchlistBtnRef = useRef(null)

  const trailerOverlayRef = useRef(null)
  const trailerIframeRef = useRef(null)

  // Voting states
  const [vote, setVote] = useState(null)
  const [inWatchlist, setInWatchlist] = useState(false)

  // Trailer
  const [trailerKey, setTrailerKey] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [loadingTrailer, setLoadingTrailer] = useState(false)

  // Open animation
  useEffect(() => {
    if (movie) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
      gsap.fromTo(
        modalRef.current,
        { y: 60, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
      )
    }
  }, [movie])

  // Trailer popup animation
  useEffect(() => {
    if (showTrailer) {
      gsap.fromTo(
        trailerOverlayRef.current,
        { opacity: 0, backdropFilter: "blur(0px)" },
        { opacity: 1, backdropFilter: "blur(6px)", duration: 0.4 }
      )
    }
  }, [showTrailer])

  // Fetch trailer
  const fetchTrailer = async () => {
    try {
      setLoadingTrailer(true)
      setShowTrailer(true)

      const res = await fetch(`${API_BASE_URL}/api/tmdb/trailer/${movie.id}`);
      const data = await res.json()

      if (data.key) {
          setTrailerKey(data.key)
      } else {
          setTrailerKey(null)
      }

    } catch (err) {
      console.error(err)
      setTrailerKey(null)
    }
  }

  const handleIframeLoad = () => {
    setLoadingTrailer(false)
    if (trailerIframeRef.current) {
      gsap.fromTo(
        trailerIframeRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }
      )
    }
  }
  
  // Like, Skip & Watchlist (with GSAP)
  const handleUpvote = () => {
    if (vote === "up") {
      setVote(null)
      gsap.to(upvoteBtnRef.current, { scale: 1 })
    } else {
      setVote("up")
      gsap.fromTo(upvoteBtnRef.current, { scale: 0.9 }, { scale: 1.15 })
      gsap.to(downvoteBtnRef.current, { scale: 1 })
    }
  }

  const handleDownvote = () => {
    if (vote === "down") {
      setVote(null)
      gsap.to(downvoteBtnRef.current, { scale: 1 })
    } else {
      setVote("down")
      gsap.fromTo(downvoteBtnRef.current, { scale: 0.9 }, { scale: 1.15 })
      gsap.to(upvoteBtnRef.current, { scale: 1 })
    }
  }

  const handleWatchlist = () => {
    setInWatchlist(prev => !prev)
    gsap.fromTo(
      watchlistBtnRef.current,
      { scale: 0.85 },
      { scale: 1.15, duration: 0.25, ease: "back.out(2)" }
    )
  }

  if (!movie) return null

  // Poster logic
  const posterUrl = movie.backdrop_path || movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`
      : null

  const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : "N/A"
  const releaseYear = movie.release_date?.split("-")[0] || "N/A"
  const releaseDate = movie.release_date || movie.first_air_date || "Unknown"

  return (
    <>
      {/* MAIN OVERLAY */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/85 flex items-center justify-center z-50"
        onClick={onClose}
      >

        {/* MODAL */}
        <div
          ref={modalRef}
          className="
            relative bg-[#18181f] text-white rounded-xl overflow-hidden
            w-full max-w-5xl mx-2 sm:mx-auto
          "
          onClick={(e) => e.stopPropagation()}
        >

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-3xl text-white/80 hover:text-white"
          >
            &times;
          </button>

          {/* POSTER SECTION */}
          <div className="relative">
            {posterUrl ? (
              <img
                src={posterUrl}
                className="w-full h-64 sm:h-80 md:h-[26rem] object-cover opacity-70"
              />
            ) : (
              <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                No Image Available
              </div>
            )}

            {/* Text Gradient */}
            <div className="
              absolute inset-y-0 left-0 
              w-full sm:w-1/2 
              bg-gradient-to-t sm:bg-gradient-to-r
              from-[#18181f] via-[#18181f]/80 to-transparent
              flex flex-col justify-end px-5 sm:px-10 pb-6 sm:pb-10
            ">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3">
                {movie.title || movie.name}
              </h2>

              <div className="flex gap-3 text-gray-300">
                <span className="bg-white/10 px-3 py-1 rounded">{releaseYear}</span>
                <span>{releaseDate}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 my-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${i < Math.round(Number(rating)) ? "text-yellow-400" : "text-gray-600"}`}
                  />
                ))}
                <span className="ml-2 text-yellow-300 font-bold">{rating}/5</span>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">

                {/* Watchlist */}
                <button
                  ref={watchlistBtnRef}
                  onClick={handleWatchlist}
                  className={`
                    px-4 py-2 rounded-full flex items-center gap-2
                    text-sm sm:text-base
                    transition-all duration-200
                    ${inWatchlist ? "bg-yellow-500 text-black" : "bg-gray-800 hover:bg-gray-700"}
                  `}
                >
                  {inWatchlist ? <FaBookmark /> : <FaRegBookmark />}
                  {inWatchlist ? "Added" : "Watchlist"}
                </button>

                {/* Like */}
                <button
                  ref={upvoteBtnRef}
                  onClick={handleUpvote}
                  className={`
                    px-4 py-2 rounded-full flex items-center gap-2
                    text-sm sm:text-base transition-all duration-200
                    ${vote === "up" ? "bg-green-500 text-black scale-105" : "bg-gray-800 hover:bg-green-600"}
                  `}
                >
                  <FaThumbsUp /> Like
                </button>

                {/* Skip */}
                <button
                  ref={downvoteBtnRef}
                  onClick={handleDownvote}
                  className={`
                    px-4 py-2 rounded-full flex items-center gap-2
                    text-sm sm:text-base transition-all duration-200
                    ${vote === "down" ? "bg-red-500 text-black scale-105" : "bg-gray-800 hover:bg-red-600"}
                  `}
                >
                  <FaThumbsDown /> Skip
                </button>

                {/* Trailer */}
                <button
                  onClick={fetchTrailer}
                  className="px-6 py-2 rounded-full bg-gray-700 hover:bg-red-500 flex items-center gap-2 text-sm sm:text-base font-semibold"
                >
                  <FontAwesomeIcon icon={["fas", "play"]} /> Trailer
                </button>

              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="px-4 sm:px-8 py-6 text-gray-300 text-sm sm:text-base leading-relaxed">
            {movie.overview || "No description available."}
          </div>
        </div>
      </div>

      {/* TRAILER POPUP */}
      {showTrailer && (
        <div
          ref={trailerOverlayRef}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]"
        >
          {/* Close Trailer */}
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-6 right-10 text-white text-4xl hover:text-red-400"
          >
            ✕
          </button>

          {/* Loader */}
          {loadingTrailer && (
            <div className="absolute">
              <div className="h-16 w-16 border-4 border-gray-500 border-t-red-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Trailer Iframe */}
          {trailerKey && (
            <iframe
              ref={trailerIframeRef}
              onLoad={handleIframeLoad}
              allow="autoplay"
              allowFullScreen
              className="w-[90%] sm:w-[80%] md:w-[900px] h-48 sm:h-72 md:h-[500px] rounded-xl shadow-xl"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            />
          )}
        </div>
      )}
    </>
  )
}

export default MovieModal



