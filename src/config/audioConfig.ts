/**
 * 🎵 背景音乐配置 (BGM Configuration)
 * 备选曲目均来自 /public/audio/ 目录中的音乐文件。
 * 游戏页与贺卡页共享相同的备选曲目库，支持分别独立指定。
 */

export interface AudioTrackItem {
  id: string;
  name: string;
  artist: string;
  url: string;
  icon: string;
}

export const CANDIDATE_AUDIO_TRACKS: AudioTrackItem[] = [
  {
    id: 'track_redvelvet_celebrate',
    name: 'Celebrate',
    artist: 'Red Velvet',
    url: '/audio/Celebrate-RedVelvet.mp3',
    icon: '🍰',
  },
  {
    id: 'track_nmixx_birthdaywish',
    name: 'Birthday Wish',
    artist: 'NMIXX',
    url: '/audio/brithdaywish_nmixx.mp3',
    icon: '🎂',
  },
  {
    id: 'track_twice_celebrate',
    name: 'Celebrate',
    artist: 'TWICE',
    url: '/audio/Celebrate-Twice.mp3',
    icon: '🎉',
  },
  {
    id: 'track_ellie_loveme',
    name: 'Love Me Like You Do',
    artist: 'Ellie Goulding',
    url: '/audio/LoveMeLikeYouDo-Ellie Goulding.mp3',
    icon: '💖',
  },
];

export const DEFAULT_AUDIO_CONFIG = {
  // 游戏页默认：Red Velvet - Celebrate
  game: {
    trackId: 'track_redvelvet_celebrate',
    name: 'Celebrate - Red Velvet',
    url: '/audio/Celebrate-RedVelvet.mp3',
  },

  // 贺卡页默认：NMIXX - Birthday Wish
  card: {
    trackId: 'track_nmixx_birthdaywish',
    name: 'Birthday Wish - NMIXX',
    url: '/audio/brithdaywish_nmixx.mp3',
  },
};
