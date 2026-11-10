import React, { useState } from 'react';
import { StepId, GameStage } from './types/game';
import { RoomCanvas } from './components/RoomCanvas';
import { DecorateGuide, DECOR_ITEMS } from './components/DecorateGuide';
import { CandleWishStage } from './components/CandleWishStage';
import { CelebrationModal } from './components/CelebrationModal';
import { TopBar } from './components/TopBar';
import { BgmModal } from './components/BgmModal';
import { sound, BgmScene } from './utils/audio';

export default function App() {
  const [stage, setStage] = useState<GameStage>('DECORATING');
  const [activeItems, setActiveItems] = useState<Set<StepId>>(new Set());
  const [candleLit, setCandleLit] = useState<boolean>(true);
  const [blowIntensity, setBlowIntensity] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBgmModalOpen, setIsBgmModalOpen] = useState<boolean>(false);
  const [bgmInitialScene, setBgmInitialScene] = useState<BgmScene>('game');

  // Current item to guide user to click
  const nextItemToPlace = DECOR_ITEMS.find((it) => !activeItems.has(it.id))?.id || null;

  // Handle decorating an item
  const handlePlaceItem = (itemId: StepId) => {
    if (activeItems.has(itemId)) return;

    // Start gentle game BGM upon first user decoration action
    sound.ensureGameMusicPlaying();
    sound.playPop();

    const updated = new Set(activeItems);
    updated.add(itemId);
    setActiveItems(updated);

    if (itemId === 'lights') {
      sound.playSparkle();
    } else if (itemId === 'banner' || itemId === 'main_cake') {
      sound.playChime();
    }

    // Check if all items are decorated
    if (updated.size === DECOR_ITEMS.length) {
      setTimeout(() => {
        // Transition to wishing stage: lights dim, candles ignite
        sound.playLightCandle();
        setStage('WISHING');
        setCandleLit(true);
      }, 700);
    }
  };

  // One-click decorate all
  const handleAutoDecorateAll = () => {
    sound.ensureGameMusicPlaying();
    sound.playSparkle();
    const all = new Set(DECOR_ITEMS.map((d) => d.id));
    setActiveItems(all);
    setTimeout(() => {
      sound.playLightCandle();
      setStage('WISHING');
      setCandleLit(true);
    }, 600);
  };

  // Candle extinguished
  const handleExtinguish = () => {
    setCandleLit(false);
    setTimeout(() => {
      setStage('CELEBRATING');
    }, 900);
  };

  // Restart / Reset
  const handleRestart = () => {
    sound.setScene('game');
    setActiveItems(new Set());
    setCandleLit(true);
    setBlowIntensity(0);
    setStage('DECORATING');
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleOpenBgm = (scene: BgmScene) => {
    setBgmInitialScene(scene);
    setIsBgmModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-between selection:bg-amber-200">
      {/* Top Header */}
      <TopBar
        stage={stage}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onRestart={handleRestart}
        onOpenBgm={() => handleOpenBgm('game')}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 max-w-5xl w-full mx-auto pb-4">
        {/* Interactive Room Canvas */}
        <div className="w-full relative flex-1 flex items-center justify-center">
          <RoomCanvas
            stage={stage}
            activeItems={activeItems}
            highlightItem={stage === 'DECORATING' ? nextItemToPlace : null}
            onHotspotClick={handlePlaceItem}
            candleLit={candleLit}
            blowIntensity={blowIntensity}
          />
        </div>

        {/* Dynamic Controls based on stage */}
        <div className="w-full">
          {stage === 'DECORATING' && (
            <DecorateGuide
              activeItems={activeItems}
              onSelectItem={handlePlaceItem}
              onAutoDecorateAll={handleAutoDecorateAll}
            />
          )}

          {stage === 'WISHING' && (
            <CandleWishStage
              onExtinguish={handleExtinguish}
              candleLit={candleLit}
              onBlowIntensityChange={setBlowIntensity}
            />
          )}
        </div>
      </main>

      {/* Grand Celebration Modal */}
      {stage === 'CELEBRATING' && (
        <CelebrationModal
          onRestart={handleRestart}
          onOpenBgm={() => handleOpenBgm('card')}
        />
      )}

      {/* Background Music Selector Modal */}
      <BgmModal
        isOpen={isBgmModalOpen}
        initialScene={bgmInitialScene}
        onClose={() => setIsBgmModalOpen(false)}
      />

      {/* Quiet Footer */}
      <footer className="text-center py-2 text-[11px] text-stone-400 select-none">
        暖心呈现 · 愿每一个生日都充满欢喜与温暖
      </footer>
    </div>
  );
}
