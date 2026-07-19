import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';

type ConnectionState = 'live' | 'reconnecting' | 'offline';

export function RealtimeConnectionBadge() {
    const [state, setState] = useState<ConnectionState>(() => (navigator.onLine ? 'live' : 'offline'));

    useEffect(() => {
        const markOnline = () => setState('live');
        const markOffline = () => setState('offline');

        window.addEventListener('online', markOnline);
        window.addEventListener('offline', markOffline);

        return () => {
            window.removeEventListener('online', markOnline);
            window.removeEventListener('offline', markOffline);
        };
    }, []);

    useEffect(() => {
        const connector = window.Echo?.connector as unknown as {
            pusher?: {
                connection?: {
                    bind?: (event: string, callback: () => void) => void;
                    unbind?: (event: string, callback: () => void) => void;
                };
            };
        };
        const connection = connector?.pusher?.connection;
        if (!connection?.bind || !connection.unbind) return;

        const live = () => setState('live');
        const reconnecting = () => setState('reconnecting');
        const offline = () => setState('offline');

        connection.bind('connected', live);
        connection.bind('connecting', reconnecting);
        connection.bind('unavailable', offline);
        connection.bind('failed', offline);
        connection.bind('disconnected', offline);

        return () => {
            connection.unbind?.('connected', live);
            connection.unbind?.('connecting', reconnecting);
            connection.unbind?.('unavailable', offline);
            connection.unbind?.('failed', offline);
            connection.unbind?.('disconnected', offline);
        };
    }, []);

    const label = state === 'live' ? 'Realtime live' : state === 'reconnecting' ? 'Menyambung ulang' : 'Realtime offline';
    const variant = state === 'live' ? 'default' : state === 'reconnecting' ? 'outline' : 'destructive';

    return <Badge variant={variant}>{label}</Badge>;
}
