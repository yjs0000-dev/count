/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { NUMBER_DATA_LIST, NumberStyle } from './types';
import { playNumberTone, playSuccessChime, speakText } from './utils/audio';
import SoundSettings from './components/SoundSettings';
import NumberCard from './components/NumberCard';
import EmojiGrid from './components/EmojiGrid';
import Controls from './components/Controls';
import { Sparkles, Trophy, RotateCcw, Volume2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentNumber, setCurrentNumber] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [numberStyle, setNumberStyle] = useState<NumberStyle>('native');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentData = NUMBER_DATA_LIST[currentNumber - 1];

  // 효과음, TTS 사운드 출력 도우미
  const triggerAudioEffects = (num: number, style: NumberStyle) => {
    if (soundEnabled) {
      playNumberTone(num);
    }
    if (voiceEnabled) {
      const data = NUMBER_DATA_LIST[num - 1];
      const speechText = style === 'native' ? data.nativeName : data.sinoName;
      speakText(speechText);
    }
  };

  // 마운트 직후 혹은 숫자가 바뀔 때 소리 내기
  useEffect(() => {
    // 자동재생 중이 아닐 때만 수동 전환 시 즉시 사운드 트리거
    if (!isPlaying) {
      triggerAudioEffects(currentNumber, numberStyle);
    }
  }, [currentNumber]);

  // 자동 재생 루프 조절
  useEffect(() => {
    if (isPlaying) {
      // 먼저 현재 상태 음량/TTS 한번 키고 타이머 시작
      triggerAudioEffects(currentNumber, numberStyle);

      autoPlayTimerRef.current = setInterval(() => {
        setCurrentNumber((prev) => {
          if (prev >= 10) {
            // 10에 다다르면 축하 모드 출력 및 재생중단
            setIsPlaying(false);
            setShowSummary(true);
            if (soundEnabled) {
              playSuccessChime();
            }
            if (voiceEnabled) {
              speakText('참 잘했어요! 우리 십까지 모두 셌어요!');
            }
            return 10;
          }
          const next = prev + 1;
          // 타이머 내에서 소리 재생
          triggerAudioEffects(next, numberStyle);
          return next;
        });
      }, 2500); // 아이들이 충분히 이해할 수 있게 2.5초 간격으로 진행
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, soundEnabled, voiceEnabled, numberStyle]);

  // 다음 수로 이동
  const handleNext = () => {
    setIsPlaying(false);
    if (currentNumber < 10) {
      setCurrentNumber((prev) => prev + 1);
    } else {
      // 10 성취 축하
      setShowSummary(true);
      if (soundEnabled) {
        playSuccessChime();
      }
      if (voiceEnabled) {
        speakText('참 잘했어요! 다 셌어요!');
      }
    }
  };

  // 이전 수로 이동
  const handlePrev = () => {
    setIsPlaying(false);
    if (currentNumber > 1) {
      setCurrentNumber((prev) => prev - 1);
    } else {
      // 루프 백
      setCurrentNumber(10);
    }
  };

  // 리셋
  const handleReset = () => {
    setIsPlaying(false);
    setShowSummary(false);
    setCurrentNumber(1);
  };

  // 카드 클릭 시 사운드 읽어주기 요청
  const handleCardClick = () => {
    triggerAudioEffects(currentNumber, numberStyle);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-colors duration-300">
      {/* 귀여운 장식 헤더 패널 */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 sticky top-0 z-40 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                1부터 10까지 숫자 세기
              </h1>
              <p className="text-[11px] text-slate-401 font-medium font-mono">
                재미있는 소리공부 놀이터 🎈
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-800 text-[11px] font-bold px-3 py-1 rounded-full border border-yellow-100">
            <Star className="w-3.5 h-3.5 fill-current text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>최고의 셈 공부</span>
          </div>
        </div>
      </header>

      {/* 메인 플레이스페이스 */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6 justify-center">
        {/* 상단 오디오 설정 */}
        <SoundSettings
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          voiceEnabled={voiceEnabled}
          setVoiceEnabled={setVoiceEnabled}
          numberStyle={numberStyle}
          setNumberStyle={setNumberStyle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* 좌측: 큰 숫자 카드 */}
          <div className="flex items-center justify-center">
            <NumberCard
              data={currentData}
              style={numberStyle}
              onCardClick={handleCardClick}
            />
          </div>

          {/* 우측: 이모지 터치 세기 영역 */}
          <div className="flex flex-col">
            <EmojiGrid
              data={currentData}
              style={numberStyle}
              voiceEnabled={voiceEnabled}
            />
          </div>
        </div>

        {/* 하단 제어 제어바 */}
        <div className="w-full mt-2">
          <Controls
            currentNumber={currentNumber}
            setCurrentNumber={setCurrentNumber}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onNext={handleNext}
            onPrev={handlePrev}
            onReset={handleReset}
          />
        </div>

        {/* 1부터 10까지 쉽게 바로 가기 도트 패드 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 text-center shadow-xs">
          <p className="text-[11px] font-bold text-slate-401 mb-3">숫자 골라 가기</p>
          <div className="flex flex-wrap justify-center gap-2">
            {NUMBER_DATA_LIST.map((item) => (
              <motion.button
                key={item.value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentNumber(item.value);
                }}
                className={`w-9 h-9 rounded-xl font-sans font-black text-xs transition-all ${
                  currentNumber === item.value
                    ? `bg-gradient-to-br ${item.color} text-white shadow-md shadow-indigo-100 scale-110`
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {item.value}
              </motion.button>
            ))}
          </div>
        </div>
      </main>

      {/* 축하 오버레이 모달 (10 세기 완료 시 출력) */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center border border-slate-100 overflow-hidden"
            >
              {/* 무지개 그라디언트 띠 장식 */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-teal-400" />

              <div className="mt-4 flex justify-center text-amber-500 mb-4 animate-bounce">
                <Trophy className="w-16 h-16 filter drop-shadow-md" />
              </div>

              <h3 className="text-2xl font-black text-slate-800">참 잘했어요! 🎉</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">
                1부터 10까지 숫자를 모두 세었습니다!<br />
                다양한 과일과 동물들과 함께<br />
                숫자 공부 마스터 완료!
              </p>

              {/* 요약 리뷰 보드 */}
              <div className="my-5 p-3.5 bg-slate-50 rounded-2xl grid grid-cols-5 gap-1.5 justify-center max-w-xs mx-auto">
                {NUMBER_DATA_LIST.map((d) => (
                  <div key={d.value} className="flex flex-col items-center justify-center p-1 bg-white rounded-lg border border-slate-100">
                    <span className="text-base">{d.emoji}</span>
                    <span className="text-[10px] font-black text-slate-800 mt-0.5">{d.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReset}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-150 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>처음부터 다시 하기</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowSummary(false)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-semibold"
                >
                  닫기
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 푸터 */}
      <footer className="py-4 text-center text-[10px] font-medium text-slate-401 border-t border-slate-100 bg-white">
        &copy; 1부터 10까지 숫자 세기 놀이터 &middot; 수오미 가사 및 카운팅 학습앱
      </footer>
    </div>
  );
}
