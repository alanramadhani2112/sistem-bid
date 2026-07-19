export const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { currency: 'IDR', maximumFractionDigits: 0, style: 'currency' }).format(value);

export const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
