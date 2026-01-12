<?php

namespace Database\Seeders;

use App\Models\ProductCategories;
use App\Models\ProductType;
use App\Models\ProductVariations;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed users
        User::factory() -> create([
             'user' => 'admin',
            "status" => "admin",
            'password' => bcrypt("123456") 
        ]);

        // Seed variations
        $variations = ["1K", "2K", "3K", "4K", "5K", "6K", "8K", "3 Sets", "2 Sets"];

        foreach ($variations as $v) {
            ProductVariations::create([
                'variation_title' => $v,
            ]);
        }

        // Seed categories
        $categories = ["Image", "Wall Frame", "Wallpaper"];
        foreach ($categories as $c) {
            ProductCategories::create([
                "category_name" => $c
            ]);
        }

        $types = ["E-Book", "Image"];
        foreach($types as $t){
            ProductType::create([
                "product_type" => $t
            ]);
        }
    }
}
