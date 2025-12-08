<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAndVariation extends Model
{
    protected $table = 'product_and_variation';
    protected $fillable = [
        "product_id",
        "variation_id",
    ];
}
