export const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

export const formatCompactRupiah = (value: number) =>
    `Rp ${new Intl.NumberFormat('id-ID', { compactDisplay: 'short', maximumFractionDigits: 1, notation: 'compact' }).format(value)}`;

export const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
