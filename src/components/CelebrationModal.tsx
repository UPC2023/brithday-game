import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, RotateCcw, Volume2, VolumeX, Edit3, Check, PartyPopper, Music } from 'lucide-react';
import { sound } from '../utils/audio';
import { BlessingContent } from '../types/game';

interface CelebrationModalProps {
  onRestart: () => void;
  onOpenBgm: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ onRestart, onOpenBgm }) => {
  const [blessing, setBlessing] = useState<BlessingContent>({
    recipient: '妈妈',
    age: 59,
    mainBlessing: '祝妈妈生日快乐，妈妈身体健康，笑口常开，夜夜好眠，永远健康快乐。',
    subBlessing: '走过五十九载春华秋实，您总是把最好的温柔留给我们。愿您今后的每一个日子，平安喜乐，岁岁无忧，被世界温柔以待！',
    sender: '爱您的全家人',
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(true);
  const [trackName, setTrackName] = useState<string>(sound.getTrackName('card'));

  // Trigger grand fireworks and confetti show
  const fireFireworks = () => {
    sound.playFirework();

    confetti({
      particleCount: 50,
      angle: 60,
      spread: 60,
      origin: { x: 0.1, y: 0.75 },
      colors: ['#c084fc', '#f43f5e', '#fbbf24', '#e879f9', '#818cf8'],
    });

    confetti({
      particleCount: 50,
      angle: 120,
      spread: 60,
      origin: { x: 0.9, y: 0.75 },
      colors: ['#c084fc', '#f43f5e', '#fbbf24', '#e879f9', '#818cf8'],
    });

    confetti({
      particleCount: 45,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      shapes: ['star', 'circle'],
      colors: ['#ffd700', '#c084fc', '#f472b6', '#a855f7'],
    });
  };

  useEffect(() => {
    sound.playCheer();
    sound.setScene('card');
    setIsMusicPlaying(sound.isMusicPlaying && !sound.isMuted);
    setTrackName(sound.getTrackName('card'));

    const updateAudioState = () => {
      setTrackName(sound.getTrackName('card'));
      setIsMusicPlaying(sound.isMusicPlaying && !sound.isMuted);
    };
    sound.onStateChange = updateAudioState;

    fireFireworks();
    const t1 = setTimeout(fireFireworks, 800);
    const t2 = setTimeout(fireFireworks, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      sound.onStateChange = undefined;
    };
  }, []);

  const toggleMusic = () => {
    if (isMusicPlaying) {
      sound.stopBGM();
      setIsMusicPlaying(false);
    } else {
      sound.resumeBGM();
      setIsMusicPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 120 }}
        className="relative w-full max-w-lg bg-gradient-to-b from-[#180b2b] via-[#210e3d] to-[#120722] rounded-3xl p-5 sm:p-7 shadow-2xl border border-purple-500/40 text-purple-100 my-auto overflow-hidden"
      >
        {/* Subtle Ethereal Scorpion Celestial Graphic from reference image */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <img
            src="/assets/aistudio/image_ced6fde2.png"
            alt="Celestial Stardust Artwork"
            className="w-full h-full object-cover opacity-25 mix-blend-screen scale-110 filter brightness-110 contrast-125"
          />
        </div>

        {/* Ambient Constellation Stars & Stardust overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            {/* Celestial asterism connecting starlight points */}
            <polyline
              points="110,170 150,185 195,205 225,235 250,270 260,320 290,350 330,360 360,345 375,305 355,280"
              fill="none"
              stroke="#c084fc"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            {/* Pulsing focal stars */}
            {[
              { cx: 110, cy: 170, r: 2.5 },
              { cx: 150, cy: 185, r: 2 },
              { cx: 195, cy: 205, r: 4, bright: true }, // Heart star
              { cx: 225, cy: 235, r: 2.5 },
              { cx: 250, cy: 270, r: 2.5 },
              { cx: 260, cy: 320, r: 2 },
              { cx: 290, cy: 350, r: 2.5 },
              { cx: 330, cy: 360, r: 2.5 },
              { cx: 360, cy: 345, r: 2 },
              { cx: 375, cy: 305, r: 3 },
              { cx: 355, cy: 280, r: 3.5 },
            ].map((st, i) => (
              <g key={`star_${i}`}>
                <circle cx={st.cx} cy={st.cy} r={st.r} fill={st.bright ? '#fde047' : '#e9d5ff'} />
                <circle cx={st.cx} cy={st.cy} r={st.r * 2.5} fill={st.bright ? '#f59e0b' : '#c084fc'} opacity="0.4" />
              </g>
            ))}
          </svg>
        </div>

        {/* Floating Celebration Header Badge (No explicit text, poetic & subtle) */}
        <div className="relative z-10 flex items-center justify-center -mt-1 mb-3">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-800/90 via-indigo-700/90 to-purple-800/90 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg border border-purple-400/30 whitespace-nowrap backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="tracking-wide">星光祈愿 · 岁岁常欢</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
        </div>

        {/* Music & Edit utility controls */}
        <div className="flex items-center justify-between mb-3 text-purple-300 text-xs relative z-10 gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMusic}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 text-purple-200 border border-purple-700/40 transition-colors cursor-pointer"
            >
              {isMusicPlaying ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
              <span className="max-w-[110px] sm:max-w-[140px] truncate">{trackName}</span>
            </button>

            <button
              type="button"
              onClick={onOpenBgm}
              className="px-2 py-1 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-amber-300 border border-purple-700/40 text-[11px] font-medium transition-colors cursor-pointer"
              title="切换歌曲或上传本地MP3"
            >
              换歌
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 text-purple-200 border border-purple-700/40 transition-colors cursor-pointer shrink-0"
          >
            {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5 text-amber-300" />}
            <span>{isEditing ? '保存修改' : '修改祝福'}</span>
          </button>
        </div>

        {/* Greeting Letter Body */}
        <div className="relative z-10 bg-purple-950/50 rounded-2xl p-4 sm:p-6 border border-purple-500/30 shadow-inner backdrop-blur-md">
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-1.5 text-amber-300 font-bold text-xs tracking-wider uppercase mb-1">
              <Heart className="w-3 h-3 fill-amber-300 text-amber-300" />
              <span>Happy Birthday</span>
              <Heart className="w-3 h-3 fill-amber-300 text-amber-300" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 font-serif tracking-tight">
              {blessing.recipient} {blessing.age} 岁生日快乐
            </h2>
          </div>

          {isEditing ? (
            <div className="space-y-3 text-left">
              <div>
                <label className="text-xs font-semibold text-purple-300 block mb-1">称呼与年龄：</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={blessing.recipient}
                    onChange={(e) => setBlessing({ ...blessing, recipient: e.target.value })}
                    className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-purple-700 bg-purple-950/80 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="称呼"
                  />
                  <input
                    type="number"
                    value={blessing.age}
                    onChange={(e) => setBlessing({ ...blessing, age: Number(e.target.value) || 59 })}
                    className="w-20 px-3 py-1.5 text-sm rounded-lg border border-purple-700 bg-purple-950/80 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="年龄"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-purple-300 block mb-1">主要祝福语：</label>
                <textarea
                  rows={2}
                  value={blessing.mainBlessing}
                  onChange={(e) => setBlessing({ ...blessing, mainBlessing: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-purple-700 bg-purple-950/80 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-purple-300 block mb-1">温情寄语：</label>
                <textarea
                  rows={3}
                  value={blessing.subBlessing}
                  onChange={(e) => setBlessing({ ...blessing, subBlessing: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-purple-700 bg-purple-950/80 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-purple-300 block mb-1">落款：</label>
                <input
                  type="text"
                  value={blessing.sender}
                  onChange={(e) => setBlessing({ ...blessing, sender: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-purple-700 bg-purple-950/80 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
              >
                保存贺卡
              </button>
            </div>
          ) : (
            <div className="space-y-3.5 text-center">
              <div className="bg-purple-950/70 border border-purple-500/30 p-3 sm:p-4 rounded-xl text-amber-200 font-medium text-sm sm:text-base leading-relaxed font-serif shadow-sm">
                “{blessing.mainBlessing}”
              </div>

              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-serif">
                {blessing.subBlessing}
              </p>

              <div className="pt-1 text-right text-xs sm:text-sm font-semibold text-amber-300">
                — {blessing.sender} 敬上 💐
              </div>
            </div>
          )}
        </div>

        {/* Interactive Action Buttons */}
        <div className="relative z-10 mt-5 flex items-center justify-center gap-4">
          {/* Firework button: clean celebratory party popper icon */}
          <button
            type="button"
            onClick={fireFireworks}
            aria-label="放礼炮"
            title="放礼炮"
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 hover:scale-105 active:scale-95 text-white shadow-lg flex items-center justify-center cursor-pointer transition-transform border border-amber-300/40"
          >
            <PartyPopper className="w-6 h-6 stroke-[2.2]" />
          </button>

          {/* Re-decorate / Restart */}
          <button
            type="button"
            onClick={onRestart}
            className="px-5 py-3 rounded-2xl bg-purple-950/70 hover:bg-purple-900/80 text-purple-200 hover:text-white font-bold text-xs sm:text-sm border border-purple-600/50 shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-purple-300" />
            <span>再布置一次 ↺</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
