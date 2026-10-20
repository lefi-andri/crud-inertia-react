import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';

export default function Form({ product = null, categories }) {
    const editing = Boolean(product);
    const options = useMemo(() => categories.map((category) => ({ value: category.id, label: category.name })), [categories]);
    const [preview, setPreview] = useState(product?.image_url || null);
    const { data, setData, post, processing, errors } = useForm({
        _method: editing ? 'put' : 'post',
        product_category_id: product?.product_category_id || '',
        sku: product?.sku || '',
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        stock: product?.stock ?? 0,
        is_active: product?.is_active ?? true,
        image: null,
    });

    const submit = (event) => {
        event.preventDefault();
        post(editing ? route('products.update', product.id) : route('products.store'), {
            forceFormData: true,
            onError: () => toast.error('Periksa kembali data produk.'),
        });
    };

    const pickImage = (event) => {
        const file = event.target.files[0] || null;
        setData('image', file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{editing ? 'Edit Produk' : 'Tambah Produk'}</h2>}>
            <Head title={editing ? 'Edit Produk' : 'Tambah Produk'} />
            <div className="py-10"><div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <div><InputLabel value="Kategori" /><Select
                        value={options.find((item) => String(item.value) === String(data.product_category_id)) || null}
                        onChange={(option) => setData('product_category_id', option?.value || '')}
                        options={options} isSearchable placeholder="Cari dan pilih kategori..." className="mt-1 text-sm" classNamePrefix="react-select"
                    /><InputError message={errors.product_category_id} className="mt-2" /></div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div><InputLabel htmlFor="sku" value="SKU" /><Input id="sku" value={data.sku} onChange={(e) => setData('sku', e.target.value)} className="mt-1" /><InputError message={errors.sku} className="mt-2" /></div>
                        <div><InputLabel htmlFor="name" value="Nama Produk" /><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1" /><InputError message={errors.name} className="mt-2" /></div>
                        <div><InputLabel htmlFor="price" value="Harga" /><Input id="price" type="number" min="0" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} className="mt-1" /><InputError message={errors.price} className="mt-2" /></div>
                        <div><InputLabel htmlFor="stock" value="Stok" /><Input id="stock" type="number" min="0" value={data.stock} onChange={(e) => setData('stock', e.target.value)} className="mt-1" /><InputError message={errors.stock} className="mt-2" /></div>
                    </div>

                    <div><InputLabel htmlFor="description" value="Deskripsi" /><textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows="4" className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900" /><InputError message={errors.description} className="mt-2" /></div>

                    <div><InputLabel htmlFor="image" value="Gambar Produk" />
                        {preview && <img src={preview} alt="Pratinjau produk" className="my-3 h-40 w-40 rounded-lg border object-cover" />}
                        <Input id="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={pickImage} className="mt-1" />
                        <p className="mt-1 text-xs text-gray-500">JPG, PNG, atau WebP. Maksimal 4 MB.</p><InputError message={errors.image} className="mt-2" />
                    </div>

                    <label className="flex items-center gap-3"><input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="rounded border-gray-300" /><span className="text-sm text-gray-700 dark:text-gray-200">Produk aktif</span></label>
                    <div className="flex justify-end gap-3 border-t pt-5"><Button asChild type="button" variant="outline"><Link href={route('products.index')}><ArrowLeft /> Batal</Link></Button><Button type="submit" disabled={processing}><Save /> {processing ? 'Menyimpan...' : 'Simpan'}</Button></div>
                </form>
            </div></div>
        </AuthenticatedLayout>
    );
}
