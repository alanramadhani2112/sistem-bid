import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';

import { AppShell } from '../../../Layouts/AppShell';

type GreenBeanForm = {
    name: string;
    origin: string;
    process: string;
    weight_gram: string;
    description: string;
    image: File | null;
    starting_price: string;
    bid_increment: string;
};

type GreenBean = Omit<GreenBeanForm, 'image' | 'weight_gram' | 'starting_price' | 'bid_increment'> & {
    id: number;
    weight_gram: number;
    image_path: string | null;
    starting_price: number;
    bid_increment: number;
};

type GreenBeansFormProps = {
    greenBean: GreenBean | null;
};

export default function GreenBeansForm({ greenBean }: GreenBeansFormProps) {
    const isEdit = greenBean !== null;
    const { data, errors, post, processing, setData } = useForm<GreenBeanForm>({
        bid_increment: greenBean?.bid_increment.toString() ?? '100000',
        description: greenBean?.description ?? '',
        image: null,
        name: greenBean?.name ?? '',
        origin: greenBean?.origin ?? '',
        process: greenBean?.process ?? '',
        starting_price: greenBean?.starting_price.toString() ?? '1000000',
        weight_gram: greenBean?.weight_gram.toString() ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(isEdit ? `/admin/green-beans/${greenBean.id}?_method=PUT` : '/admin/green-beans', {
            forceFormData: true,
        });
    };

    return (
        <AppShell>
            <Head title={isEdit ? 'Edit Green Bean' : 'Tambah Green Bean'} />

            <section className="space-y-4">
                <Link className="text-sm font-semibold text-lime-200" href="/admin/green-beans">
                    Kembali
                </Link>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime-200">Admin</p>
                    <h1 className="mt-1 text-3xl font-bold text-white">{isEdit ? 'Edit Green Bean' : 'Tambah Green Bean'}</h1>
                </div>

                <form className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5" onSubmit={submit}>
                    <Field error={errors.name} label="Nama">
                        <input className="field-input" onChange={(event) => setData('name', event.target.value)} value={data.name} />
                    </Field>
                    <Field error={errors.origin} label="Origin">
                        <input className="field-input" onChange={(event) => setData('origin', event.target.value)} value={data.origin} />
                    </Field>
                    <Field error={errors.process} label="Process">
                        <input className="field-input" onChange={(event) => setData('process', event.target.value)} value={data.process} />
                    </Field>
                    <Field error={errors.weight_gram} label="Weight gram">
                        <input
                            className="field-input"
                            inputMode="numeric"
                            min="1"
                            onChange={(event) => setData('weight_gram', event.target.value)}
                            type="number"
                            value={data.weight_gram}
                        />
                    </Field>
                    <Field error={errors.starting_price} label="Starting price">
                        <input
                            className="field-input"
                            inputMode="numeric"
                            min="1000"
                            onChange={(event) => setData('starting_price', event.target.value)}
                            type="number"
                            value={data.starting_price}
                        />
                    </Field>
                    <Field error={errors.bid_increment} label="Bid increment">
                        <input
                            className="field-input"
                            inputMode="numeric"
                            min="1000"
                            onChange={(event) => setData('bid_increment', event.target.value)}
                            type="number"
                            value={data.bid_increment}
                        />
                    </Field>
                    <Field error={errors.description} label="Description">
                        <textarea
                            className="field-input min-h-28 py-3"
                            onChange={(event) => setData('description', event.target.value)}
                            value={data.description}
                        />
                    </Field>
                    <Field error={errors.image} label="Image">
                        <input
                            accept="image/*"
                            className="field-input py-3"
                            onChange={(event) => setData('image', event.target.files?.[0] ?? null)}
                            type="file"
                        />
                    </Field>

                    <button
                        className="min-h-11 w-full rounded-2xl bg-lime-300 px-4 py-3 text-sm font-bold text-stone-950 disabled:opacity-50"
                        disabled={processing}
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
