<?php

use App\Models\Product;
use App\Models\ProductCategory;
use Database\Seeders\ProductCategorySeeder;
use Database\Seeders\ProductSeeder;
use Inertia\Testing\AssertableInertia as Assert;

function storefrontProduct(ProductCategory $category, int $number, array $attributes = []): Product
{
    return Product::create([
        'product_category_id' => $category->id,
        'sku' => "TEST-{$category->id}-{$number}",
        'name' => "Produk Uji {$number}",
        'slug' => "produk-uji-{$category->id}-{$number}",
        'description' => 'Produk untuk pengujian katalog.',
        'price' => 100000 + $number,
        'stock' => 10,
        'is_active' => true,
        ...$attributes,
    ]);
}

test('public storefront only displays active products from active categories', function () {
    $activeCategory = ProductCategory::create([
        'name' => 'Aktif',
        'slug' => 'aktif',
        'is_active' => true,
    ]);
    $inactiveCategory = ProductCategory::create([
        'name' => 'Nonaktif',
        'slug' => 'nonaktif',
        'is_active' => false,
    ]);

    foreach (range(1, 13) as $number) {
        storefrontProduct($activeCategory, $number);
    }

    storefrontProduct($activeCategory, 14, ['is_active' => false]);
    storefrontProduct($inactiveCategory, 15);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->has('products.data', 12)
            ->where('products.total', 13)
            ->has('categories', 1)
            ->where('categories.0.products_count', 13)
            ->where('catalogStats.products', 13));
});

test('public storefront can search and filter products', function () {
    $audio = ProductCategory::create(['name' => 'Audio', 'slug' => 'audio', 'is_active' => true]);
    $gaming = ProductCategory::create(['name' => 'Gaming', 'slug' => 'gaming', 'is_active' => true]);

    storefrontProduct($audio, 1, ['name' => 'Headphone Studio', 'description' => 'Suara jernih']);
    storefrontProduct($gaming, 2, ['name' => 'Headset Gaming', 'description' => 'Suara imersif']);
    storefrontProduct($gaming, 3, ['name' => 'Keyboard Mechanical']);

    $this->get(route('home', ['search' => 'suara', 'category' => $gaming->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Headset Gaming')
            ->where('filters.search', 'suara')
            ->where('filters.category', $gaming->id));
});

test('catalog seeders create exactly 150 reusable sample products', function () {
    $this->seed(ProductCategorySeeder::class);
    $this->seed(ProductSeeder::class);
    $this->seed(ProductCategorySeeder::class);
    $this->seed(ProductSeeder::class);

    expect(ProductCategory::count())->toBe(10)
        ->and(Product::count())->toBe(150);
});
