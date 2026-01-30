'use client';

interface FeltTableProps {
  children: React.ReactNode;
}

export default function FeltTable({ children }: FeltTableProps) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Table Texture & Gradient - Full Coverage */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_#1a1a1a_0%,_#000000_100%)]">
        {/* Deep dark radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a1a1a_0%,_#000000_100%)]"></div>

        {/* Subtle Noise */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Vegas SVG Markings Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg
          className="w-full h-full min-h-full"
          viewBox="0 0 1000 700"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <path id="insurancePath" d="M 200,140 Q 500,80 800,140" fill="transparent" />
            {/* Glow Filters */}
            <filter id="glow-text" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Insurance Arc Line */}
          <path
            d="M 180,150 Q 500,90 820,150"
            stroke="#eb2a73"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
            strokeDasharray="4,4"
          />
          <path
            d="M 180,150 Q 500,90 820,150"
            stroke="#eb2a73"
            strokeWidth="0.5"
            fill="none"
            opacity="0.8"
          />

          {/* Insurance Text */}
          <text
            className="fill-neon-pink text-[12px] font-bold tracking-[0.2em] uppercase opacity-90"
            filter="url(#glow-text)"
          >
            <textPath href="#insurancePath" startOffset="50%" textAnchor="middle">
              Insurance Pays 2 to 1
            </textPath>
          </text>

          {/* Main Center Text */}
          <text
            x="500"
            y="350"
            className="fill-white text-5xl font-serif font-bold opacity-10"
            textAnchor="middle"
          >
            BLACKJACK
          </text>
          <text
            x="500"
            y="390"
            className="fill-neon-blue text-[14px] font-serif font-bold tracking-[0.2em] opacity-80"
            textAnchor="middle"
            filter="url(#glow-text)"
          >
            PAYS 3 TO 2
          </text>

          {/* Dealer Rule Box (Left) - Wider Rectangle */}
          <g transform="translate(80, 250) rotate(-8)">
            <rect
              width="110"
              height="50"
              rx="4"
              fill="none"
              stroke="#00fa9a"
              strokeWidth="1.5"
              opacity="0.25"
            />
            <rect
              width="106"
              height="46"
              x="2"
              y="2"
              rx="3"
              fill="none"
              stroke="#00fa9a"
              strokeWidth="0.5"
              opacity="0.3"
              strokeDasharray="3,2"
            />
            <text
              x="55"
              y="18"
              className="fill-neon-green text-[8px] font-extrabold uppercase tracking-wider opacity-70"
              textAnchor="middle"
            >
              Dealer Must
            </text>
            <text
              x="55"
              y="28"
              className="fill-neon-green text-[8px] font-extrabold uppercase tracking-wider opacity-70"
              textAnchor="middle"
            >
              Draw to 16
            </text>
            <text
              x="55"
              y="38"
              className="fill-neon-green text-[8px] font-extrabold uppercase tracking-wider opacity-70"
              textAnchor="middle"
            >
              Stand on 17
            </text>
          </g>

          {/* Side Bet / Bonus Circle (Right) - Pushed Further Right */}
          <g transform="translate(810, 250) rotate(8)">
            <circle
              cx="40"
              cy="25"
              r="34"
              fill="none"
              stroke="#01d5ff"
              strokeWidth="1.5"
              opacity="0.25"
            />
            <circle
              cx="40"
              cy="25"
              r="30"
              fill="none"
              stroke="#01d5ff"
              strokeWidth="0.5"
              opacity="0.3"
              strokeDasharray="2,2"
            />
            <text
              x="40"
              y="21"
              className="fill-neon-blue text-[8px] font-extrabold uppercase tracking-wider opacity-70"
              textAnchor="middle"
            >
              Protocol
            </text>
            <text
              x="40"
              y="31"
              className="fill-neon-blue text-[8px] font-extrabold uppercase tracking-wider opacity-70"
              textAnchor="middle"
            >
              21
            </text>
          </g>

          {/* Betting Circle on Felt */}
          <g transform="translate(500, 600)">
            {/* Outer Ring */}
            <circle cx="0" cy="0" r="55" stroke="#eb2a73" strokeWidth="1.5" fill="none" opacity="0.2" />
            {/* Inner Dashed */}
            <circle cx="0" cy="0" r="48" stroke="#eb2a73" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="6,4" />
            {/* Center Logo */}
            <text x="0" y="8" className="fill-neon-pink text-2xl font-serif font-bold opacity-20" textAnchor="middle">
              P21
            </text>
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
