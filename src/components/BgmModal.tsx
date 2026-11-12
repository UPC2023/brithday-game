import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Music,
  Upload,
  Check,
  X,
  Play,
  Pause,
  Gamepad2,
  HeartHandshake,
  AlertTriangle,
  RotateCcw,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { sound, BgmScene, AudioController } from '../utils/audio';
import { CANDIDATE_AUDIO_TRACKS, DEFAULT_AUDIO_CONFIG, AudioTrackItem } from '../config/audioConfig';

interface BgmModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScene?: BgmScene;
}

export const BgmModal: React.FC<BgmModalProps> = ({ isOpen, onClose, initialScene = 'game' }) => {
  const [activeTab, setActiveTab] = useState<BgmScene>(initialScene);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Verification & Error states
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyingTarget, setVerifyingTarget] = useState<string | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Sync state with audio controller
  const [, setTick] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialScene);
      setCustomError(null);
      setSuccessNotice(null);
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
  const activeError = sound.getLastError(activeTab) || customError;
  const defaultTrack = DEFAULT_AUDIO_CONFIG[activeTab];

  // Select candidate track immediately with reactive error capture
  const handleSelectTrack = (track: AudioTrackItem) => {
    setCustomError(null);
    sound.clearError(activeTab);
    if (sound.isMuted) {
      sound.isMuted = false;
    }
    sound.selectCandidateTrack(activeTab, track);
    setSuccessNotice(`已启用: ${track.name} - ${track.artist}`);
    setTimeout(() => setSuccessNotice(null), 2500);
  };

  // Preload check and handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVerifying(true);
    setVerifyingTarget('local_file');
    setCustomError(null);
    setSuccessNotice(null);

    try {
      // Audio preload verification check on uploaded file
      const result = await AudioController.checkAudioFilePlayable(file);
      if (!result.ok) {
        const errorMsg =
          result.error ||
          '上传的音频解码失败。如果您是从视频提取的音轨，可能编码仍为视频封装格式（伪MP3），浏览器无法播放。';
        setCustomError(errorMsg);
        sound.lastErrors[activeTab] = errorMsg;
        setTick((t) => t + 1);
        return;
      }

      // Passed preload check
      if (sound.isMuted) {
        sound.isMuted = false;
      }
      sound.setCustomAudioFile(activeTab, file);
      setSuccessNotice(`上传成功并已切换: ${file.name}`);
      setTimeout(() => setSuccessNotice(null), 3000);
    } catch {
      const errorMsg = '上传音频解析异常，请尝试转换为标准 MP3 或 AAC 后再上传';
      setCustomError(errorMsg);
      sound.lastErrors[activeTab] = errorMsg;
      setTick((t) => t + 1);
    } finally {
      setIsVerifying(false);
      setVerifyingTarget(null);
      // Reset input value so re-selecting same file triggers onChange
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Restore Default Track
  const handleResetToDefault = () => {
    setCustomError(null);
    sound.clearError(activeTab);
    if (sound.isMuted) {
      sound.isMuted = false;
    }
    sound.resetToDefaultTrack(activeTab);
    setSuccessNotice(`已恢复默认音乐: ${defaultTrack.name}`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleTogglePlay = () => {
    setCustomError(null);
    sound.clearError(activeTab);
    if (sound.isMuted) {
      sound.isMuted = false;
    }

    if (isThisSceneActive) {
      if (sound.isMusicPlaying) {
        sound.stopBGM();
      } else {
        sound.resumeBGM();
      }
    } else {
      sound.setScene(activeTab);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 text-stone-800 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0">
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
            aria-label="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scene Tabs (Game Stage vs Greeting Card Stage) */}
        <div className="my-3 p-1 bg-stone-100 rounded-2xl grid grid-cols-2 gap-1 select-none shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('game');
              setCustomError(null);
            }}
            className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'game'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>游戏布置界面</span>
            {sound.activeScene === 'game' && !activeError && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="当前主界面正在播放" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('card');
              setCustomError(null);
            }}
            className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>贺卡祝福界面</span>
            {sound.activeScene === 'card' && !activeError && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="当前主界面正在播放" />
            )}
          </button>
        </div>

        {/* Error Notification Alert Banner */}
        <AnimatePresence>
          {activeError && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 shadow-xs shrink-0"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-xl bg-rose-100 text-rose-600 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-rose-900">
                      音频文件无法播放
                    </span>
                    <span className="text-[10px] text-rose-500 px-1.5 py-0.5 bg-rose-100/70 rounded-md font-mono">
                      加载异常
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                    {activeError}
                  </p>
                  <p className="text-[11px] text-rose-600/80 mt-1">
                    💡 提示：从视频网站直接提取的音频若未重新编码，浏览器可能无法解码该封装。建议切换回默认或重新转码为标准 MP3。
                  </p>

                  {/* Quick Switch Back to Default Button */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetToDefault}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>切换回默认音乐 ({defaultTrack.name})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomError(null);
                        sound.clearError(activeTab);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs transition-colors cursor-pointer"
                    >
                      忽略提示
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Notice Banner */}
        <AnimatePresence>
          {successNotice && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-2.5 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-xs shrink-0"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium truncate">{successNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Playing Status Bar for Selected Scene */}
        <div
          className={`mb-3 p-3 rounded-2xl border flex items-center justify-between transition-colors shrink-0 ${
            activeError
              ? 'bg-rose-50/70 border-rose-200'
              : activeTab === 'game'
              ? 'bg-amber-50/80 border-amber-200/80'
              : 'bg-purple-50/80 border-purple-200/80'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-xl animate-bounce">
              {activeError ? '⚠️' : activeTab === 'game' ? '🎈' : '💌'}
            </span>
            <div className="truncate">
              <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                <span>{activeTab === 'game' ? '游戏页当前音乐' : '贺卡页当前音乐'}</span>
                {isThisSceneActive && !activeError && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-200/70 text-stone-600 font-medium">
                    当前正在播放
                  </span>
                )}
                {activeError && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-rose-200 text-rose-800 font-medium">
                    播放异常
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-stone-900 truncate">
                {currentTrackName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`px-3.5 py-1.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
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
        </div>

        {/* Candidate Audio Tracks from /public/audio/ */}
        <div className="space-y-2 mb-3 overflow-y-auto pr-1 flex-1 min-h-[160px]">
          <div className="text-xs font-semibold text-stone-500 px-1 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs py-1 z-10">
            <span>备选音乐库</span>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-[11px] text-stone-400 hover:text-stone-700 underline cursor-pointer"
            >
              一键重置为默认
            </button>
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
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <span>{track.name}</span>
                      {track.id === defaultTrack.trackId && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-200/70 text-stone-600 font-normal">
                          {activeTab === 'game' ? '游戏默认' : '贺卡默认'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">{track.artist}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSelected && (
                    <div
                      className={`w-6 h-6 rounded-full text-white flex items-center justify-center ${
                        activeTab === 'game' ? 'bg-amber-500' : 'bg-purple-600'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Local Audio Upload */}
        <div className="pt-2.5 border-t border-stone-100 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg"
            className="hidden"
          />

          <button
            type="button"
            disabled={isVerifying}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer ${
              activeTab === 'game'
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:opacity-95'
            } ${isVerifying ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isVerifying && verifyingTarget === 'local_file' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>正在预加载并验证音频格式...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>
                  {activeTab === 'game' ? '上传游戏页自定义音频 (MP3/M4A)' : '上传贺卡页自定义音频 (MP3/M4A)'}
                </span>
              </>
            )}
          </button>
          <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 px-1">
            <span>💡 自动通过预加载校验格式与可播放性</span>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              恢复当前页默认
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

