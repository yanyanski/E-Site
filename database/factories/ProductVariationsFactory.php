<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariations>
 */
class ProductVariationsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $variations = ["1K", "2K", "3K", "4K", "5K", "6K", "8k", "3 Sets", "2 Sets"];
        return [
            "variation_title" => $variations[array_rand($variations)]
        ];
    }
}
