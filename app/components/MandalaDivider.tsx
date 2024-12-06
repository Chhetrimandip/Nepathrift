const MandalaDivider = () => {
  return (
    <div className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
      </div>
      <div className="relative flex justify-center">
        <svg
          viewBox="0 0 200 200"
          className="w-24 h-24 text-purple-500 opacity-30 animate-spin-slow"
          style={{ animationDuration: '20s' }}
        >
          {/* Outer circle */}
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" />
          
          {/* Detailed petals */}
          {Array.from({ length: 16 }).map((_, i) => (
            <g key={i} transform={`rotate(${i * 22.5} 100 100)`}>
              <path
                d="M 100 10 
                   C 120 40, 120 60, 100 90 
                   C 80 60, 80 40, 100 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              {/* Inner decorative elements */}
              <path
                d="M 100 20
                   C 110 35, 110 45, 100 60
                   C 90 45, 90 35, 100 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </g>
          ))}

          {/* Central detailed pattern */}
          <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={`inner-${i}`} transform={`rotate(${i * 45} 100 100)`}>
              <path
                d="M 100 70
                   Q 110 85, 100 100
                   Q 90 85, 100 70"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              {/* Additional decorative dots */}
              <circle cx="100" cy="75" r="2" fill="currentColor" />
            </g>
          ))}

          {/* Decorative circles */}
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />

          {/* Radial lines with decorative elements */}
          {Array.from({ length: 32 }).map((_, i) => (
            <line
              key={`line-${i}`}
              x1="100"
              y1="100"
              x2={100 + 90 * Math.cos((i * Math.PI) / 16)}
              y2={100 + 90 * Math.sin((i * Math.PI) / 16)}
              stroke="currentColor"
              strokeWidth="0.3"
              strokeDasharray="2 4"
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

export default MandalaDivider

