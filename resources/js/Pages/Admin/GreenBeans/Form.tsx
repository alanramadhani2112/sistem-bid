import { Head, useForm } from '@inertiajs/react';
import { type FormEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { FormField } from '@/components/app/FormField';
import { BackLink } from '@/components/app/BackLink';
import { PageHeader } from '@/components/app/PageHeader';
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

    const [preview, setPreview] = useState<string | null>(
        greenBean?.image_path ? `/storage/${greenBean.image_path}` : null,
    );

    useEffect(() => {
        if (!data.image) return;
        const url = URL.createObjectURL(data.image);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [data.image]);

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
                <BackLink href="/admin/green-beans" />

                <PageHeader
                    accent="Admin"
                    subtitle="Data ini muncul ke bidder, jadi isi origin, proses, harga, dan increment dengan jelas."
                    title={isEdit ? 'Edit Green Bean' : 'Tambah Green Bean'}
                />

                <Card className="border-border/80 bg-card/95 shadow-sm">
                    <CardContent className="p-5">
                        <form className="space-y-4" onSubmit={submit}>
                            <FormField description="Nama produk yang muncul di auction card." error={errors.name} label="Nama" name="name" required>
                                <Input id="name" name="name" onChange={(e) => setData('name', e.target.value)} value={data.name} />
                            </FormField>
                            <FormField description="Contoh: Kintamani, Gayo, Toraja." error={errors.origin} label="Origin" name="origin" required>
                                <Input id="origin" name="origin" onChange={(e) => setData('origin', e.target.value)} value={data.origin} />
                            </FormField>
                            <FormField description="Contoh: natural, washed, honey." error={errors.process} label="Process" name="process" required>
                                <Input id="process" name="process" onChange={(e) => setData('process', e.target.value)} value={data.process} />
                            </FormField>
                            <FormField description="Isi berat dalam gram." error={errors.weight_gram} label="Weight gram" name="weight_gram" required>
                                <Input id="weight_gram" inputMode="numeric" min="1" name="weight_gram" onChange={(e) => setData('weight_gram', e.target.value)} type="number" value={data.weight_gram} />
                            </FormField>
                            <FormField description="Harga awal dalam rupiah, tanpa titik atau koma." error={errors.starting_price} label="Starting price" name="starting_price" required>
                                <Input id="starting_price" inputMode="numeric" min="1000" name="starting_price" onChange={(e) => setData('starting_price', e.target.value)} type="number" value={data.starting_price} />
                            </FormField>
                            <FormField description="Kenaikan minimum tiap bid dalam rupiah." error={errors.bid_increment} label="Bid increment" name="bid_increment" required>
                                <Input id="bid_increment" inputMode="numeric" min="1000" name="bid_increment" onChange={(e) => setData('bid_increment', e.target.value)} type="number" value={data.bid_increment} />
                            </FormField>
                            <FormField description="Catatan rasa atau detail lot untuk membantu bidder memahami produk." error={errors.description} label="Description" name="description">
                                <Textarea id="description" name="description" onChange={(e) => setData('description', e.target.value)} rows={4} value={data.description} />
                            </FormField>
                            <FormField description="Gunakan foto jelas; biarkan kosong jika belum ada." error={errors.image} label="Image" name="image">
                                {preview && (
                                    <div className="mb-2 overflow-hidden rounded-lg border border-border">
                                        <img alt="Preview" className="h-40 w-full object-cover" src={preview} />
                                    </div>
                                )}
                                <Input accept="image/*" id="image" name="image" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} type="file" />
                            </FormField>

                            <Button className="w-full min-h-11 font-bold" disabled={processing} type="submit">
                                {processing ? 'Menyimpan...' : isEdit ? 'Update green bean' : 'Simpan green bean'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </section>
        </AppShell>
    );
}
