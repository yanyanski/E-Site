<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAndCategories extends Model
{
    protected $table = 'product_and_categories';
    protected $fillable = [
        "product_id",
        "category_id",
    ];
}
