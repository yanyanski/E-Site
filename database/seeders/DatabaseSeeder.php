<?php

namespace Database\Seeders;

use App\Models\ProductCategories;
use App\Models\ProductVariations;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        $variations = ["1K", "2K", "3K", "4K", "5K", "6K", "8K", "3 Sets", "2 Sets"];

        foreach ($variations as $v) {
            ProductVariations::factory()->create([
                'variation_title' => $v,
            ]);
        }

        $categories = ["Image", "Wall Frame", "Wallpaper"];
        foreach ($categories as $c) {
            ProductCategories::factory() -> create([
                "category_name" => $c
            ]);
        }
    }
}
