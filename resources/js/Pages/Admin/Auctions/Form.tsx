import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';

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

            <section className="space-y-4">
                <Link className="text-sm font-semibold text-lime-200" href="/admin/auctions">
                    Kembali
                </Link>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Admin</p>
                    <h1 className="mt-1 text-3xl font-bold text-white">{isEdit ? 'Edit Auction' : 'Tambah Auction'}</h1>
                </div>

                <form className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5" onSubmit={submit}>
                    <Field error={errors.green_bean_id} label="Green Bean">
                        <select className="field-input" onChange={(event) => setData('green_bean_id', event.target.value)} value={data.green_bean_id}>
                            {greenBeans.map((greenBean) => (
                                <option key={greenBean.id} value={greenBean.id}>
                                    {greenBean.name} · {greenBean.origin}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field error={errors.title} label="Title">
                        <input className="field-input" onChange={(event) => setData('title', event.target.value)} value={data.title} />
                    </Field>
                    <Field error={errors.status} label="Status">
                        <select className="field-input" onChange={(event) => setData('status', event.target.value)} value={data.status}>
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field error={errors.starts_at} label="Starts at">
                        <input className="field-input" onChange={(event) => setData('starts_at', event.target.value)} type="datetime-local" value={data.starts_at} />
                    </Field>
                    <Field error={errors.ends_at} label="Ends at">
                        <input className="field-input" onChange={(event) => setData('ends_at', event.target.value)} type="datetime-local" value={data.ends_at} />
                    </Field>

                    <button
                        className="min-h-11 w-full rounded-2xl bg-lime-300 px-4 py-3 text-sm font-bold text-stone-950 disabled:opacity-50"
                        disabled={processing || greenBeans.length === 0}
                        type="submit"
                    >
                        Simpan
                    </button>
                </form>
            </section>
        </AppShell>
    );
}

function Field({ children, error, label }: { children: ReactNode; error?: string; label: string }) {
    return (
        <label className="block text-sm font-medium text-stone-200">
            {label}
            <div className="mt-2">{children}</div>
            {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
        </label>
    );
}
