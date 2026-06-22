/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NumberStyle } from '../types';
import { Volume2, VolumeX, MessageSquareCode, Languages } from 'lucide-react';
import { motion } from 'motion/react';

interface SoundSettingsProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  numberStyle: NumberStyle;
  setNumberStyle: (style: NumberStyle) => void;
}

export default function SoundSettings({
  soundEnabled,
  setSoundEnabled,
  voiceEnabled,
  setVoiceEnabled,
  numberStyle,
  setNumberStyle,
}: SoundSettingsProps) {
  return (
    <div
      id="sound-settings-bar"
      className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100"
    >
      {/* 셈 세기 스타일 선택 */}
      <div className="flex items-center gap-2">
        <Languages className="w-4 h-4 text-slate-550" />
        <span className="text-xs font-medium text-slate-600">세기방식:</span>
        <div className="inline-flex p-0.5 bg-slate-100 rounded-lg">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setNumberStyle('native')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              numberStyle === 'native'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            하나 둘 셋 (우리말)
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setNumberStyle('sino')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              numberStyle === 'sino'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            일 이 삼 (한자어)
          </motion.button>
        </div>
      </div>

      {/* 사운드 & 목소리 제어 버튼 */}
      <div className="flex items-center gap-2">
        {/* 효과음 토글 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            soundEnabled
              ? 'bg-indigo-50 border-indigo-200 text-indigo-650'
              : 'bg-slate-50 border-slate-200 text-slate-405'
          }`}
          title="효과음 켜기/끄기"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4" />
              <span>효과음 켬</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              <span>효과음 끔</span>
            </>
          )}
        </motion.button>

        {/* TTS 목소리 읽기 토글 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            voiceEnabled
              ? 'bg-emerald-50 border-emerald-250 text-emerald-650'
              : 'bg-slate-50 border-slate-200 text-slate-405'
          }`}
          title="목소리 읽기 켜기/끄기"
        >
          <MessageSquareCode className={`w-4 h-4 ${voiceEnabled ? 'text-emerald-550' : 'text-slate-400'}`} />
          <span>{voiceEnabled ? '목소리 켬' : '목소리 끔'}</span>
        </motion.button>
      </div>
    </div>
  );
}
