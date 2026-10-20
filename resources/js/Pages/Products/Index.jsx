import Pagination from '@/Components/Pagination';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, ImageIcon, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });

export default function Index({ products, categories, filters, can }) {
    const [search, setSearch] = useState(filters.search || '');
    const options = categories.map((category) => ({ value: category.id, label: category.name }));
    const [category, setCategory] = useState(options.find((item) => String(item.value) === String(filters.category)) || null);

    const submitSearch = (event) => {
        event.preventDefault();
        router.get(route('products.index'), { search: search || undefined, category: category?.value || undefined }, {
            preserveState: true,
            replace: true,
        });
    };

    const destroy = (product) => {
        if (!window.confirm(`Hapus produk “${product.name}”?`)) return;
        router.delete(route('products.destroy', product.id), {
            preserveScroll: true,
            onError: () => toast.error('Produk gagal dihapus.'),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Produk</h2>}>
            <Head title="Produk" />
            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <form onSubmit={submitSearch} className="flex flex-1 flex-col gap-2 sm:flex-row">
                                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, SKU, atau deskripsi..." className="sm:max-w-sm" />
                                <Select
                                    value={category}
                                    onChange={setCategory}
                                    options={options}
                                    isClearable
                                    isSearchable
                                    placeholder="Semua kategori"
                                    className="min-w-56 text-sm"
                                    classNamePrefix="react-select"
                                />
                                <Button type="submit" variant="outline"><Search /> Cari</Button>
                            </form>
                            {can.create && <Button asChild><Link href={route('products.create')}><Plus /> Tambah Produk</Link></Button>}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-gray-50 text-xs uppercase text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                    <tr><th className="px-4 py-3">Produk</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Harga</th><th className="px-4 py-3">Stok</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Aksi</th></tr>
                                </thead>
                                <tbody className="divide-y dark:divide-gray-700">
                                    {products.data.map((product) => (
                                        <tr key={product.id} className="text-gray-700 dark:text-gray-200">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {product.thumbnail_url ? <img src={product.thumbnail_url} alt={product.name} className="h-12 w-12 rounded-lg object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400"><ImageIcon /></div>}
                                                    <div><div className="font-medium">{product.name}</div><div className="text-xs text-gray-500">{product.sku}</div></div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{product.category?.name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{rupiah.format(product.price)}</td>
                                            <td className="px-4 py-3">{product.stock}</td>
                                            <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{product.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                            <td className="px-4 py-3"><div className="flex justify-end gap-2">
                                                {can.update && <Button asChild size="icon-sm" variant="outline" title="Edit"><Link href={route('products.edit', product.id)}><Edit /></Link></Button>}
                                                {can.delete && <Button type="button" size="icon-sm" variant="destructive" title="Hapus" onClick={() => destroy(product)}><Trash2 /></Button>}
                                            </div></td>
                                        </tr>
                                    ))}
                                    {!products.data.length && <tr><td colSpan="6" className="px-4 py-12 text-center text-gray-500">Produk tidak ditemukan.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={products.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
