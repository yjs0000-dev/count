/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { NumberData, NumberStyle } from '../types';
import { playTapTone, speakText } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

interface EmojiGridProps {
  data: NumberData;
  style: NumberStyle;
  voiceEnabled: boolean;
}

export default function EmojiGrid({ data, style, voiceEnabled }: EmojiGridProps) {
  // 사용자가 몇 개까지 팹(터치)했는지 상태 기록 (인덱스)
  const [tappedIndices, setTappedIndices] = useState<Record<number, boolean>>({});

  // 숫자가 바뀌면 터치 기록 초기화
  useEffect(() => {
    setTappedIndices({});
  }, [data.value]);

  const handleEmojiClick = (index: number) => {
    const isAlreadyTapped = tappedIndices[index];
    const newTapped = { ...tappedIndices, [index]: !isAlreadyTapped };
    setTappedIndices(newTapped);

    // 가벼운 터치음
    playTapTone();

    // 현재까지 터치 완료된 개수를 한국어로 읽어줍니다 (예: "하나", "둘" 혹은 "하나!", "둘!")
    if (voiceEnabled) {
      const activeCount = Object.values(newTapped).filter(Boolean).length;
      if (activeCount > 0) {
        // 해당 카운트순서에 맞는 한글 발음 가져오기
        const nativeNumbers = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
        const sinoNumbers = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구', '십'];
        const textToSpeak = style === 'native' ? nativeNumbers[activeCount] : sinoNumbers[activeCount];
        speakText(textToSpeak);
      }
    }
  };

  // 모두 터치했는지 여부
  const isAllTapped = Object.values(tappedIndices).filter(Boolean).length === data.value;

  return (
    <div
      id="emoji-interactive-grid"
      className="flex flex-col items-center justify-between w-full h-full bg-slate-50/50 rounded-3xl p-6 border border-slate-100/60"
    >
      {/* 가이드 메시지 */}
      <div className="text-center mb-5">
        <h3 className="text-base font-bold text-slate-700">
          화면의 그림들을 하나씩 누르면서 세어보세요!
        </h3>
        <p className="text-xs text-slate-401 mt-1">
          {isAllTapped ? (
            <span className="text-emerald-555 font-semibold">🎉 전부 다 셌어요! 참 잘했어요!</span>
          ) : (
            `총 ${data.value}개의 ${data.emojiLabel}이 있습니다. (${Object.values(tappedIndices).filter(Boolean).length}/${data.value})`
          )}
        </p>
      </div>

      {/* 이모지 배치 홀더 */}
      <div className="flex-1 flex items-center justify-center w-full min-h-[220px]">
        <div
          className={`grid gap-4 w-full justify-center max-w-sm ${
            data.value <= 3
              ? 'grid-cols-3'
              : data.value <= 6
              ? 'grid-cols-3'
              : data.value <= 8
              ? 'grid-cols-4'
              : 'grid-cols-4'
          }`}
        >
          {Array.from({ length: data.value }).map((_, index) => {
            const tapped = tappedIndices[index];
            return (
              <motion.button
                key={`${data.value}-${index}`}
                initial={{ opacity: 0, scale: 0.1, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  delay: index * 0.04,
                }}
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.85, rotate: -5 }}
                onClick={() => handleEmojiClick(index)}
                className={`relative flex items-center justify-center aspect-square w-14 h-14 md:w-16 md:h-16 rounded-2xl transition-all cursor-pointer select-none border shadow-xs ${
                  tapped
                    ? 'bg-white border-emerald-300 shadow-emerald-100/40 shadow-md scale-95'
                    : 'bg-white hover:bg-slate-50 border-slate-150 hover:shadow-md'
                }`}
              >
                {/* 이모지 캐릭터 */}
                <span className={`text-3xl md:text-4xl transition-all duration-300 ${tapped ? 'opacity-40 filter grayscale-[30%]' : 'opacity-100'}`}>
                  {data.emoji}
                </span>

                {/* 꼬리표: 몇 번째 터치인지 표시 */}
                <AnimatePresence>
                  {tapped && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0, y: 10 }}
                      className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white font-sans text-xs font-black shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 인덱스 숫자 가이드 */}
                <span className="absolute bottom-1 right-1.5 text-[9px] font-mono text-slate-350 select-none">
                  #{index + 1}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 리셋 가이드 */}
      <div className="mt-5 w-full flex justify-center">
        {Object.keys(tappedIndices).length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTappedIndices({})}
            className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-550 text-xs font-semibold transition-colors"
          >
            이 숫자 다시 세기 🔄
          </motion.button>
        )}
      </div>
    </div>
  );
}
