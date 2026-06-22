/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NumberData, NumberStyle } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface NumberCardProps {
  data: NumberData;
  style: NumberStyle;
  onCardClick?: () => void;
}

export default function NumberCard({ data, style, onCardClick }: NumberCardProps) {
  const koreanReading = style === 'native' ? data.nativeName : data.sinoName;

  // 숫자가 바뀔 때 애니메이션이 작동하도록 키값(Key)을 변경합니다.
  return (
    <div
      id={`number-card-container-${data.value}`}
      className="relative flex flex-col items-center justify-center w-full max-w-sm aspect-square bg-white rounded-3xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl transition-shadow cursor-pointer select-none overflow-hidden group"
      onClick={onCardClick}
    >
      {/* 장식용 은은한 뒷 그라디언트 조명 */}
      <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full bg-gradient-to-br ${data.color} opacity-10 blur-3xl group-hover:scale-125 transition-transform duration-500`} />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-slate-100 opacity-20 blur-2xl" />

      {/* 애니메이션 입체 숫자 */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={data.value}
          initial={{ opacity: 0, scale: 0.3, y: 50, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50, rotate: 10 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 18,
          }}
          className="flex flex-col items-center justify-center z-10"
        >
          {/* 아기자기한 이모지 대표 캐릭터 */}
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-5xl md:text-6xl mb-4"
          >
            {data.emoji}
          </motion.span>

          {/* 거대하고 세련된 입체 숫자 디자인 */}
          <span className={`text-[8.5rem] md:text-[10rem] font-sans font-black leading-none bg-gradient-to-b ${data.color} bg-clip-text text-transparent filter drop-shadow-[0_8px_16px_var(--tw-shadow-color)] ${data.shadowColor}`}>
            {data.value}
          </span>

          {/* 한글 읽기 가이드 */}
          <div className="mt-2 text-center">
            <h2 className="text-3xl md:text-4xl font-sans font-black text-slate-800 tracking-tight">
              {koreanReading}
            </h2>
            <p className="mt-1.5 text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full inline-block">
              {data.emojiLabel} {data.value}개
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 마우스 호버 가이드 안내 */}
      <div className="absolute bottom-3 text-[11px] font-medium text-slate-401 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        카드를 누르면 소리를 내어 읽어줍니다 🔊
      </div>
    </div>
  );
}
