import React from 'react'

const SkeletonLoader = () => {
  return (
    <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 relative shadow-lg">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Poster Placeholder */}
      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
        {/* Icon */}
        <div className="w-20 h-20 mb-4 rounded-full bg-gray-700/50 flex items-center justify-center animate-pulse">
          <svg 
            className="w-10 h-10 text-gray-600" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-1.5 w-full">
          <div className="h-2 bg-gray-700/70 rounded w-4/5 mx-auto animate-pulse" />
          <div className="h-2 bg-gray-700/70 rounded w-3/5 mx-auto animate-pulse delay-75" />
        </div>
      </div>

      {/* Top Right Badge Skeleton */}
      <div className="absolute top-2 right-2 w-10 h-6 bg-gray-700/50 rounded animate-pulse" />

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2 bg-gradient-to-t from-black/80 to-transparent">
        <div className="h-3 bg-gray-700/70 rounded w-4/5 animate-pulse" />
        <div className="h-2.5 bg-gray-700/70 rounded w-2/3 animate-pulse delay-100" />
        <div className="h-2.5 bg-gray-700/70 rounded w-1/2 animate-pulse delay-150" />
      </div>
    </div>
  )
}

export default SkeletonLoader
