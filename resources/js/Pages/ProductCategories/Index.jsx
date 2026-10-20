import Pagination from '@/Components/Pagination';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Index({ categories, filters, can }) {
    const [search, setSearch] = useState(filters.search || '');

    const submitSearch = (event) => {
        event.preventDefault();
        router.get(route('product-categories.index'), { search: search || undefined }, { preserveState: true, replace: true });
    };

    const destroy = (category) => {
        if (!window.confirm(`Hapus kategori “${category.name}”?`)) return;
        router.delete(route('product-categories.destroy', category.id), {
            preserveScroll: true,
            onError: () => toast.error('Kategori gagal dihapus.'),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Kategori Produk</h2>}>
            <Head title="Kategori Produk" />
            <div className="py-10"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <form onSubmit={submitSearch} className="flex flex-1 gap-2"><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kategori..." className="max-w-sm" /><Button type="submit" variant="outline"><Search /> Cari</Button></form>
                        {can.create && <Button asChild><Link href={route('product-categories.create')}><Plus /> Tambah Kategori</Link></Button>}
                    </div>
                    <div className="overflow-x-auto"><table className="w-full text-left text-sm">
                        <thead className="border-b bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-700 dark:text-gray-300"><tr><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Deskripsi</th><th className="px-4 py-3">Produk</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {categories.data.map((category) => <tr key={category.id} className="text-gray-700 dark:text-gray-200">
                                <td className="px-4 py-3 font-medium">{category.name}</td><td className="max-w-md px-4 py-3 text-gray-500">{category.description || '—'}</td><td className="px-4 py-3">{category.products_count}</td>
                                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${category.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{category.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                <td className="px-4 py-3"><div className="flex justify-end gap-2">{can.update && <Button asChild size="icon-sm" variant="outline"><Link href={route('product-categories.edit', category.id)}><Edit /></Link></Button>}{can.delete && <Button type="button" size="icon-sm" variant="destructive" onClick={() => destroy(category)}><Trash2 /></Button>}</div></td>
                            </tr>)}
                            {!categories.data.length && <tr><td colSpan="5" className="px-4 py-12 text-center text-gray-500">Kategori tidak ditemukan.</td></tr>}
                        </tbody>
                    </table></div>
                    <Pagination links={categories.links} />
                </div>
            </div></div>
        </AuthenticatedLayout>
    );
}
