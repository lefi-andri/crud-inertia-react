<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductCategoryRequest;
use App\Http\Requests\UpdateProductCategoryRequest;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', ProductCategory::class);
        $filters = $request->validate(['search' => ['nullable', 'string', 'max:100']]);

        $categories = ProductCategory::query()
            ->withCount('products')
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where(
                fn ($query) => $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
            ))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('ProductCategories/Index', [
            'categories' => $categories,
            'filters' => ['search' => $filters['search'] ?? ''],
            'can' => [
                'create' => $request->user()->can('categories.create'),
                'update' => $request->user()->can('categories.update'),
                'delete' => $request->user()->can('categories.delete'),
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', ProductCategory::class);

        return Inertia::render('ProductCategories/Form');
    }

    public function store(StoreProductCategoryRequest $request): RedirectResponse
    {
        ProductCategory::create([
            ...$request->validated(),
            'slug' => $this->uniqueSlug((string) $request->string('name')),
        ]);

        return to_route('product-categories.index')->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function edit(ProductCategory $productCategory): Response
    {
        Gate::authorize('update', $productCategory);

        return Inertia::render('ProductCategories/Form', ['category' => $productCategory]);
    }

    public function update(UpdateProductCategoryRequest $request, ProductCategory $productCategory): RedirectResponse
    {
        $data = $request->validated();
        if ($data['name'] !== $productCategory->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $productCategory->id);
        }
        $productCategory->update($data);

        return to_route('product-categories.index')->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(ProductCategory $productCategory): RedirectResponse
    {
        Gate::authorize('delete', $productCategory);

        if ($productCategory->products()->exists()) {
            return back()->with('error', 'Kategori masih digunakan oleh produk dan tidak dapat dihapus.');
        }

        $productCategory->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }

    private function uniqueSlug(string $name, ?int $exceptId = null): string
    {
        $base = Str::slug($name) ?: 'category';
        $slug = $base;
        $counter = 2;

        while (ProductCategory::where('slug', $slug)->when($exceptId, fn ($query) => $query->whereKeyNot($exceptId))->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
