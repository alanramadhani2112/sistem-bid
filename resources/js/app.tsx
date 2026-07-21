import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import type { ResolvedComponent } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const pages = import.meta.glob<{ default: ResolvedComponent }>('./Pages/**/*.tsx');

createInertiaApp({
    title: (title) => (title ? `${title} · JCC` : 'JCC'),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            pages,
        ).then((module) => module.default),
    setup({ el, App, props }) {
        if (!el) {
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#166534',
    },
});
