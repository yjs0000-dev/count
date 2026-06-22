/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface ControlsProps {
  currentNumber: number;
  setCurrentNumber: (val: number | ((prev: number) => number)) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
}

export default function Controls({
  currentNumber,
  isPlaying,
  setIsPlaying,
  onNext,
  onPrev,
  onReset,
}: ControlsProps) {
  return (
    <div
      id="number-navigation-controls"
      className="flex items-center justify-between gap-4 p-4 md:p-5 bg-white rounded-3xl shadow-lg border border-slate-100 max-w-sm w-full mx-auto"
    >
      {/* 처음으로 돌아가기 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onReset}
        disabled={currentNumber === 1 && !isPlaying}
        className="p-3 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-slate-500 transition-colors"
        title="처음부터 다시 세기"
      >
        <RotateCcw className="w-5 h-5" />
      </motion.button>

      {/* 이전 숫자로 */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onPrev}
          className="p-3.5 bg-indigo-50 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors"
          title="이전 숫자"
        >
          <ChevronLeft className="w-6 h-6" strokeWidth={3} />
        </motion.button>

        {/* 자동 재생 / 일시정지 */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className={`p-5 rounded-full shadow-md text-white transition-all flex items-center justify-center ${
            isPlaying
              ? 'bg-red-500 shadow-red-200 hover:bg-red-600'
              : 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-750'
          }`}
          title={isPlaying ? '자동 넘기기 일시정지' : '자동으로 1부터 10까지 듣기'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current text-white" />
          ) : (
            <Play className="w-6 h-6 fill-current translate-x-0.5 text-white" />
          )}
        </motion.button>

        {/* 다음 숫자로 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onNext}
          className="p-3.5 bg-indigo-50 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors"
          title="다음 숫자"
        >
          <ChevronRight className="w-6 h-6" strokeWidth={3} />
        </motion.button>
      </div>

      {/* 상태 구슬 */}
      <div className="flex items-center justify-center px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
        <span className="text-sm font-extrabold text-indigo-600 font-mono">
          {currentNumber} <span className="text-slate-350 font-normal">/ 10</span>
        </span>
      </div>
    </div>
  );
}
