import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Form({ category = null }) {
    const editing = Boolean(category);
    const { data, setData, post, processing, errors } = useForm({
        _method: editing ? 'put' : 'post',
        name: category?.name || '',
        description: category?.description || '',
        is_active: category?.is_active ?? true,
    });

    const submit = (event) => {
        event.preventDefault();
        post(editing ? route('product-categories.update', category.id) : route('product-categories.store'), {
            onError: () => toast.error('Periksa kembali data kategori.'),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{editing ? 'Edit Kategori' : 'Tambah Kategori'}</h2>}>
            <Head title={editing ? 'Edit Kategori' : 'Tambah Kategori'} />
            <div className="py-10"><div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <form onSubmit={submit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <div><InputLabel htmlFor="name" value="Nama Kategori" /><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1" autoFocus /><InputError message={errors.name} className="mt-2" /></div>
                    <div><InputLabel htmlFor="description" value="Deskripsi" /><textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows="5" className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900" /><InputError message={errors.description} className="mt-2" /></div>
                    <label className="flex items-center gap-3"><input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="rounded border-gray-300" /><span className="text-sm text-gray-700 dark:text-gray-200">Kategori aktif</span></label>
                    <div className="flex justify-end gap-3 border-t pt-5"><Button asChild type="button" variant="outline"><Link href={route('product-categories.index')}><ArrowLeft /> Batal</Link></Button><Button type="submit" disabled={processing}><Save /> {processing ? 'Menyimpan...' : 'Simpan'}</Button></div>
                </form>
            </div></div>
        </AuthenticatedLayout>
    );
}
