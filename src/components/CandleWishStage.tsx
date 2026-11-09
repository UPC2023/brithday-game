import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, Wind, Sparkles } from 'lucide-react';
import { MicBlowDetector } from '../utils/micBlowDetector';
import { sound } from '../utils/audio';

interface CandleWishStageProps {
  onExtinguish: () => void;
  candleLit: boolean;
  onBlowIntensityChange: (level: number) => void;
}

export const CandleWishStage: React.FC<CandleWishStageProps> = ({
  onExtinguish,
  candleLit,
  onBlowIntensityChange,
}) => {
  const [micActive, setMicActive] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [micLevel, setMicLevel] = useState<number>(0);
  const [wishMade, setWishMade] = useState<boolean>(false);
  const detectorRef = useRef<MicBlowDetector | null>(null);

  // Auto-initiate microphone check on mount
  useEffect(() => {
    let detector: MicBlowDetector | null = null;

    const startMic = async () => {
      detector = new MicBlowDetector({
        onLevelChange: (lvl) => {
          setMicLevel(lvl);
          onBlowIntensityChange(lvl);
        },
        onBlowTrigger: () => {
          handleExtinguish('mic');
        },
        onError: (err) => {
          setMicError(err);
          setMicActive(false);
        },
      });
      detectorRef.current = detector;

      // Attempt start
      const success = await detector.start();
      if (success) {
        setMicActive(true);
        setMicError(null);
      }
    };

    startMic();

    return () => {
      detector?.stop();
      onBlowIntensityChange(0);
    };
  }, []);

  const handleExtinguish = (source: 'mic' | 'button') => {
    sound.playBlow();
    detectorRef.current?.stop();
    setMicActive(false);
    onExtinguish();
  };

  const manualBlowPress = () => {
    // Simulate puff reaction before extinguish
    onBlowIntensityChange(0.9);
    setTimeout(() => {
      handleExtinguish('button');
    }, 280);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 mt-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-stone-900/90 text-stone-100 p-4 sm:p-5 rounded-3xl border border-amber-500/30 shadow-2xl backdrop-blur-md text-center"
      >
        {/* Wish Header */}
        <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-base sm:text-lg mb-1">
          <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>许愿吹蜡烛时刻</span>
          <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <p className="text-stone-300 text-xs sm:text-sm mb-4 leading-relaxed max-w-md mx-auto">
          闭上双眼，在心中默许一个美好的生日愿望...
        </p>

        {/* Blow Sensor Live Indicator */}
        <div className="bg-stone-800/80 rounded-2xl p-3 mb-4 border border-stone-700 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs text-stone-300 mb-1.5">
            <div className="flex items-center gap-1.5">
              {micActive ? (
                <>
                  <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 font-medium">麦克风已就绪：对着手机吹气</span>
                </>
              ) : (
                <>
                  <MicOff className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-stone-400">麦克风未开启（可直接点击吹灭）</span>
                </>
              )}
            </div>
            <span className="font-mono text-amber-400">{Math.round(micLevel * 100)}%</span>
          </div>

          {/* Blow level bar */}
          <div className="w-full bg-stone-700 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-75 rounded-full ${
                micLevel > 0.4 ? 'bg-gradient-to-r from-amber-400 to-rose-500' : 'bg-amber-400/80'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, micLevel * 100))}%` }}
            />
          </div>

          {micError && (
            <p className="text-[11px] text-amber-300/80 mt-1.5 text-left">
              💡 提示：{micError}
            </p>
          )}
        </div>

        {/* Extinguish Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={manualBlowPress}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 hover:from-amber-300 hover:to-rose-300 text-stone-900 font-extrabold text-sm sm:text-base shadow-lg hover:shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Wind className="w-5 h-5 animate-pulse" />
            <span>吹灭蜡烛 💨</span>
          </button>
        </div>

        <div className="text-[11px] text-stone-400 mt-2">
          ✨ 吹一口气，或者直接轻点按钮，愿望马上成真！
        </div>
      </motion.div>
    </div>
  );
};
