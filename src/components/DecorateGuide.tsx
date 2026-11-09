import React from 'react';
import { motion } from 'motion/react';
import { StepId, DecorItem } from '../types/game';
import { Check, Sparkles, Wand2 } from 'lucide-react';

export const DECOR_ITEMS: DecorItem[] = [
  {
    id: 'lights',
    name: '墙上彩灯',
    icon: '✨',
    hintText: '挂上一串串温暖梦幻的小彩灯',
    roomHotspot: { top: '15%', left: '50%', label: '墙上彩灯' },
  },
  {
    id: 'banner',
    name: '生日彩带',
    icon: '🎊',
    hintText: '拉起色彩斑斓的“HAPPY BIRTHDAY”横幅',
    roomHotspot: { top: '23%', left: '50%', label: 'HAPPY BIRTHDAY' },
  },
  {
    id: 'balloons',
    name: '彩色气球',
    icon: '🎈',
    hintText: '在桌边系上一大束漂浮的彩色气球',
    roomHotspot: { top: '35%', left: '15%', label: '彩色气球' },
  },
  {
    id: 'flowers',
    name: '桌上花束',
    icon: '💐',
    hintText: '在桌上摆上一瓶盛开的鲜花与玫瑰',
    roomHotspot: { top: '56%', left: '26%', label: '桌上花束' },
  },
  {
    id: 'mini_cake',
    name: '小蛋糕',
    icon: '🧁',
    hintText: '在桌旁放上一块精致的草莓小甜点',
    roomHotspot: { top: '60%', left: '72%', label: '小蛋糕' },
  },
  {
    id: 'main_cake',
    name: '大蛋糕',
    icon: '🎂',
    hintText: '摆上重头戏：精致美味的生日大蛋糕！',
    roomHotspot: { top: '55%', left: '50%', label: '大蛋糕' },
  },
];

interface DecorateGuideProps {
  activeItems: Set<StepId>;
  onSelectItem: (id: StepId) => void;
  onAutoDecorateAll: () => void;
}

export const DecorateGuide: React.FC<DecorateGuideProps> = ({
  activeItems,
  onSelectItem,
  onAutoDecorateAll,
}) => {
  const currentStep = DECOR_ITEMS.find((it) => !activeItems.has(it.id));
  const progressPercent = Math.round((activeItems.size / DECOR_ITEMS.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto mt-3 px-3 sm:px-4">
      {/* Step guidance banner */}
      <div className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-sm border border-stone-200/80 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">
            {currentStep ? currentStep.icon : '🎉'}
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-2">
              <span>{currentStep ? `第 ${activeItems.size + 1} 步：${currentStep.name}` : '装点全部完成！'}</span>
              <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 font-medium rounded-md">
                {activeItems.size} / {DECOR_ITEMS.length}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {currentStep ? `${currentStep.hintText}（可点击房间提示或下方按钮）` : '准备进入暗灯吹蜡烛许愿环节啦！'}
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {activeItems.size < DECOR_ITEMS.length && (
            <button
              type="button"
              onClick={onAutoDecorateAll}
              className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              title="一键摆好全部装饰"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>一键布置</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-stone-200/70 h-1.5 rounded-full overflow-hidden mb-3">
        <motion.div
          className="bg-gradient-to-r from-amber-400 to-rose-400 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Item Dock Buttons */}
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        {DECOR_ITEMS.map((item) => {
          const isDone = activeItems.has(item.id);
          const isCurrent = currentStep?.id === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item.id)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
                isDone
                  ? 'bg-amber-50 border border-amber-200 text-stone-800'
                  : isCurrent
                  ? 'bg-white ring-2 ring-amber-400 border border-transparent shadow-md scale-105'
                  : 'bg-white/60 hover:bg-white/90 border border-stone-200/60 text-stone-400'
              }`}
            >
              {isDone && (
                <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
              {isCurrent && !isDone && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              )}
              <span className="text-xl sm:text-2xl mb-1">{item.icon}</span>
              <span className="text-[11px] sm:text-xs font-medium truncate max-w-full">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
