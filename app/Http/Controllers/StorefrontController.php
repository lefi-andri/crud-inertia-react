<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'integer', 'exists:product_categories,id'],
        ]);

        $search = trim($filters['search'] ?? '');
        $category = isset($filters['category']) ? (int) $filters['category'] : null;

        $products = Product::query()
            ->with(['category:id,name,slug', 'media'])
            ->where('is_active', true)
            ->whereHas('category', fn (Builder $query) => $query->where('is_active', true))
            ->when($search, fn (Builder $query) => $query->where(function (Builder $query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            }))
            ->when($category, fn (Builder $query, int $category) => $query->where('product_category_id', $category))
            ->latest('id')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Product $product) => [
                'id' => $product->id,
                'category' => $product->category,
                'sku' => $product->sku,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'image_url' => $product->getFirstMediaUrl('image'),
                'thumbnail_url' => $product->getFirstMediaUrl('image', 'thumb'),
            ]);

        return Inertia::render('Welcome', [
            'products' => Inertia::scroll($products),
            'categories' => fn () => ProductCategory::query()
                ->where('is_active', true)
                ->withCount(['products' => fn (Builder $query) => $query->where('is_active', true)])
                ->having('products_count', '>', 0)
                ->orderBy('name')
                ->get(['id', 'name', 'slug']),
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
            'catalogStats' => fn () => [
                'products' => Product::query()
                    ->where('is_active', true)
                    ->whereHas('category', fn (Builder $query) => $query->where('is_active', true))
                    ->count(),
                'categories' => ProductCategory::query()
                    ->where('is_active', true)
                    ->whereHas('products', fn (Builder $query) => $query->where('is_active', true))
                    ->count(),
            ],
        ]);
    }
}
