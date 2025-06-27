const SiteLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Moving Car Animation */}
        <div className="relative mb-8">
          {/* Road */}
          <div className="w-64 h-1 bg-white/30 rounded-full mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent w-16 h-full animate-pulse"></div>
          </div>

          {/* Car */}
          <div className="relative">
            <div className="inline-block animate-bounce">
              <svg
                width="48"
                height="32"
                viewBox="0 0 48 32"
                className="text-white drop-shadow-lg"
              >
                {/* Car Body */}
                <path
                  d="M8 16 L12 8 L36 8 L40 16 L40 20 L36 20 L36 18 L12 18 L12 20 L8 20 Z"
                  fill="currentColor"
                />
                {/* Windows */}
                <path
                  d="M14 12 L16 10 L32 10 L34 12 L34 16 L14 16 Z"
                  fill="rgba(255,255,255,0.3)"
                />
                {/* Wheels */}
                <circle cx="16" cy="22" r="4" fill="currentColor" />
                <circle cx="32" cy="22" r="4" fill="currentColor" />
                <circle cx="16" cy="22" r="2" fill="rgba(0,0,0,0.3)" />
                <circle cx="32" cy="22" r="2" fill="rgba(0,0,0,0.3)" />
                {/* Headlight */}
                <circle cx="42" cy="16" r="2" fill="rgba(255,255,255,0.8)" />
              </svg>
            </div>

            {/* Speed Lines */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16">
              <div className="flex space-x-1">
                <div className="w-3 h-0.5 bg-white/40 animate-pulse"></div>
                <div className="w-2 h-0.5 bg-white/30 animate-pulse delay-100"></div>
                <div className="w-1 h-0.5 bg-white/20 animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Shoferi Text */}
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {["S", "h", "o", "f", "e", "r", "i"].map((letter, index) => (
              <span
                key={index}
                className="inline-block animate-pulse"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationDuration: "1s",
                }}
              >
                {letter}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <div className="flex items-center justify-center gap-2 text-purple-200 text-sm font-medium">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
            </div>
            <span className="animate-pulse">Getting ready</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-48 mx-auto">
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse w-full origin-left transform scale-x-0 animate-[scaleX_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleX {
          0% {
            transform: scaleX(0);
          }
          50% {
            transform: scaleX(0.7);
          }
          100% {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};

export default SiteLoader;
