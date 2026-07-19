import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'jawara-theme';

function applyTheme(theme: Theme) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && prefersDark));
}

export function DarkModeToggle() {
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system');

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const nextTheme: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    const label = theme === 'dark' ? 'Mode gelap' : theme === 'light' ? 'Mode terang' : 'Ikuti sistem';

    return (
        <Button aria-label={`Tema: ${label}`} onClick={() => setTheme(nextTheme)} size="icon" type="button" variant="outline">
            {theme === 'dark' ? <Moon /> : <Sun />}
        </Button>
    );
}
