<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            'audio' => ['Headphone Studio', 'Earbuds TWS', 'Speaker Portable', 'Soundbar Mini', 'Headset Conference'],
            'elektronik' => ['Power Bank', 'Kamera Instan', 'Smart Lamp', 'Adaptor Universal', 'Mini Projector'],
            'fashion' => ['Kemeja Linen', 'Tas Selempang', 'Sneakers Urban', 'Jaket Ringan', 'Jam Tangan'],
            'gaming' => ['Keyboard Mechanical', 'Mouse Gaming', 'Controller Wireless', 'Gaming Headset', 'Mousepad XL'],
            'kecantikan' => ['Serum Wajah', 'Sunscreen Daily', 'Facial Cleanser', 'Lip Tint', 'Body Lotion'],
            'kesehatan' => ['Smart Scale', 'Air Purifier Mini', 'Tumbler Termal', 'Massage Gun Mini', 'Humidifier'],
            'olahraga' => ['Yoga Mat', 'Resistance Band', 'Botol Olahraga', 'Dumbbell Set', 'Running Belt'],
            'perlengkapan-rumah' => ['Lampu Meja', 'Diffuser Aroma', 'Rak Modular', 'Vacuum Portable', 'Set Organizer'],
            'smartphone' => ['Smartphone Neo', 'Charger GaN', 'Case MagSafe', 'Phone Stand', 'Kabel Fast Charge'],
            'workspace' => ['Laptop Stand', 'Desk Mat', 'Webcam Full HD', 'USB-C Hub', 'Kursi Ergonomis'],
        ];

        $descriptors = ['Essential', 'Air', 'Plus', 'Pro', 'Studio', 'Flex'];
        $categories = ProductCategory::query()->whereIn('slug', array_keys($catalog))->get()->keyBy('slug');

        foreach ($catalog as $categorySlug => $names) {
            $category = $categories->get($categorySlug);

            if (! $category) {
                continue;
            }

            for ($index = 1; $index <= 15; $index++) {
                $baseName = $names[($index - 1) % count($names)];
                $descriptor = $descriptors[(int) floor(($index - 1) / count($names)) + (($index - 1) % count($names)) % 2];
                $name = "{$baseName} {$descriptor} {$index}";
                $sku = strtoupper(substr(str_replace('-', '', $categorySlug), 0, 4)).'-'.str_pad((string) $index, 3, '0', STR_PAD_LEFT);

                Product::updateOrCreate(
                    ['sku' => $sku],
                    [
                        'product_category_id' => $category->id,
                        'name' => $name,
                        'slug' => Str::slug("{$categorySlug}-{$name}"),
                        'description' => "{$name} dirancang dengan material pilihan, detail yang rapi, dan fungsi praktis untuk menemani aktivitas harian Anda.",
                        'price' => $this->priceFor($categorySlug, $index),
                        'stock' => (($index * 17) + strlen($categorySlug)) % 61,
                        'is_active' => true,
                    ],
                );
            }
        }
    }

    private function priceFor(string $categorySlug, int $index): int
    {
        $basePrices = [
            'audio' => 249000,
            'elektronik' => 179000,
            'fashion' => 159000,
            'gaming' => 299000,
            'kecantikan' => 89000,
            'kesehatan' => 139000,
            'olahraga' => 119000,
            'perlengkapan-rumah' => 99000,
            'smartphone' => 349000,
            'workspace' => 219000,
        ];

        return $basePrices[$categorySlug] + (($index - 1) * 37000);
    }
}
