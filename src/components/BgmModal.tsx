import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Music, Upload, Check, X, Play, Pause, Gamepad2, HeartHandshake } from 'lucide-react';
import { sound, BgmScene } from '../utils/audio';
import { CANDIDATE_AUDIO_TRACKS, AudioTrackItem } from '../config/audioConfig';

interface BgmModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScene?: BgmScene;
}

export const BgmModal: React.FC<BgmModalProps> = ({ isOpen, onClose, initialScene = 'game' }) => {
  const [activeTab, setActiveTab] = useState<BgmScene>(initialScene);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state with audio controller
  const [, setTick] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialScene);
    }
  }, [isOpen, initialScene]);

  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1);
    sound.onStateChange = handleUpdate;
    return () => {
      sound.onStateChange = undefined;
    };
  }, []);

  if (!isOpen) return null;

  const currentTrackId = sound.getTrackId(activeTab);
  const currentTrackName = sound.getTrackName(activeTab);
  const isThisSceneActive = sound.activeScene === activeTab;
  const isPlaying = isThisSceneActive && sound.isMusicPlaying && !sound.isMuted;

  const handleSelectTrack = (track: AudioTrackItem) => {
    sound.selectCandidateTrack(activeTab, track);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.setCustomAudioFile(activeTab, file);
    }
  };

  const handleTogglePlay = () => {
    if (isThisSceneActive) {
      if (sound.isMusicPlaying) {
        sound.stopBGM();
      } else {
        sound.resumeBGM();
      }
    } else {
      // Switch active scene and play
      sound.setScene(activeTab);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 text-stone-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 to-amber-400 text-white flex items-center justify-center shadow-xs">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900">选择背景音乐</h3>
              <p className="text-xs text-stone-500">游戏页与贺卡页均可自由指定不同音乐</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scene Tabs (Game Stage vs Greeting Card Stage) */}
        <div className="my-3.5 p-1 bg-stone-100 rounded-2xl grid grid-cols-2 gap-1 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('game')}
            className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'game'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>游戏布置界面</span>
            {sound.activeScene === 'game' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="当前主界面正在播放" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>贺卡祝福界面</span>
            {sound.activeScene === 'card' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="当前主界面正在播放" />
            )}
          </button>
        </div>

        {/* Current Playing Status Bar for Selected Scene */}
        <div
          className={`mb-3.5 p-3 rounded-2xl border flex items-center justify-between transition-colors ${
            activeTab === 'game'
              ? 'bg-amber-50/80 border-amber-200/80'
              : 'bg-purple-50/80 border-purple-200/80'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-xl animate-bounce">
              {activeTab === 'game' ? '🎈' : '💌'}
            </span>
            <div className="truncate">
              <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                <span>{activeTab === 'game' ? '游戏页当前音乐' : '贺卡页当前音乐'}</span>
                {isThisSceneActive && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-200/70 text-stone-600 font-medium">
                    当前正在播放
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-stone-900 truncate">{currentTrackName}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTogglePlay}
            className={`px-3 py-1.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0 ${
              activeTab === 'game'
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>暂停</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{isThisSceneActive ? '播放' : '试听'}</span>
              </>
            )}
          </button>
        </div>

        {/* Candidate Audio Tracks from /public/audio/ */}
        <div className="space-y-2 mb-3.5 max-h-[250px] overflow-y-auto pr-1">
          <div className="text-xs font-semibold text-stone-500 px-1 flex items-center justify-between">
            <span>备选音乐库（点击指定为当前页音乐）：</span>
            <span className="text-[11px] text-stone-400">
              {activeTab === 'game' ? '默认: Celebrate' : '默认: Birthday Wish'}
            </span>
          </div>

          {CANDIDATE_AUDIO_TRACKS.map((track) => {
            const isSelected = currentTrackId === track.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => handleSelectTrack(track)}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? activeTab === 'game'
                      ? 'bg-amber-50/90 border-amber-400 shadow-xs ring-1 ring-amber-300'
                      : 'bg-purple-50/90 border-purple-400 shadow-xs ring-1 ring-purple-300'
                    : 'bg-stone-50/80 hover:bg-stone-100/90 border-stone-200/70 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{track.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-stone-900">{track.name}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{track.artist}</div>
                  </div>
                </div>
                {isSelected && (
                  <div
                    className={`w-6 h-6 rounded-full text-white flex items-center justify-center shrink-0 ${
                      activeTab === 'game' ? 'bg-amber-500' : 'bg-purple-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Local Audio Upload */}
        <div className="pt-2.5 border-t border-stone-100">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer ${
              activeTab === 'game'
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:opacity-95'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>
              {activeTab === 'game' ? '上传游戏页自定义音频 (MP3/M4A)' : '上传贺卡页自定义音频 (MP3/M4A)'}
            </span>
          </button>
          <p className="text-[11px] text-stone-400 text-center mt-2">
            💡 支持直接挑选本地歌曲替换当前页面音乐
          </p>
        </div>
      </motion.div>
    </div>
  );
};
