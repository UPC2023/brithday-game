import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StepId, GameStage } from '../types/game';

interface RoomCanvasProps {
  stage: GameStage;
  activeItems: Set<StepId>;
  highlightItem: StepId | null;
  onHotspotClick: (item: StepId) => void;
  candleLit: boolean;
  blowIntensity: number;
}

export const RoomCanvas: React.FC<RoomCanvasProps> = ({
  stage,
  activeItems,
  highlightItem,
  onHotspotClick,
  candleLit,
  blowIntensity,
}) => {
  const isWishing = stage === 'WISHING';
  const isCelebrating = stage === 'CELEBRATING';

  // Flame physics reaction
  const flameScaleY = candleLit ? Math.max(0.2, 1 - blowIntensity * 0.75) : 0;
  const flameSkewX = blowIntensity * 38;

  return (
    <div className="relative w-full h-full max-h-[85vh] sm:max-h-[82vh] aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/10] mx-auto rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 bg-stone-900 select-none">
      <svg
        viewBox="0 0 1000 750"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Wall Gradient */}
          <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3d5248" />
            <stop offset="60%" stopColor="#4a6458" />
            <stop offset="100%" stopColor="#3a4e44" />
          </linearGradient>

          {/* Wooden Floor Gradient */}
          <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b48356" />
            <stop offset="50%" stopColor="#96673f" />
            <stop offset="100%" stopColor="#7a4f2c" />
          </linearGradient>

          {/* Tablecloth Pattern (Floral) */}
          <pattern id="floralPattern" width="44" height="44" patternUnits="userSpaceOnUse">
            <rect width="44" height="44" fill="#fffdfa" />
            {/* Dainty coral rosebud */}
            <circle cx="12" cy="12" r="3.5" fill="#f87171" opacity="0.85" />
            <circle cx="10" cy="11" r="2.2" fill="#ef4444" opacity="0.9" />
            <path d="M14 14 Q17 12 18 15" stroke="#15803d" strokeWidth="1.2" fill="none" />
            <ellipse cx="16" cy="13" rx="1.5" ry="0.8" fill="#22c55e" transform="rotate(-30 16 13)" />

            {/* Dainty golden daisy */}
            <circle cx="34" cy="30" r="3.2" fill="#facc15" opacity="0.85" />
            <circle cx="34" cy="30" r="1.6" fill="#ca8a04" />
            <ellipse cx="30" cy="32" rx="1.6" ry="0.8" fill="#16a34a" transform="rotate(20 30 32)" />

            {/* Tiny lavender blossom & leaves */}
            <circle cx="36" cy="10" r="1.5" fill="#c084fc" opacity="0.7" />
            <circle cx="8" cy="34" r="1.5" fill="#fb7185" opacity="0.7" />
            <circle cx="22" cy="22" r="1.2" fill="#38bdf8" opacity="0.5" />
          </pattern>

          {/* Tablecloth Fold Shadow Gradient */}
          <linearGradient id="clothShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.02" />
            <stop offset="70%" stopColor="#000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
          </linearGradient>

          {/* Candle & Light Glow Filters */}
          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="candleGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Gold Gradient for Candle Sticks */}
          <linearGradient id="goldCandle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="40%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Heart Balloon Shape Definition */}
          <g id="heartBalloon">
            <path
              d="M 0,-15 C -25,-35 -40,-10 -40,15 C -40,40 -15,60 0,78 C 15,60 40,40 40,15 C 40,-10 25,-35 0,-15 Z"
            />
          </g>
        </defs>

        {/* 1. ROOM BACKGROUND: WALL & FLOOR */}
        {/* Wall */}
        <rect x="0" y="0" width="1000" height="520" fill="url(#wallGrad)" />

        {/* Baseboard */}
        <rect x="0" y="505" width="1000" height="20" fill="#283831" />
        <rect x="0" y="500" width="1000" height="5" fill="#4d6458" />

        {/* Wood Floor */}
        <rect x="0" y="520" width="1000" height="230" fill="url(#floorGrad)" />

        {/* Floor plank lines */}
        <line x1="0" y1="565" x2="1000" y2="565" stroke="#684224" strokeWidth="1.5" opacity="0.6" />
        <line x1="0" y1="620" x2="1000" y2="620" stroke="#684224" strokeWidth="1.5" opacity="0.6" />
        <line x1="0" y1="680" x2="1000" y2="680" stroke="#684224" strokeWidth="1.5" opacity="0.6" />

        {/* Subtle background sofa & plant silhouettes for warm room depth */}
        <g opacity="0.4">
          <rect x="110" y="380" width="8" height="150" fill="#6d4a32" />
          <rect x="150" y="380" width="8" height="150" fill="#6d4a32" />
          <rect x="100" y="440" width="65" height="10" rx="3" fill="#845938" />
          <rect x="106" y="340" width="55" height="45" rx="4" fill="#9c6d48" />

          {/* Right cozy sofa */}
          <rect x="870" y="360" width="130" height="170" rx="16" fill="#803525" />
          <ellipse cx="895" cy="420" rx="35" ry="45" fill="#eab308" opacity="0.8" />
        </g>

        {/* 2. THE EMPTY TABLE WITH FLORAL TABLECLOTH */}
        <g id="tableGroup">
          {/* Table shadow on floor */}
          <ellipse cx="500" cy="710" rx="380" ry="32" fill="#301b0d" opacity="0.45" />

          {/* Table legs */}
          <rect x="220" y="510" width="22" height="185" rx="4" fill="#4e2c14" />
          <rect x="758" y="510" width="22" height="185" rx="4" fill="#4e2c14" />

          {/* Tablecloth Main Drape (overhanging front) */}
          <path
            d="M 120 470 L 880 470 L 850 685 Q 500 700 150 685 Z"
            fill="url(#clothShadow)"
          />
          <path
            d="M 120 470 L 880 470 L 850 685 Q 500 700 150 685 Z"
            fill="url(#floralPattern)"
            stroke="#f5ebe0"
            strokeWidth="1.5"
          />

          {/* Natural soft folds on tablecloth skirt */}
          <path d="M 230 475 Q 235 580 240 686" stroke="#000" strokeWidth="2.5" opacity="0.08" fill="none" />
          <path d="M 400 475 Q 405 585 410 695" stroke="#000" strokeWidth="3" opacity="0.08" fill="none" />
          <path d="M 600 475 Q 595 585 590 695" stroke="#000" strokeWidth="3" opacity="0.08" fill="none" />
          <path d="M 770 475 Q 765 580 760 686" stroke="#000" strokeWidth="2.5" opacity="0.08" fill="none" />

          {/* Table Top Surface (perspective plane between y=390 and y=470) */}
          <polygon
            points="180,390 820,390 880,470 120,470"
            fill="url(#floralPattern)"
          />
          {/* Table Top Soft Lighting Tint */}
          <polygon
            points="180,390 820,390 880,470 120,470"
            fill="#ffffff"
            opacity="0.22"
          />
          {/* Front horizontal seam line */}
          <line x1="120" y1="470" x2="880" y2="470" stroke="#f1e3d3" strokeWidth="2.5" />
          <line x1="120" y1="472" x2="880" y2="472" stroke="#4a3121" strokeWidth="1" opacity="0.15" />
        </g>

        {/* 3. WALL FAIRY LIGHTS */}
        {activeItems.has('lights') && (
          <g id="decor_lights">
            {/* String Wire Swags */}
            <path
              d="M 20 80 Q 250 160 500 110 T 980 90"
              fill="none"
              stroke="#263830"
              strokeWidth="2.5"
              opacity="0.8"
            />
            <path
              d="M 50 130 Q 300 230 550 180 T 950 140"
              fill="none"
              stroke="#263830"
              strokeWidth="2"
              opacity="0.75"
            />

            {/* Twinkling Bulbs */}
            {[
              { cx: 80, cy: 105, col: '#fef08a' },
              { cx: 160, cy: 135, col: '#fdba74' },
              { cx: 250, cy: 152, col: '#f472b6' },
              { cx: 340, cy: 142, col: '#c084fc' },
              { cx: 430, cy: 122, col: '#fde047' },
              { cx: 520, cy: 110, col: '#fdba74' },
              { cx: 620, cy: 118, col: '#67e8f9' },
              { cx: 720, cy: 110, col: '#f472b6' },
              { cx: 830, cy: 98, col: '#fef08a' },
              { cx: 920, cy: 92, col: '#86efac' },
              // Lower string
              { cx: 120, cy: 160, col: '#fda4af' },
              { cx: 220, cy: 200, col: '#fde047' },
              { cx: 330, cy: 218, col: '#93c5fd' },
              { cx: 450, cy: 204, col: '#fdba74' },
              { cx: 580, cy: 178, col: '#fef08a' },
              { cx: 700, cy: 165, col: '#c084fc' },
              { cx: 810, cy: 154, col: '#6ee7b7' },
              { cx: 900, cy: 146, col: '#fde047' },
            ].map((b, idx) => (
              <g key={`light_${idx}`}>
                <circle cx={b.cx} cy={b.cy} r={isWishing ? 17 : 12} fill={b.col} opacity={isWishing ? 0.45 : 0.25} />
                <rect x={b.cx - 2} y={b.cy - 7} width="4" height="4" fill="#334155" rx="1" />
                <circle cx={b.cx} cy={b.cy} r="4.5" fill={b.col} stroke="#ffffff" strokeWidth="1.2" />
              </g>
            ))}
          </g>
        )}

        {/* 4. "HAPPY BIRTHDAY" BUNTING BANNER */}
        {activeItems.has('banner') && (
          <g id="decor_banner">
            <path
              d="M 60 180 Q 500 240 940 180"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeDasharray="6 3"
            />
            {[
              { ch: 'H', bg: '#ef4444', x: 80, y: 182 },
              { ch: 'A', bg: '#f97316', x: 142, y: 191 },
              { ch: 'P', bg: '#eab308', x: 204, y: 198 },
              { ch: 'P', bg: '#10b981', x: 266, y: 204 },
              { ch: 'Y', bg: '#06b6d4', x: 328, y: 208 },
              { ch: '★', bg: '#a855f7', x: 390, y: 210 },
              { ch: 'B', bg: '#ec4899', x: 452, y: 211 },
              { ch: 'I', bg: '#3b82f6', x: 514, y: 211 },
              { ch: 'R', bg: '#f59e0b', x: 576, y: 209 },
              { ch: 'T', bg: '#10b981', x: 638, y: 205 },
              { ch: 'H', bg: '#8b5cf6', x: 700, y: 200 },
              { ch: 'D', bg: '#ef4444', x: 762, y: 194 },
              { ch: 'A', bg: '#f97316', x: 824, y: 186 },
              { ch: 'Y', bg: '#ec4899', x: 886, y: 177 },
            ].map((p, idx) => (
              <g key={`bunt_${idx}`} transform={`translate(${p.x}, ${p.y})`}>
                <polygon points="-18,-15 18,-15 18,22 0,34 -18,22" fill={p.bg} stroke="#ffffff" strokeWidth="1.2" />
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="17"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {p.ch}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* 5. BALLOONS (Moved down to the ground, with heart and oval variety!) */}
        {activeItems.has('balloons') && (
          <g id="decor_balloons">
            {/* LEFT BALLOONS: Moved to left-bottom, ribbon ends anchored to floor (y=700) */}
            <g id="left_balloons">
              {/* Floor weight & bow on floor */}
              <ellipse cx="90" cy="705" rx="18" ry="6" fill="#1e293b" opacity="0.4" />
              <polygon points="80,705 100,705 90,695" fill="#f59e0b" />
              <circle cx="90" cy="695" r="5" fill="#d97706" />

              {/* Curving ribbons stretching from floor to balloons */}
              <path d="M 90 695 Q 70 580 85 450" stroke="#fcd34d" strokeWidth="2" fill="none" opacity="0.85" />
              <path d="M 90 695 Q 110 590 60 380" stroke="#f472b6" strokeWidth="2" fill="none" opacity="0.85" />
              <path d="M 90 695 Q 80 540 120 330" stroke="#c084fc" strokeWidth="2" fill="none" opacity="0.85" />

              {/* Heart Balloon 1 (Soft Rose Pink) */}
              <g transform="translate(60, 380)">
                <path
                  d="M 0,-15 C -25,-35 -40,-10 -40,15 C -40,40 -15,60 0,78 C 15,60 40,40 40,15 C 40,-10 25,-35 0,-15 Z"
                  fill="#f43f5e"
                />
                {/* Heart highlight */}
                <ellipse cx="-16" cy="10" rx="8" ry="14" fill="#fff" opacity="0.35" transform="rotate(-25 -16 10)" />
                <polygon points="-4,77 4,77 0,82" fill="#be123c" />
              </g>

              {/* Oval Balloon 2 (Golden Yellow) */}
              <g transform="translate(85, 450)">
                <ellipse cx="0" cy="0" rx="34" ry="44" fill="#fbbf24" />
                <ellipse cx="-12" cy="-14" rx="8" ry="14" fill="#fff" opacity="0.4" transform="rotate(-20 -12 -14)" />
                <polygon points="-4,43 4,43 0,48" fill="#d97706" />
              </g>

              {/* Round/Heart Balloon 3 (Lavender Violet) */}
              <g transform="translate(120, 330)">
                <path
                  d="M 0,-15 C -25,-35 -40,-10 -40,15 C -40,40 -15,60 0,78 C 15,60 40,40 40,15 C 40,-10 25,-35 0,-15 Z"
                  fill="#a855f7"
                />
                <ellipse cx="-16" cy="10" rx="8" ry="14" fill="#fff" opacity="0.35" transform="rotate(-25 -16 10)" />
                <polygon points="-4,77 4,77 0,82" fill="#7e22ce" />
              </g>
            </g>

            {/* RIGHT BALLOONS: Moved to right-bottom, ribbon ends anchored to floor (y=705) */}
            <g id="right_balloons">
              {/* Floor weight & bow on floor */}
              <ellipse cx="910" cy="705" rx="18" ry="6" fill="#1e293b" opacity="0.4" />
              <polygon points="900,705 920,705 910,695" fill="#f59e0b" />
              <circle cx="910" cy="695" r="5" fill="#d97706" />

              {/* Ribbons */}
              <path d="M 910 695 Q 930 580 915 450" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.85" />
              <path d="M 910 695 Q 890 590 940 380" stroke="#f472b6" strokeWidth="2" fill="none" opacity="0.85" />
              <path d="M 910 695 Q 920 540 880 340" stroke="#fb7185" strokeWidth="2" fill="none" opacity="0.85" />

              {/* Heart Balloon (Celestial Cyan Blue) */}
              <g transform="translate(940, 380)">
                <path
                  d="M 0,-15 C -25,-35 -40,-10 -40,15 C -40,40 -15,60 0,78 C 15,60 40,40 40,15 C 40,-10 25,-35 0,-15 Z"
                  fill="#38bdf8"
                />
                <ellipse cx="-16" cy="10" rx="8" ry="14" fill="#fff" opacity="0.35" transform="rotate(-25 -16 10)" />
                <polygon points="-4,77 4,77 0,82" fill="#0284c7" />
              </g>

              {/* Oval Balloon (Warm Coral Rose) */}
              <g transform="translate(915, 450)">
                <ellipse cx="0" cy="0" rx="34" ry="44" fill="#fb7185" />
                <ellipse cx="-12" cy="-14" rx="8" ry="14" fill="#fff" opacity="0.4" transform="rotate(-20 -12 -14)" />
                <polygon points="-4,43 4,43 0,48" fill="#e11d48" />
              </g>

              {/* Heart Balloon (Vibrant Berry Magenta) */}
              <g transform="translate(880, 340)">
                <path
                  d="M 0,-15 C -25,-35 -40,-10 -40,15 C -40,40 -15,60 0,78 C 15,60 40,40 40,15 C 40,-10 25,-35 0,-15 Z"
                  fill="#ec4899"
                />
                <ellipse cx="-16" cy="10" rx="8" ry="14" fill="#fff" opacity="0.35" transform="rotate(-25 -16 10)" />
                <polygon points="-4,77 4,77 0,82" fill="#be185d" />
              </g>
            </g>
          </g>
        )}

        {/* 6. TABLE ITEMS: FIRMLY RESTING ON TABLE TOP (Base at y=438-445, ABOVE line y=470) */}

        {/* (A) REALISTIC BOTANICAL FLOWERS VASE 💐 (Sunflower, Hibiscus, Blossom, Lotus, Foliage) */}
        {activeItems.has('flowers') && (
          <g id="decor_flowers" transform="translate(260, 440)">
            {/* Vase Shadow on Tabletop (y=0 relative to base) */}
            <ellipse cx="0" cy="2" rx="32" ry="9" fill="#2d1d13" opacity="0.35" />

            {/* Elegant Ceramic Vase (Sage & Cream) */}
            <path
              d="M -20 -95 Q -32 -55 -30 -15 Q -28 0 0 0 Q 28 0 30 -15 Q 32 -55 20 -95 Z"
              fill="#fef9c3"
              stroke="#facc15"
              strokeWidth="2"
            />
            {/* Vase Fluted Rim */}
            <ellipse cx="0" cy="-95" rx="20" ry="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            <ellipse cx="0" cy="-95" rx="15" ry="3.5" fill="#713f12" opacity="0.4" />
            {/* Ceramic Glaze Reflection */}
            <path d="M -16 -75 Q -22 -40 -18 -10" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.65" />

            {/* Botanical Foliage & Stems */}
            <path d="M 0 -95 Q -30 -140 -50 -160" stroke="#15803d" strokeWidth="4" fill="none" />
            <path d="M 0 -95 Q -10 -150 -15 -190" stroke="#15803d" strokeWidth="4" fill="none" />
            <path d="M 0 -95 Q 25 -145 45 -175" stroke="#15803d" strokeWidth="4" fill="none" />
            {/* Eucalyptus & Fern Leaves */}
            <ellipse cx="-32" cy="-125" rx="14" ry="7" fill="#16a34a" transform="rotate(-40 -32 -125)" />
            <ellipse cx="28" cy="-130" rx="15" ry="8" fill="#16a34a" transform="rotate(35 28 -130)" />
            <ellipse cx="-10" cy="-145" rx="12" ry="6" fill="#22c55e" transform="rotate(25 -10 -145)" />

            {/* 1. SUNFLOWER 🌻 (Golden yellow petals, textured central seed disc) */}
            <g transform="translate(-45, -165)">
              {/* Petals ring */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <ellipse
                  key={`sun_pet_${deg}`}
                  cx="0"
                  cy="-18"
                  rx="6"
                  ry="14"
                  fill="#facc15"
                  stroke="#eab308"
                  strokeWidth="0.8"
                  transform={`rotate(${deg})`}
                />
              ))}
              {/* Center seed disc */}
              <circle cx="0" cy="0" r="14" fill="#78350f" />
              <circle cx="0" cy="0" r="11" fill="#451a03" />
              <circle cx="0" cy="0" r="7" fill="#b45309" opacity="0.6" />
            </g>

            {/* 2. HIBISCUS / PEONY 🌺 (Lush coral-red petals & golden stamen) */}
            <g transform="translate(-10, -195)">
              {/* Layered overlapping petals */}
              {[0, 72, 144, 216, 288].map((deg) => (
                <path
                  key={`hib_pet_${deg}`}
                  d="M 0 0 C -16 -18 -18 -32 0 -36 C 18 -32 16 -18 0 0 Z"
                  fill="#f43f5e"
                  stroke="#be123c"
                  strokeWidth="1"
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle cx="0" cy="0" r="8" fill="#9f1239" />
              {/* Golden stamen tip */}
              <line x1="0" y1="0" x2="6" y2="-16" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
              <circle cx="6" cy="-16" r="3" fill="#facc15" />
            </g>

            {/* 3. LOTUS / WATER LILY 🪷 (Delicate soft pink petals) */}
            <g transform="translate(42, -170)">
              {/* Petals */}
              {[-35, -20, 0, 20, 35].map((deg) => (
                <ellipse
                  key={`lot_pet_${deg}`}
                  cx="0"
                  cy="-16"
                  rx="7"
                  ry="18"
                  fill="#fbcfe8"
                  stroke="#f472b6"
                  strokeWidth="0.8"
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle cx="0" cy="0" r="7" fill="#fde047" />
            </g>

            {/* 4. CHERRY BLOSSOM / DAISY 🌸🌼 (White & blush pink blossoms) */}
            <g transform="translate(18, -130)">
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse
                  key={`sakura_${deg}`}
                  cx="0"
                  cy="-10"
                  rx="5"
                  ry="8"
                  fill="#fff"
                  stroke="#f472b6"
                  strokeWidth="0.6"
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle cx="0" cy="0" r="4" fill="#fbbf24" />
            </g>
          </g>
        )}

        {/* (B) MINI COMPANION CAKE 🧁 (Firmly on tabletop, base at y=442, x=710) */}
        {activeItems.has('mini_cake') && (
          <g id="decor_mini_cake" transform="translate(710, 442)">
            {/* Plate Shadow on Tabletop */}
            <ellipse cx="0" cy="2" rx="38" ry="10" fill="#2d1d13" opacity="0.32" />

            {/* Porcelain Plate */}
            <ellipse cx="0" cy="0" rx="38" ry="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.8" />
            <ellipse cx="0" cy="-1" rx="32" ry="7.5" fill="#f1f5f9" />

            {/* Cupcake Tart Shell */}
            <path
              d="M -18 -26 L -13 -3 Q 0 0 13 -3 L 18 -26 Z"
              fill="#fcd34d"
              stroke="#f59e0b"
              strokeWidth="1.2"
            />
            {/* Swirled Whipped Cream */}
            <ellipse cx="0" cy="-28" rx="22" ry="10" fill="#fff1f2" />
            <ellipse cx="0" cy="-35" rx="18" ry="8" fill="#ffe4e6" />
            <ellipse cx="0" cy="-42" rx="12" ry="6" fill="#ffffff" />

            {/* Fresh Strawberry on top! */}
            <polygon points="-6,-48 6,-48 0,-58" fill="#ef4444" rx="2" />
            <circle cx="0" cy="-50" r="6" fill="#ef4444" />
            <polygon points="-4,-58 0,-61 4,-58 0,-56" fill="#16a34a" />

            {/* Chocolate Drizzle & Rainbow sprinkles */}
            <circle cx="-8" cy="-34" r="1.5" fill="#3b82f6" />
            <circle cx="7" cy="-32" r="1.5" fill="#ec4899" />
            <circle cx="0" cy="-38" r="1.5" fill="#f59e0b" />
          </g>
        )}

        {/* (C) EXQUISITE MAIN CAKE 🎂 (Firmly on tabletop, base at y=445, center x=500) */}
        {activeItems.has('main_cake') && (
          <g id="decor_main_cake" transform="translate(500, 445)">
            {/* Pedestal Stand Shadow on Tabletop */}
            <ellipse cx="0" cy="2" rx="72" ry="15" fill="#2d1d13" opacity="0.38" />

            {/* Silver / White Ceramic Pedestal Stand */}
            <path
              d="M -16 -28 L -24 -2 Q 0 4 24 -2 L 16 -28 Z"
              fill="#cbd5e1"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            {/* Stand Platter Surface */}
            <ellipse cx="0" cy="-28" rx="86" ry="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            <ellipse cx="0" cy="-30" rx="80" ry="13" fill="#ffffff" />

            {/* CAKE BODY: Exquisite Multi-Tier Patisserie Style */}
            {/* Bottom Tier: Pistachio Mint Pastel */}
            <path
              d="M -66 -66 L -66 -35 Q 0 -15 66 -35 L 66 -66 Z"
              fill="#a7f3d0"
              stroke="#6ee7b7"
              strokeWidth="1"
            />
            {/* Middle Tier: Vanilla Cream & Lemon Chiffon */}
            <path
              d="M -66 -96 L -66 -65 Q 0 -45 66 -65 L 66 -96 Z"
              fill="#fef08a"
              stroke="#fde047"
              strokeWidth="1"
            />
            {/* Top Tier: Strawberry Rose Mousse */}
            <path
              d="M -66 -125 L -66 -95 Q 0 -75 66 -95 L 66 -125 Z"
              fill="#fbcfe8"
              stroke="#f472b6"
              strokeWidth="1"
            />

            {/* Velvet Cream Top Surface */}
            <ellipse cx="0" cy="-125" rx="66" ry="22" fill="#fff1f2" stroke="#f472b6" strokeWidth="1.2" />

            {/* Decorative Shell Piping along edges */}
            <path
              d="M -66 -125 
                 Q -55 -113 -44 -123 
                 Q -33 -112 -22 -124 
                 Q -11 -112 0 -124 
                 Q 11 -112 22 -124 
                 Q 33 -112 44 -123 
                 Q 55 -113 66 -125"
              fill="none"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Fresh Strawberries & Blueberries on Cake Top */}
            {[-38, -18, 18, 38].map((xPos, idx) => (
              <g key={`berry_${idx}`} transform={`translate(${xPos}, -128)`}>
                <circle cx="0" cy="0" r="5" fill="#ef4444" />
                <polygon points="-3,-5 0,-8 3,-5 0,-4" fill="#16a34a" />
              </g>
            ))}
            {[-28, 0, 28].map((xPos, idx) => (
              <circle key={`blueb_${idx}`} cx={xPos} cy="-122" r="3.5" fill="#3b82f6" />
            ))}

            {/* Golden Pearl Sprinkles */}
            {[
              { cx: -45, cy: -126 },
              { cx: -10, cy: -132 },
              { cx: 10, cy: -132 },
              { cx: 45, cy: -126 },
            ].map((p, i) => (
              <circle key={`pearl_${i}`} cx={p.cx} cy={p.cy} r="2" fill="#f59e0b" />
            ))}

            {/* TALL ELEGANT GOLDEN CELEBRATION CANDLES WITH ANIMATED FLAMES */}
            {/* Candle 1 (Left) */}
            <g id="candle_left">
              <rect x="-24" y="-170" width="6" height="42" rx="2" fill="url(#goldCandle)" stroke="#d97706" strokeWidth="0.8" />
              <line x1="-21" y1="-170" x2="-21" y2="-178" stroke="#78350f" strokeWidth="1.5" />
              {candleLit && (
                <g
                  style={{
                    transformOrigin: '-21px -178px',
                    transform: `skewX(${flameSkewX - 2}deg) scaleY(${flameScaleY * 0.95})`,
                    transition: 'transform 0.08s ease-out',
                  }}
                >
                  <circle cx="-21" cy="-188" r="22" fill="#f59e0b" opacity="0.35" filter="url(#candleGlow)" />
                  <path d="M -21 -202 Q -29 -186 -21 -178 Q -13 -186 -21 -202 Z" fill="#f97316" />
                  <path d="M -21 -196 Q -26 -185 -21 -179 Q -16 -185 -21 -196 Z" fill="#fef08a" />
                  <ellipse cx="-21" cy="-183" rx="2" ry="3.5" fill="#ffffff" />
                </g>
              )}
            </g>

            {/* Candle 2 (Center - Tallest) */}
            <g id="candle_center">
              <rect x="-3" y="-180" width="6" height="52" rx="2" fill="url(#goldCandle)" stroke="#d97706" strokeWidth="0.8" />
              <line x1="0" y1="-180" x2="0" y2="-188" stroke="#78350f" strokeWidth="1.5" />
              {candleLit && (
                <g
                  style={{
                    transformOrigin: '0px -188px',
                    transform: `skewX(${flameSkewX}deg) scaleY(${flameScaleY * 1.05})`,
                    transition: 'transform 0.08s ease-out',
                  }}
                >
                  <circle cx="0" cy="-198" r="26" fill="#f59e0b" opacity="0.38" filter="url(#candleGlow)" />
                  <path d="M 0 -214 Q -9 -196 0 -188 Q 9 -196 0 -214 Z" fill="#f97316" />
                  <path d="M 0 -206 Q -6 -195 0 -189 Q 6 -195 0 -206 Z" fill="#fef08a" />
                  <ellipse cx="0" cy="-193" rx="2.5" ry="4" fill="#ffffff" />
                </g>
              )}
            </g>

            {/* Candle 3 (Right) */}
            <g id="candle_right">
              <rect x="18" y="-170" width="6" height="42" rx="2" fill="url(#goldCandle)" stroke="#d97706" strokeWidth="0.8" />
              <line x1="21" y1="-170" x2="21" y2="-178" stroke="#78350f" strokeWidth="1.5" />
              {candleLit && (
                <g
                  style={{
                    transformOrigin: '21px -178px',
                    transform: `skewX(${flameSkewX + 2}deg) scaleY(${flameScaleY * 0.92})`,
                    transition: 'transform 0.08s ease-out',
                  }}
                >
                  <circle cx="21" cy="-188" r="22" fill="#f59e0b" opacity="0.35" filter="url(#candleGlow)" />
                  <path d="M 21 -202 Q 13 -186 21 -178 Q 29 -186 21 -202 Z" fill="#f97316" />
                  <path d="M 21 -196 Q 16 -185 21 -179 Q 26 -185 21 -196 Z" fill="#fef08a" />
                  <ellipse cx="21" cy="-183" rx="2" ry="3.5" fill="#ffffff" />
                </g>
              )}
            </g>

            {/* Smoke Puff when extinguished */}
            {!candleLit && (
              <g opacity="0.75" filter="url(#softGlow)">
                <circle cx="-21" cy="-185" r="9" fill="#e2e8f0" />
                <circle cx="0" cy="-195" r="11" fill="#e2e8f0" />
                <circle cx="21" cy="-185" r="9" fill="#e2e8f0" />
              </g>
            )}
          </g>
        )}

        {/* 7. SCATTERED CONFETTI ON TABLETOP */}
        {(isCelebrating || activeItems.size >= 4) && (
          <g id="table_confetti" opacity="0.85">
            {[
              { cx: 320, cy: 450, r: 3, col: '#f43f5e' },
              { cx: 380, cy: 458, r: 2.5, col: '#3b82f6' },
              { cx: 450, cy: 462, r: 3, col: '#eab308' },
              { cx: 580, cy: 460, r: 2.5, col: '#10b981' },
              { cx: 640, cy: 454, r: 3, col: '#a855f7' },
              { cx: 690, cy: 458, r: 2.5, col: '#f97316' },
            ].map((c, i) => (
              <circle key={`conf_${i}`} cx={c.cx} cy={c.cy} r={c.r} fill={c.col} />
            ))}
          </g>
        )}
      </svg>

      {/* INTERACTIVE GUIDED HOTSPOT (Clean, unobtrusive) */}
      {stage === 'DECORATING' && highlightItem && (
        <div className="absolute inset-0 z-40 pointer-events-auto">
          <HotspotButton
            item={highlightItem}
            onClick={() => onHotspotClick(highlightItem)}
          />
        </div>
      )}

      {/* WISH STAGE ROOM DARKENING & CANDLELIGHT RADIAL ILLUMINATION */}
      <AnimatePresence>
        {isWishing && (
          <motion.div
            key="wishing_overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 z-35 pointer-events-none"
            style={{
              background: candleLit
                ? 'radial-gradient(circle at 50% 46%, rgba(254, 240, 138, 0.3) 0%, rgba(245, 158, 11, 0.16) 28%, rgba(15, 23, 42, 0.88) 75%, rgba(2, 6, 23, 0.95) 100%)'
                : 'rgba(2, 6, 23, 0.92)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface HotspotButtonProps {
  item: StepId;
  onClick: () => void;
}

const HotspotButton: React.FC<HotspotButtonProps> = ({ item, onClick }) => {
  // Coordinates corresponding to the updated positions:
  // - lights: top wall
  // - banner: mid wall
  // - balloons: bottom left on ground
  // - flowers: left tabletop (firmly above line)
  // - main_cake: center tabletop (firmly above line)
  // - mini_cake: right tabletop (firmly above line)
  const coords: Record<StepId, { top: string; left: string; text: string }> = {
    lights: { top: '15%', left: '50%', text: '✨ 点击挂上彩灯' },
    banner: { top: '25%', left: '50%', text: '🎊 点击拉起生日彩带' },
    balloons: { top: '65%', left: '12%', text: '🎈 点击摆放彩色气球' },
    flowers: { top: '50%', left: '26%', text: '💐 点击摆上鲜花' },
    mini_cake: { top: '52%', left: '72%', text: '🧁 点击放上小蛋糕' },
    main_cake: { top: '46%', left: '50%', text: '🎂 点击放上大蛋糕' },
  };

  const pos = coords[item];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      style={{ top: pos.top, left: pos.left }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [1, 1.08, 1], opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 rounded-full"
    >
      <div className="relative flex items-center justify-center">
        <span className="absolute w-20 h-20 bg-amber-400/40 rounded-full animate-ping pointer-events-none" />
        <span className="absolute w-14 h-14 bg-amber-300/60 rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2 px-4 py-2.5 bg-white/95 text-stone-900 text-xs sm:text-sm font-bold rounded-full shadow-2xl border-2 border-amber-400 backdrop-blur-sm group-hover:scale-110 group-active:scale-95 transition-transform whitespace-nowrap">
          <span className="text-base sm:text-lg animate-bounce">👉</span>
          <span>{pos.text}</span>
        </div>
      </div>
    </motion.button>
  );
};
