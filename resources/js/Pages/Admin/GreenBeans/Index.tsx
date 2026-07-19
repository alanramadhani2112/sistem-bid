import { Head, Link, router } from '@inertiajs/react';

import { AppShell } from '../../../Layouts/AppShell';

type GreenBean = {
    id: number;
    name: string;
    origin: string;
    process: string;
    weight_gram: number;
    starting_price: number;
    bid_increment: number;
    image_path: string | null;
};

type GreenBeansIndexProps = {
    greenBeans: GreenBean[];
};

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        currency: 'IDR',
        maximumFractionDigits: 0,
        style: 'currency',
    }).format(value);

export default function GreenBeansIndex({ greenBeans }: GreenBeansIndexProps) {
    const destroy = (greenBean: GreenBean) => {
        if (confirm(`Hapus ${greenBean.name}?`)) {
            router.delete(`/admin/green-beans/${greenBean.id}`, { preserveScroll: true });
        }
    };

    return (
        <AppShell>
            <Head title="Admin Green Beans" />

            <section className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Admin</p>
                        <h1 className="mt-1 text-3xl font-bold text-white">Green Beans</h1>
                    </div>
                    <Link
                        className="min-h-11 rounded-2xl bg-lime-300 px-4 py-3 text-sm font-bold text-stone-950"
                        href="/admin/green-beans/create"
                    >
                        Tambah
                    </Link>
                </div>

                <div className="space-y-3">
                    {greenBeans.map((greenBean) => (
                        <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5" key={greenBean.id}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">{greenBean.name}</h2>
                                    <p className="mt-1 text-sm text-stone-300">
                                        {greenBean.origin} · {greenBean.process} · {greenBean.weight_gram}g
                                    </p>
                                </div>
                                <span className="rounded-full bg-lime-300/10 px-3 py-1 text-xs font-semibold text-lime-200">
                                    {formatRupiah(greenBean.starting_price)}
                                </span>
                            </div>
                            <p className="mt-3 text-sm text-stone-400">Increment {formatRupiah(greenBean.bid_increment)}</p>
                            <div className="mt-4 flex gap-2">
                                <Link
                                    className="min-h-11 flex-1 rounded-2xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-stone-100"
                                    href={`/admin/green-beans/${greenBean.id}/edit`}
                                >
                                    Edit
                                </Link>
                                <button
                                    className="min-h-11 flex-1 rounded-2xl border border-red-300/30 px-4 py-3 text-sm font-semibold text-red-200"
                                    onClick={() => destroy(greenBean)}
                                    type="button"
                                >
                                    Hapus
                                </button>
                            </div>
                        </article>
                    ))}

                    {greenBeans.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-stone-300">
                            Belum ada green beans.
                        </div>
                    ) : null}
                </div>
            </section>
        </AppShell>
    );
}
