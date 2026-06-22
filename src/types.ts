/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NumberStyle = 'native' | 'sino';

export interface NumberData {
  value: number;
  nativeName: string;
  sinoName: string;
  emoji: string;
  emojiLabel: string;
  color: string; // Tailwind gradient starting and ending classes
  textColor: string;
  shadowColor: string;
}

export const NUMBER_DATA_LIST: NumberData[] = [
  {
    value: 1,
    nativeName: '하나',
    sinoName: '일',
    emoji: '🍎',
    emojiLabel: '사과',
    color: 'from-rose-400 to-red-500',
    textColor: 'text-red-500',
    shadowColor: 'shadow-red-200',
  },
  {
    value: 2,
    nativeName: '둘',
    sinoName: '이',
    emoji: '🦆',
    emojiLabel: '오리',
    color: 'from-amber-400 to-orange-500',
    textColor: 'text-orange-500',
    shadowColor: 'shadow-orange-200',
  },
  {
    value: 3,
    nativeName: '셋',
    sinoName: '삼',
    emoji: '🦋',
    emojiLabel: '나비',
    color: 'from-sky-400 to-blue-500',
    textColor: 'text-blue-500',
    shadowColor: 'shadow-blue-200',
  },
  {
    value: 4,
    nativeName: '넷',
    sinoName: '사',
    emoji: '🎈',
    emojiLabel: '풍선',
    color: 'from-pink-400 to-rose-500',
    textColor: 'text-rose-500',
    shadowColor: 'shadow-rose-200',
  },
  {
    value: 5,
    nativeName: '다섯',
    sinoName: '오',
    emoji: '⭐',
    emojiLabel: '별',
    color: 'from-yellow-350 to-amber-500',
    textColor: 'text-amber-550',
    shadowColor: 'shadow-amber-200',
  },
  {
    value: 6,
    nativeName: '여섯',
    sinoName: '육',
    emoji: '🌸',
    emojiLabel: '벗꽃',
    color: 'from-emerald-400 to-teal-500',
    textColor: 'text-teal-600',
    shadowColor: 'shadow-teal-200',
  },
  {
    value: 7,
    nativeName: '일곱',
    sinoName: '칠',
    emoji: '🌈',
    emojiLabel: '무지개',
    color: 'from-indigo-400 to-violet-500',
    textColor: 'text-indigo-500',
    shadowColor: 'shadow-indigo-200',
  },
  {
    value: 8,
    nativeName: '여덟',
    sinoName: '팔',
    emoji: '🌰',
    emojiLabel: '도토리',
    color: 'from-yellow-600 to-amber-850',
    textColor: 'text-amber-800',
    shadowColor: 'shadow-yellow-900/20',
  },
  {
    value: 9,
    nativeName: '아홉',
    sinoName: '구',
    emoji: '🐞',
    emojiLabel: '무당벌레',
    color: 'from-red-400 to-rose-600',
    textColor: 'text-rose-600',
    shadowColor: 'shadow-rose-300',
  },
  {
    value: 10,
    nativeName: '열',
    sinoName: '십',
    emoji: '❤️',
    emojiLabel: '하트',
    color: 'from-pink-500 to-red-600',
    textColor: 'text-red-600',
    shadowColor: 'shadow-red-300',
  },
];
