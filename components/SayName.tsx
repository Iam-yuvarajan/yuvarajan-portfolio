'use client';

import { useEffect, useRef, useState } from 'react';
import { profile } from '@/data/content';

const RECORDING = '/name.mp3';

/**
 * "How to say it" button beside the hero name.
 *
 * Prefers a real recording at public/name.mp3. If that file is not there (or the
 * browser refuses to play it), it falls back to the built-in speech voice, picking
 * an Indian-English voice when one is installed so the name lands correctly.
 */
export default function SayName() {
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Some browsers only populate the voice list after the first call.
    window.speechSynthesis?.getVoices();
    return () => window.speechSynthesis?.cancel();
  }, []);

  const speak = () => {
    const synth = window.speechSynthesis;
    if (!synth) return setPlaying(false);
    const voices = synth.getVoices();
    const voice =
      voices.find((v) => v.lang === 'en-IN') ??
      voices.find((v) => v.lang?.startsWith('en-GB')) ??
      voices.find((v) => v.lang?.startsWith('en')) ??
      null;
    const u = new SpeechSynthesisUtterance(profile.pronunciation.speak);
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? 'en-IN';
    u.rate = 0.78; // slow enough that each syllable stays clear
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    synth.cancel();
    synth.speak(u);
  };

  const play = () => {
    if (playing) {
      audio.current?.pause();
      window.speechSynthesis?.cancel();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    const el = audio.current ?? new Audio(RECORDING);
    el.onended = () => setPlaying(false);
    audio.current = el;
    el.play().catch(speak); // no recording in public/ → browser voice
  };

  return (
    <button
      type="button"
      className={`say-name mono${playing ? ' is-playing' : ''}`}
      onClick={play}
      aria-label={`Hear how to say ${profile.name}: ${profile.pronunciation.display}`}
      title="Hear how to say it"
    >
      <span className="say-name__icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6.2h2.2L8.6 3.4v9.2L5.2 9.8H3z" />
          <path className="say-name__wave say-name__wave--1" d="M10.6 6.1a2.6 2.6 0 0 1 0 3.8" />
          <path className="say-name__wave say-name__wave--2" d="M12.5 4.4a5.1 5.1 0 0 1 0 7.2" />
        </svg>
      </span>
      {profile.pronunciation.display}
    </button>
  );
}
