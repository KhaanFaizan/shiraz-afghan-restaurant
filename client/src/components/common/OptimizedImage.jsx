import { useState } from 'react'

/**
 * Drop-in replacement for <img> inside an existing `relative overflow-hidden` container.
 * Renders absolutely positioned to fill its parent.
 *
 * Features:
 *   - Skeleton pulse while loading
 *   - Fade-in once loaded (no layout shift)
 *   - Silent error fallback (dark placeholder)
 *   - lazy + async decoding by default
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  objectPosition = 'center',
}) {
  const [loaded, setLoaded] = useState(false)
  const [error,  setError]  = useState(false)

  return (
    <>
      {/* Skeleton — visible while image is loading */}
      {!loaded && !error && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#1a1a1a] animate-pulse"
        />
      )}

      {/* Image */}
      {!error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{ objectPosition }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#111111] flex items-center justify-center"
        >
          <div className="w-6 h-px bg-[#2a2a2a]" />
        </div>
      )}
    </>
  )
}
