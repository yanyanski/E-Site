<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class ProductVariations extends Model
{   
    use HasFactory;

    protected $fillable = [
        'variation_title',
    ];

    public function products(){

        return $this->belongsToMany(
            Products::class,
            "product_and_variation",
            "variation_id",
            "product_id"
        );
    }
}
