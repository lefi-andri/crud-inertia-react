<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Audio', 'slug' => 'audio', 'description' => 'Headphone, speaker, dan perangkat audio pilihan.'],
            ['name' => 'Elektronik', 'slug' => 'elektronik', 'description' => 'Perangkat elektronik praktis untuk keseharian.'],
            ['name' => 'Fashion', 'slug' => 'fashion', 'description' => 'Koleksi pakaian dan aksesori bergaya modern.'],
            ['name' => 'Gaming', 'slug' => 'gaming', 'description' => 'Perlengkapan gaming untuk pengalaman bermain terbaik.'],
            ['name' => 'Kecantikan', 'slug' => 'kecantikan', 'description' => 'Perawatan diri dan kecantikan untuk rutinitas harian.'],
            ['name' => 'Kesehatan', 'slug' => 'kesehatan', 'description' => 'Produk pendukung gaya hidup sehat dan aktif.'],
            ['name' => 'Olahraga', 'slug' => 'olahraga', 'description' => 'Peralatan olahraga untuk bergerak lebih jauh.'],
            ['name' => 'Perlengkapan Rumah', 'slug' => 'perlengkapan-rumah', 'description' => 'Pilihan fungsional untuk rumah yang lebih nyaman.'],
            ['name' => 'Smartphone', 'slug' => 'smartphone', 'description' => 'Smartphone dan aksesori untuk selalu terhubung.'],
            ['name' => 'Workspace', 'slug' => 'workspace', 'description' => 'Perlengkapan kerja produktif untuk rumah dan kantor.'],
        ];

        foreach ($categories as $category) {
            ProductCategory::updateOrCreate(
                ['slug' => $category['slug']],
                [...$category, 'is_active' => true],
            );
        }
    }
}
