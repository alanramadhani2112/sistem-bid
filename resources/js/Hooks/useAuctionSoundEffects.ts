import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { BidRow } from '@/Hooks/useAuctionRoom';

const STORAGE_KEY = 'jawara:auction-sound-enabled';
const TICK_MS = 1000;
const URGENT_TICK_MS = 450;
const URGENT_SECONDS = 15;

type Winner = {
    bidder_name: string;
    winning_amount: number;
} | null;

type AuctionSoundOptions = {
    auctionStatus: string;
    bidHistory: BidRow[];
    endsAt: string | null;
    winner?: Winner;
};

type ToneOptions = {
    duration: number;
    frequency: number;
    gain?: number;
    type?: OscillatorType;
    endFrequency?: number;
    delay?: number;
};

const canUseAudio = () => typeof window !== 'undefined' && typeof window.AudioContext !== 'undefined';

const getInitialEnabled = () => {
    if (typeof window === 'undefined') return false;

    return window.localStorage.getItem(STORAGE_KEY) !== '0';
};

export function useAuctionSoundEffects({ auctionStatus, bidHistory, endsAt, winner }: AuctionSoundOptions) {
    const [enabled, setEnabled] = useState(getInitialEnabled);
    const [unlocked, setUnlocked] = useState(false);
    const audioRef = useRef<AudioContext | null>(null);
    const mountedRef = useRef(false);
    const lastStatusRef = useRef(auctionStatus);
    const lastBidIdRef = useRef<number | null>(bidHistory[0]?.id ?? null);
    const playedWinnerRef = useRef(false);
    const tickTimerRef = useRef<number | null>(null);

    const stopTicking = useCallback(() => {
        if (tickTimerRef.current !== null) {
            window.clearTimeout(tickTimerRef.current);
            tickTimerRef.current = null;
        }
    }, []);

    const getAudio = useCallback(() => {
        if (!canUseAudio()) return null;

        if (!audioRef.current) {
            audioRef.current = new window.AudioContext();
        }

        if (audioRef.current.state === 'suspended') {
            void audioRef.current.resume();
        }

        return audioRef.current;
    }, []);

    const playTone = useCallback(
        ({ delay = 0, duration, endFrequency, frequency, gain = 0.08, type = 'sine' }: ToneOptions) => {
            if (!enabled || !unlocked) return;

            const audio = getAudio();
            if (!audio) return;

            const start = audio.currentTime + delay;
            const oscillator = audio.createOscillator();
            const gainNode = audio.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, start);

            if (endFrequency) {
                oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
            }

            gainNode.gain.setValueAtTime(0.0001, start);
            gainNode.gain.exponentialRampToValueAtTime(gain, start + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);

            oscillator.connect(gainNode);
            gainNode.connect(audio.destination);
            oscillator.start(start);
            oscillator.stop(start + duration + 0.02);
        },
        [enabled, getAudio, unlocked],
    );

    const unlockAudio = useCallback(() => {
        const audio = getAudio();
        if (!audio) return;

        void audio.resume();
        setUnlocked(true);
    }, [getAudio]);

    const sounds = useMemo(
        () => ({
            bid: () => playTone({ duration: 0.12, frequency: 880, gain: 0.09, type: 'triangle' }),
            close: () => playTone({ duration: 0.32, endFrequency: 220, frequency: 440, gain: 0.08, type: 'sine' }),
            start: () => playTone({ duration: 0.28, endFrequency: 740, frequency: 370, gain: 0.08, type: 'sine' }),
            tick: () => playTone({ duration: 0.045, frequency: 520, gain: 0.035, type: 'square' }),
            urgentTick: () => playTone({ duration: 0.055, frequency: 780, gain: 0.055, type: 'square' }),
            winner: () => {
                playTone({ duration: 0.16, frequency: 523, gain: 0.08, type: 'triangle' });
                playTone({ delay: 0.13, duration: 0.16, frequency: 659, gain: 0.08, type: 'triangle' });
                playTone({ delay: 0.26, duration: 0.22, frequency: 784, gain: 0.09, type: 'triangle' });
            },
        }),
        [playTone],
    );

    const toggleSound = useCallback(() => {
        setEnabled((current) => {
            const next = !current;
            window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');

            if (next) {
                unlockAudio();
            }

            return next;
        });
    }, [unlockAudio]);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
            stopTicking();
        };
    }, [stopTicking]);

    useEffect(() => {
        if (!mountedRef.current) return;

        window.localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
    }, [enabled]);

    useEffect(() => {
        if (!enabled || unlocked) return;

        const handleInteraction = () => unlockAudio();

        window.addEventListener('pointerdown', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });

        return () => {
            window.removeEventListener('pointerdown', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [enabled, unlockAudio, unlocked]);

    useEffect(() => {
        const previous = lastStatusRef.current;

        if (previous !== auctionStatus) {
            if (auctionStatus === 'live') sounds.start();
            if (previous === 'live' && auctionStatus !== 'live') sounds.close();
        }

        lastStatusRef.current = auctionStatus;
    }, [auctionStatus, sounds]);

    useEffect(() => {
        const latestBidId = bidHistory[0]?.id ?? null;

        if (latestBidId !== null && lastBidIdRef.current !== null && latestBidId !== lastBidIdRef.current) {
            sounds.bid();
        }

        lastBidIdRef.current = latestBidId;
    }, [bidHistory, sounds]);

    useEffect(() => {
        if (winner && !playedWinnerRef.current) {
            playedWinnerRef.current = true;
            sounds.winner();
        }

        if (!winner) playedWinnerRef.current = false;
    }, [sounds, winner]);

    useEffect(() => {
        stopTicking();

        if (!enabled || auctionStatus !== 'live') return;

        const scheduleTick = () => {
            const remainingMs = endsAt ? new Date(endsAt).getTime() - Date.now() : Number.POSITIVE_INFINITY;
            const urgent = remainingMs <= URGENT_SECONDS * 1000;

            if (urgent) sounds.urgentTick();
            else sounds.tick();

            tickTimerRef.current = window.setTimeout(scheduleTick, urgent ? URGENT_TICK_MS : TICK_MS);
        };

        tickTimerRef.current = window.setTimeout(scheduleTick, TICK_MS);

        return stopTicking;
    }, [auctionStatus, enabled, endsAt, sounds, stopTicking]);

    return { enabled, toggleSound };
}
