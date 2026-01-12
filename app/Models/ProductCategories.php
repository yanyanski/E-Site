<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class ProductCategories extends Model
{
        use HasFactory;

    protected $fillable = [
        'category_name',
    ];

    public function products(){
        return $this->belongsToMany(Products::class,
           "product_and_categories",
            "category_id",
            "product_id");
    }
}
