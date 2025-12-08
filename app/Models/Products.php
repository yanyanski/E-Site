<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $fillable = [
        'product_name',
    ];

    // Get the info relationship data from the product_info database
    public function info(){
        return $this->hasOne(ProductInfo::class, "product_id");
    }

    // Get images from the product_images table
    public function images(){
        return $this->hasMany(ProductImage::class, "product_id");
    }

    public function variations(){
        return $this->belongsToMany(ProductVariations::class,
            "product_and_variation",
            "product_id",
            'variation_id'
        );
    }

    public function type()
    {
        return $this->hasOneThrough(
            ProductType::class,
            ProductInfo::class,
            'product_id',
            'id',
            'id',
            'product_type_id',
        );
    }

    public function categories(){
        return $this->belongsToMany(ProductCategories::class,
        "product_and_categories",
        "product_id",
        "category_id");
    }
}
