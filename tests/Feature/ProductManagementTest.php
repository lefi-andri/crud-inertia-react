<?php

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

beforeEach(function () {
    app(PermissionRegistrar::class)->forgetCachedPermissions();

    foreach ([
        'products.view', 'products.create', 'products.update', 'products.delete',
        'categories.view', 'categories.create', 'categories.update', 'categories.delete',
    ] as $permission) {
        Permission::create(['name' => $permission]);
    }

    $admin = Role::create(['name' => 'admin']);
    $admin->givePermissionTo(Permission::all());
});

function adminUser(): User
{
    $user = User::factory()->create();
    $user->assignRole('admin');

    return $user;
}

test('admin can create a category', function () {
    $response = $this->actingAs(adminUser())->post(route('product-categories.store'), [
        'name' => 'Elektronik',
        'description' => 'Perangkat elektronik',
        'is_active' => true,
    ]);

    $response->assertSessionHasNoErrors()->assertRedirect(route('product-categories.index'));
    $this->assertDatabaseHas('product_categories', ['name' => 'Elektronik', 'slug' => 'elektronik']);
});

test('admin can create a product with an image', function () {
    Storage::fake('public');
    $category = ProductCategory::create(['name' => 'Elektronik', 'slug' => 'elektronik', 'is_active' => true]);

    $response = $this->actingAs(adminUser())->post(route('products.store'), [
        'product_category_id' => $category->id,
        'sku' => 'SKU-001',
        'name' => 'Headphone Nirkabel',
        'description' => 'Headphone berkualitas',
        'price' => 350000,
        'stock' => 12,
        'is_active' => true,
        'image' => UploadedFile::fake()->image('headphone.jpg', 600, 600),
    ]);

    $response->assertSessionHasNoErrors()->assertRedirect(route('products.index'));
    $product = Product::first();
    expect($product)->not->toBeNull()
        ->and($product->getFirstMedia('image'))->not->toBeNull();
});

test('product list can be searched', function () {
    $category = ProductCategory::create(['name' => 'Elektronik', 'slug' => 'elektronik', 'is_active' => true]);
    Product::create(['product_category_id' => $category->id, 'sku' => 'PHONE-1', 'name' => 'Smartphone', 'slug' => 'smartphone', 'price' => 100, 'stock' => 1, 'is_active' => true]);
    Product::create(['product_category_id' => $category->id, 'sku' => 'LAPTOP-1', 'name' => 'Laptop', 'slug' => 'laptop', 'price' => 200, 'stock' => 1, 'is_active' => true]);

    $this->actingAs(adminUser())->get(route('products.index', ['search' => 'PHONE-1']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Products/Index')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Smartphone'));
});

test('user without permission cannot manage products', function () {
    $category = ProductCategory::create(['name' => 'Elektronik', 'slug' => 'elektronik', 'is_active' => true]);
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('products.store'), [
        'product_category_id' => $category->id,
        'sku' => 'SKU-002',
        'name' => 'Produk Terlarang',
        'price' => 100,
        'stock' => 1,
        'is_active' => true,
    ])->assertForbidden();
});

test('category in use cannot be deleted', function () {
    $category = ProductCategory::create(['name' => 'Elektronik', 'slug' => 'elektronik', 'is_active' => true]);
    Product::create(['product_category_id' => $category->id, 'sku' => 'SKU-003', 'name' => 'Produk', 'slug' => 'produk', 'price' => 100, 'stock' => 1, 'is_active' => true]);

    $this->actingAs(adminUser())->delete(route('product-categories.destroy', $category))
        ->assertSessionHas('error');

    $this->assertDatabaseHas('product_categories', ['id' => $category->id]);
});
