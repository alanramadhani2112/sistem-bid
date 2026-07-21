import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { FormField } from '@/components/app/FormField';
import { FormPageShell } from '@/components/app/FormPageShell';
import { AppShell } from '../../../Layouts/AppShell';

type GreenBeanOption = {
    id: number;
    name: string;
    origin: string;
    starting_price: number;
    bid_increment: number;
};

type AuctionFormData = {
    green_bean_id: string;
    title: string;
    status: string;
    starts_at: string;
    ends_at: string;
};

type Auction = {
    ends_at: string;
    green_bean_id: number;
    id: number;
    starts_at: string;
    status: string;
    title: string;
};

type AuctionsFormProps = {
    auction: Auction | null;
    greenBeans: GreenBeanOption[];
    statuses: string[];
};

export default function AuctionsForm({ auction, greenBeans, statuses }: AuctionsFormProps) {
    const isEdit = auction !== null;
    const firstGreenBeanId = greenBeans[0]?.id.toString() ?? '';
    const { data, errors, post, processing, setData } = useForm<AuctionFormData>({
        ends_at: auction?.ends_at ?? '',
        green_bean_id: auction?.green_bean_id.toString() ?? firstGreenBeanId,
        starts_at: auction?.starts_at ?? '',
        status: auction?.status ?? 'draft',
        title: auction?.title ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(isEdit ? `/admin/auctions/${auction.id}?_method=PUT` : '/admin/auctions');
    };

    return (
        <AppShell>
            <Head title={isEdit ? 'Edit Auction' : 'Tambah Auction'} />

            <FormPageShell
                backHref="/admin/auctions"
                subtitle="Pilih bean, jadwal, dan status dengan hati-hati karena status mengatur akses bidder."
                title={isEdit ? 'Edit Auction' : 'Tambah Auction'}
            >
                        <form className="space-y-4" onSubmit={submit}>
                            <FormField description="Bean menentukan harga awal dan increment bid." error={errors.green_bean_id} label="Green Bean" name="green_bean_id" required>
                                <select
                                    className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-11 w-full rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    id="green_bean_id"
                                    name="green_bean_id"
                                    onChange={(e) => setData('green_bean_id', e.target.value)}
                                    value={data.green_bean_id}
                                >
                                    {greenBeans.map((gb) => (
                                        <option key={gb.id} value={gb.id}>
                                            {gb.name} · {gb.origin}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                            <FormField description="Nama lot yang dilihat bidder di lobby dan room." error={errors.title} label="Title" name="title" required>
                                <Input id="title" name="title" onChange={(e) => setData('title', e.target.value)} value={data.title} />
                            </FormField>
                            <FormField description="Gunakan draft sebelum siap, published untuk antre, live saat bidding dibuka." error={errors.status} label="Status" name="status" required>
                                <select
                                    className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-11 w-full rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    id="status"
                                    name="status"
                                    onChange={(e) => setData('status', e.target.value)}
                                    value={data.status}
                                >
                                    {statuses.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                            <FormField description="Waktu auction mulai menerima bid jika status sudah live." error={errors.starts_at} label="Starts at" name="starts_at" required>
                                <Input id="starts_at" name="starts_at" onChange={(e) => setData('starts_at', e.target.value)} type="datetime-local" value={data.starts_at} />
                            </FormField>
                            <FormField description="Waktu countdown habis dan auction siap ditutup." error={errors.ends_at} label="Ends at" name="ends_at" required>
                                <Input id="ends_at" name="ends_at" onChange={(e) => setData('ends_at', e.target.value)} type="datetime-local" value={data.ends_at} />
                            </FormField>

                            <Button className="w-full min-h-11 font-bold" disabled={processing || greenBeans.length === 0} type="submit">
                                {processing ? 'Menyimpan...' : isEdit ? 'Update auction' : 'Buat auction'}
                            </Button>
                        </form>
            </FormPageShell>
        </AppShell>
    );
}
