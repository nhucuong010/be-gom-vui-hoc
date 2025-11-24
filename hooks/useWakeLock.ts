import { useEffect, useRef } from 'react';

export const useWakeLock = (enabled: boolean = true) => {
    const wakeLock = useRef<WakeLockSentinel | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const requestWakeLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                    wakeLock.current = await navigator.wakeLock.request('screen');
                    console.log('Wake Lock is active');
                } catch (err: any) {
                    console.error(`${err.name}, ${err.message}`);
                }
            }
        };

        const handleVisibilityChange = () => {
            if (wakeLock.current !== null && document.visibilityState === 'visible') {
                requestWakeLock();
            }
        };

        requestWakeLock();
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (wakeLock.current) {
                wakeLock.current.release();
                wakeLock.current = null;
            }
        };
    }, [enabled]);
};
