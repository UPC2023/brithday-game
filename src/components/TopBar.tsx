import React from 'react';
import { Volume2, VolumeX, RotateCcw, Cake, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { GameStage } from '../types/game';

interface TopBarProps {
  stage: GameStage;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  stage,
  isMuted,
  onToggleMute,
  onRestart,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
      {/* Brand title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-white shadow-sm shrink-0">
          <Cake className="w-4 h-4" />
        </div>
        <div>
          <h1 className="font-bold text-sm sm:text-base text-stone-900 tracking-tight leading-tight">
            生日布置小游戏
          </h1>
          <p className="text-[11px] text-stone-500 hidden sm:block">
            {stage === 'DECORATING' && '亲手装点温馨生日房间'}
            {stage === 'WISHING' && '闭眼许愿，感应吹灭蜡烛'}
            {stage === 'CELEBRATING' && '烟花礼炮与温馨祝福'}
          </p>
        </div>
      </div>

      {/* Stage chip (unboxed clean tag) */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-600 bg-white/70 px-3 py-1 rounded-full border border-stone-200/60 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>
          {stage === 'DECORATING' && '布置中'}
          {stage === 'WISHING' && '许愿时刻'}
          {stage === 'CELEBRATING' && '庆祝时刻'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? '开启音效' : '静音'}
          className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 border border-stone-200/80 text-stone-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          title={isMuted ? '开启音效' : '静音'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
        </button>

        <button
          type="button"
          onClick={onRestart}
          aria-label="重新开始"
          className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 border border-stone-200/80 text-stone-600 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          title="重新开始"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
