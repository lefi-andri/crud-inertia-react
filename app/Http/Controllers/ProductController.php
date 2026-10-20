<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Product::class);

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'integer', 'exists:product_categories,id'],
        ]);

        $products = Product::query()
            ->with(['category:id,name', 'media'])
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where(
                fn ($query) => $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
            ))
            ->when($filters['category'] ?? null, fn ($query, $category) => $query->where('product_category_id', $category))
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Product $product) => $this->productData($product));

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => ProductCategory::orderBy('name')->get(['id', 'name']),
            'filters' => ['search' => $filters['search'] ?? '', 'category' => $filters['category'] ?? null],
            'can' => [
                'create' => $request->user()->can('products.create'),
                'update' => $request->user()->can('products.update'),
                'delete' => $request->user()->can('products.delete'),
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Product::class);

        return Inertia::render('Products/Form', [
            'categories' => ProductCategory::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $data = $request->safe()->except('image');
            $data['slug'] = $this->uniqueSlug($data['name']);
            $product = Product::create($data);

            if ($request->hasFile('image')) {
                $product->addMediaFromRequest('image')->toMediaCollection('image');
            }
        });

        return to_route('products.index')->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit(Product $product): Response
    {
        Gate::authorize('update', $product);
        $product->load('media');

        return Inertia::render('Products/Form', [
            'product' => $this->productData($product),
            'categories' => ProductCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        DB::transaction(function () use ($request, $product) {
            $data = $request->safe()->except('image');
            if ($data['name'] !== $product->name) {
                $data['slug'] = $this->uniqueSlug($data['name'], $product->id);
            }
            $product->update($data);

            if ($request->hasFile('image')) {
                $product->addMediaFromRequest('image')->toMediaCollection('image');
            }
        });

        return to_route('products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        Gate::authorize('delete', $product);
        $product->delete();

        return back()->with('success', 'Produk berhasil dihapus.');
    }

    private function productData(Product $product): array
    {
        return [
            'id' => $product->id,
            'product_category_id' => $product->product_category_id,
            'category' => $product->category,
            'sku' => $product->sku,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => $product->price,
            'stock' => $product->stock,
            'is_active' => $product->is_active,
            'image_url' => $product->getFirstMediaUrl('image'),
            'thumbnail_url' => $product->getFirstMediaUrl('image', 'thumb'),
        ];
    }

    private function uniqueSlug(string $name, ?int $exceptId = null): string
    {
        $base = Str::slug($name) ?: 'product';
        $slug = $base;
        $counter = 2;

        while (Product::where('slug', $slug)->when($exceptId, fn ($query) => $query->whereKeyNot($exceptId))->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
