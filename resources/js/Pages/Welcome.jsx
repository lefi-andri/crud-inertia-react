import { Head, InfiniteScroll, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Dumbbell,
    Gamepad2,
    Headphones,
    HeartPulse,
    Home,
    Laptop,
    LayoutGrid,
    LoaderCircle,
    LogIn,
    Package,
    PackageOpen,
    RotateCcw,
    Search,
    ShieldCheck,
    ShoppingBag,
    Smartphone,
    Sparkles,
    Truck,
    X,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

const rupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat('id-ID');

const categoryStyles = {
    audio: {
        icon: Headphones,
        surface: 'from-violet-100 via-fuchsia-50 to-white',
        iconColor: 'text-violet-700',
        bubble: 'bg-violet-200/70',
    },
    elektronik: {
        icon: Zap,
        surface: 'from-amber-100 via-orange-50 to-white',
        iconColor: 'text-amber-700',
        bubble: 'bg-amber-200/70',
    },
    fashion: {
        icon: ShoppingBag,
        surface: 'from-rose-100 via-pink-50 to-white',
        iconColor: 'text-rose-700',
        bubble: 'bg-rose-200/70',
    },
    gaming: {
        icon: Gamepad2,
        surface: 'from-indigo-100 via-blue-50 to-white',
        iconColor: 'text-indigo-700',
        bubble: 'bg-indigo-200/70',
    },
    kecantikan: {
        icon: Sparkles,
        surface: 'from-pink-100 via-rose-50 to-white',
        iconColor: 'text-pink-700',
        bubble: 'bg-pink-200/70',
    },
    kesehatan: {
        icon: HeartPulse,
        surface: 'from-emerald-100 via-teal-50 to-white',
        iconColor: 'text-emerald-700',
        bubble: 'bg-emerald-200/70',
    },
    olahraga: {
        icon: Dumbbell,
        surface: 'from-orange-100 via-amber-50 to-white',
        iconColor: 'text-orange-700',
        bubble: 'bg-orange-200/70',
    },
    'perlengkapan-rumah': {
        icon: Home,
        surface: 'from-cyan-100 via-sky-50 to-white',
        iconColor: 'text-cyan-700',
        bubble: 'bg-cyan-200/70',
    },
    smartphone: {
        icon: Smartphone,
        surface: 'from-sky-100 via-blue-50 to-white',
        iconColor: 'text-sky-700',
        bubble: 'bg-sky-200/70',
    },
    workspace: {
        icon: Laptop,
        surface: 'from-slate-200 via-slate-50 to-white',
        iconColor: 'text-slate-700',
        bubble: 'bg-slate-300/70',
    },
};

function categoryStyle(slug) {
    return categoryStyles[slug] || {
        icon: Package,
        surface: 'from-lime-100 via-emerald-50 to-white',
        iconColor: 'text-lime-700',
        bubble: 'bg-lime-200/70',
    };
}

function ProductVisual({ product, className = '' }) {
    const style = categoryStyle(product.category?.slug);
    const Icon = style.icon;
    const image = product.thumbnail_url || product.image_url;

    return (
        <div
            className={`group/visual relative overflow-hidden bg-gradient-to-br ${style.surface} ${className}`}
        >
            {image ? (
                <img
                    src={image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 group-hover/visual:scale-105"
                />
            ) : (
                <>
                    <div
                        className={`absolute -right-8 -top-10 h-32 w-32 rounded-full blur-2xl ${style.bubble}`}
                    />
                    <div className="catalog-grid absolute inset-0 opacity-45" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-24 w-24 rotate-3 items-center justify-center rounded-[2rem] border border-white/80 bg-white/70 shadow-[0_22px_60px_-25px_rgba(15,23,42,0.45)] backdrop-blur-sm transition duration-500 group-hover/visual:-rotate-3 group-hover/visual:scale-105">
                            <Icon
                                aria-hidden="true"
                                className={`h-11 w-11 ${style.iconColor}`}
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function ProductCard({ product }) {
    const available = product.stock > 0;

    return (
        <article className="group overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_18px_45px_-35px_rgba(15,23,42,0.6)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_55px_-30px_rgba(15,23,42,0.35)]">
            <div className="relative">
                <ProductVisual product={product} className="aspect-[4/3]" />
                <span className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700 shadow-sm backdrop-blur-md">
                    {product.category?.name || 'Pilihan'}
                </span>
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {product.sku}
                        </p>
                        <h3 className="mt-1.5 line-clamp-2 text-[17px] font-bold leading-snug text-slate-900">
                            {product.name}
                        </h3>
                    </div>
                    <span
                        className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            available
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-500'
                        }`}
                    >
                        {available ? `${product.stock} stok` : 'Habis'}
                    </span>
                </div>

                <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-relaxed text-slate-500">
                    {product.description ||
                        'Produk pilihan berkualitas untuk melengkapi keseharian Anda.'}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Harga
                        </span>
                        <span className="text-lg font-extrabold tracking-tight text-slate-950">
                            {rupiah.format(product.price)}
                        </span>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition duration-300 group-hover:rotate-[-8deg] group-hover:bg-lime-400 group-hover:text-slate-950">
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </article>
    );
}

export default function Welcome({ auth, products, categories, filters, catalogStats }) {
    const [search, setSearch] = useState(filters.search || '');
    const activeCategory = filters.category ? String(filters.category) : '';
    const featured = products.data.slice(0, 3);

    const visitCatalog = (nextSearch, nextCategory) => {
        const query = {};
        const cleanSearch = nextSearch.trim();

        if (cleanSearch) query.search = cleanSearch;
        if (nextCategory) query.category = nextCategory;

        router.get(route('home'), query, {
            only: ['products', 'filters'],
            reset: ['products'],
            preserveScroll: true,
            preserveState: false,
            replace: true,
        });
    };

    const submitSearch = (event) => {
        event.preventDefault();
        visitCatalog(search, activeCategory);
    };

    const selectCategory = (categoryId) => {
        const nextCategory =
            String(categoryId) === activeCategory ? '' : String(categoryId);
        visitCatalog(search, nextCategory);
    };

    const clearFilters = () => {
        setSearch('');
        visitCatalog('', '');
    };

    return (
        <div className="min-h-screen bg-[#f7f8f3] text-slate-950 selection:bg-lime-300 selection:text-slate-950">
            <Head>
                <title>Katalogin — Pilihan yang pas untuk harimu</title>
                <meta
                    name="description"
                    content="Jelajahi koleksi produk pilihan dari beragam kategori di Katalogin."
                />
            </Head>

            <header className="relative z-20 border-b border-white/10 bg-[#10150f] text-white">
                <div className="mx-auto flex max-w-[90rem] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
                    <Link
                        href={route('home')}
                        className="flex items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300 text-slate-950 shadow-[0_8px_22px_-10px_rgba(190,242,100,0.9)]">
                            <ShoppingBag aria-hidden="true" className="h-5 w-5" />
                        </span>
                        <span className="text-lg font-black tracking-[-0.03em]">
                            Katalogin<span className="text-lime-300">.</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-lime-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                            >
                                Dashboard
                                <ArrowRight aria-hidden="true" className="h-4 w-4" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="hidden items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white sm:inline-flex"
                                >
                                    <LogIn aria-hidden="true" className="h-4 w-4" />
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-lime-300"
                                >
                                    Daftar gratis
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main>
                <section className="relative overflow-hidden bg-[#10150f] pb-28 text-white sm:pb-32">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(190,242,100,0.15),transparent_28%),radial-gradient(circle_at_10%_80%,rgba(45,212,191,0.11),transparent_25%)]" />
                    <div className="catalog-dots absolute inset-0 opacity-20" />

                    <div className="relative mx-auto grid max-w-[90rem] items-center gap-14 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:pb-24 lg:pt-24">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-lime-200/20 bg-lime-200/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-lime-200">
                                <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                                Kurasi baru setiap minggu
                            </div>
                            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
                                Pilihan baik untuk hari yang
                                <span className="ml-3 inline-block text-lime-300">
                                    lebih seru.
                                </span>
                            </h1>
                            <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                                Temukan produk fungsional, penuh gaya, dan sudah
                                dikurasi dari beragam kategori—semuanya dalam satu
                                katalog yang mudah dijelajahi.
                            </p>

                            <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
                                <div>
                                    <div className="text-3xl font-black tracking-tight text-white">
                                        {number.format(catalogStats.products)}+
                                    </div>
                                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                                        Produk pilihan
                                    </div>
                                </div>
                                <div className="h-12 w-px bg-white/15" />
                                <div>
                                    <div className="text-3xl font-black tracking-tight text-white">
                                        {catalogStats.categories}
                                    </div>
                                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                                        Kategori
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative mx-auto hidden h-[29rem] w-full max-w-xl lg:block">
                            <div className="absolute right-0 top-0 w-[68%] rotate-2 overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-sm">
                                {featured[0] && (
                                    <>
                                        <ProductVisual
                                            product={featured[0]}
                                            className="aspect-[5/3] rounded-[1.45rem]"
                                        />
                                        <div className="flex items-center justify-between px-2 pb-2 pt-4">
                                            <div>
                                                <div className="text-sm font-bold">
                                                    {featured[0].name}
                                                </div>
                                                <div className="mt-1 text-xs text-white/50">
                                                    {featured[0].category?.name}
                                                </div>
                                            </div>
                                            <span className="text-sm font-black text-lime-300">
                                                {rupiah.format(featured[0].price)}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {featured.slice(1).map((product, index) => (
                                <div
                                    key={product.id}
                                    className={`absolute w-[45%] overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/10 p-2.5 shadow-2xl backdrop-blur-sm ${
                                        index === 0
                                            ? 'bottom-4 left-1 -rotate-3'
                                            : 'bottom-0 right-4 rotate-3'
                                    }`}
                                >
                                    <ProductVisual
                                        product={product}
                                        className="aspect-square rounded-[1.15rem]"
                                    />
                                    <p className="truncate px-2 pb-1 pt-3 text-xs font-bold">
                                        {product.name}
                                    </p>
                                </div>
                            ))}

                            <div className="absolute left-4 top-10 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/70 px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur-md">
                                <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_0_5px_rgba(190,242,100,0.12)]" />
                                Produk terbaru
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="katalog"
                    className="relative mx-auto -mt-16 max-w-[90rem] px-5 pb-24 sm:px-8 lg:px-12"
                >
                    <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-[0_24px_70px_-25px_rgba(15,23,42,0.25)] sm:p-5">
                        <form
                            onSubmit={submitSearch}
                            className="flex flex-col gap-3 sm:flex-row"
                        >
                            <label className="relative flex-1">
                                <span className="sr-only">Cari produk</span>
                                <Search
                                    aria-hidden="true"
                                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Cari nama produk, SKU, atau kebutuhanmu..."
                                    className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50 pl-12 pr-12 text-sm font-medium text-slate-900 outline-none ring-lime-300 transition placeholder:text-slate-400 focus:border-lime-400 focus:bg-white focus:ring-4 focus:ring-lime-100"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        aria-label="Hapus pencarian"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                                    >
                                        <X aria-hidden="true" className="h-4 w-4" />
                                    </button>
                                )}
                            </label>
                            <button
                                type="submit"
                                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-7 text-sm font-bold text-white transition hover:bg-lime-400 hover:text-slate-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-lime-200"
                            >
                                Cari produk
                                <ArrowRight aria-hidden="true" className="h-4 w-4" />
                            </button>
                        </form>

                        <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            <span className="flex shrink-0 items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                                <LayoutGrid aria-hidden="true" className="h-4 w-4" />
                                Kategori
                            </span>
                            <button
                                type="button"
                                onClick={() => selectCategory('')}
                                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                    !activeCategory
                                        ? 'bg-lime-300 text-slate-950'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                Semua
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => selectCategory(category.id)}
                                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        activeCategory === String(category.id)
                                            ? 'bg-lime-300 text-slate-950'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {category.name}
                                    <span className="ml-1.5 text-xs opacity-60">
                                        {category.products_count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-7 mt-12 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                                Temukan favoritmu
                            </p>
                            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
                                {filters.search
                                    ? `Hasil untuk “${filters.search}”`
                                    : 'Jelajahi semua produk'}
                            </h2>
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                            Menampilkan{' '}
                            <span className="font-bold text-slate-900">
                                {number.format(products.data.length)}
                            </span>{' '}
                            dari {number.format(products.total)} produk
                        </p>
                    </div>

                    {products.data.length ? (
                        <InfiniteScroll
                            data="products"
                            manual
                            onlyNext
                            preserveUrl={false}
                            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            loading={
                                <div className="mt-10 flex justify-center">
                                    <LoaderCircle className="h-6 w-6 animate-spin text-slate-500" />
                                </div>
                            }
                            next={({ loading, fetch, hasMore }) => (
                                <div className="mt-10 flex flex-col items-center gap-3">
                                    {hasMore ? (
                                        <button
                                            type="button"
                                            onClick={fetch}
                                            disabled={loading}
                                            className="group inline-flex min-w-52 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-900 shadow-sm transition hover:border-slate-950 hover:bg-slate-950 hover:text-white disabled:cursor-wait disabled:opacity-60"
                                        >
                                            {loading ? (
                                                <LoaderCircle
                                                    aria-hidden="true"
                                                    className="h-4 w-4 animate-spin"
                                                />
                                            ) : (
                                                <PackageOpen
                                                    aria-hidden="true"
                                                    className="h-4 w-4 transition group-hover:-translate-y-0.5"
                                                />
                                            )}
                                            {loading
                                                ? 'Memuat produk...'
                                                : 'Muat lebih banyak'}
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                                            <span className="h-px w-8 bg-slate-300" />
                                            Semua produk sudah ditampilkan
                                            <span className="h-px w-8 bg-slate-300" />
                                        </div>
                                    )}
                                </div>
                            )}
                        >
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </InfiniteScroll>
                    ) : (
                        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                <PackageOpen aria-hidden="true" className="h-7 w-7" />
                            </div>
                            <h3 className="mt-5 text-xl font-black text-slate-900">
                                Produk belum ditemukan
                            </h3>
                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                Coba kata kunci lain atau hapus filter kategori untuk
                                melihat lebih banyak pilihan.
                            </p>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-lime-400 hover:text-slate-950"
                            >
                                <RotateCcw aria-hidden="true" className="h-4 w-4" />
                                Reset pencarian
                            </button>
                        </div>
                    )}
                </section>

                <section className="border-y border-slate-200 bg-white">
                    <div className="mx-auto grid max-w-[90rem] divide-y divide-slate-200 px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-12">
                        {[
                            [Truck, 'Pengiriman cepat', 'Diproses dengan rapi dan tepat waktu.'],
                            [ShieldCheck, 'Produk terkurasi', 'Pilihan berkualitas yang layak dibawa pulang.'],
                            [RotateCcw, 'Belanja lebih tenang', 'Informasi stok dan produk selalu transparan.'],
                        ].map(([Icon, title, description]) => (
                            <div key={title} className="flex items-center gap-4 px-2 py-8 md:px-7">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lime-100 text-emerald-800">
                                    <Icon aria-hidden="true" className="h-5 w-5" />
                                </span>
                                <div>
                                    <h3 className="text-sm font-extrabold text-slate-900">
                                        {title}
                                    </h3>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="bg-[#10150f] text-white">
                <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300 text-slate-950">
                            <ShoppingBag aria-hidden="true" className="h-4 w-4" />
                        </span>
                        <div>
                            <div className="font-black tracking-tight">Katalogin.</div>
                            <div className="text-xs text-slate-500">
                                Pilihan yang pas, untuk setiap hari.
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} Katalogin. Dibuat untuk menemukan
                        barang baik.
                    </p>
                </div>
            </footer>
        </div>
    );
}
