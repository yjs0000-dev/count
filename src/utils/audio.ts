/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 음계에 해당하는 주파수 매핑 (1부터 10까지 도-레-미-파-솔-라-시-도-레-미)
const FREQUENCIES: Record<number, number> = {
  1: 261.63, // C4
  2: 293.66, // D4
  3: 329.63, // E4
  4: 349.23, // F4
  5: 392.00, // G4
  6: 440.00, // A4
  7: 493.88, // B4
  8: 523.25, // C5
  9: 587.33, // D5
  10: 659.25, // E5
};

let audioCtx: AudioContext | null = null;

// AudioContext를 안전하게 지연 초기화하는 헬퍼 함수
export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * 실로폰/물방울 느낌의 귀여운 신디사이저 효과음을 연주합니다.
 * @param number 현재 숫자 (1~10)
 */
export function playNumberTone(number: number): void {
  try {
    const ctx = getAudioContext();
    const frequency = FREQUENCIES[number] || 440;

    // 메인 오실레이터 (사인파) - 뾱 하는 둥근 톤
    const osc = ctx.createOscillator();
    // 서브 오실레이터 (삼각파) - 소리에 따뜻함과 입체감을 한 옥타브 아래에서 더해줌
    const subOsc = ctx.createOscillator();

    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    // 약간의 피치 스윕: 시작할 때 아주 살짝 높은 음에서 지정 주파수로 떨어지며 뿅 하는 타격감을 줌
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.98, ctx.currentTime + 0.15);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(frequency / 2, ctx.currentTime);

    // 볼륨 엔벨로프 설정 (빠른 어택, 부드러운 디케이)
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02); // 어택
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4); // 디케이

    osc.connect(gainNode);
    subOsc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime);
    subOsc.start(ctx.currentTime);

    osc.stop(ctx.currentTime + 0.4);
    subOsc.stop(ctx.currentTime + 0.4);
  } catch (error) {
    console.error('효과음 재생 실패:', error);
  }
}

/**
 * 물방울이 튀는 듯한 짧고 가벼운 터치 효과음
 */
export function playTapTone(): void {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // 무시
  }
}

/**
 * 축하하는 느낌의 성공 피치 (도-미-솔-도 멜로디 수순 재생)
 */
export function playSuccessChime(): void {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.1);

      gainNode.gain.setValueAtTime(0, startTime + idx * 0.1);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + idx * 0.1 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.1 + 0.3);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime + idx * 0.1);
      osc.stop(startTime + idx * 0.1 + 0.35);
    });
  } catch (e) {
    // 무시
  }
}

/**
 * Text-to-Speech API를 사용하여 텍스트 성독
 * @param text 읽어줄 한글 텍스트
 */
export function speakText(text: string): void {
  if (!('speechSynthesis' in window)) {
    console.warn('TTS가 이 브라우저에서 지원되지 않습니다.');
    return;
  }

  try {
    // 연속 클릭 시 이전 재생 도중의 스피치를 말끔히 차단
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.0; // 자연스러운 재생 속도
    utterance.pitch = 1.15; // 아이들에게 더 어울리는 약간 높고 쾌활한 목소리 톤

    // 가용한 한국어 보이스 선택 시도
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find(voice => voice.lang.startsWith('ko'));
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('음성 합성 실패:', error);
  }
}
