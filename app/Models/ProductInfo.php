<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductInfo extends Model
{
    protected $table = 'product_info';
    protected $fillable = [
        "product_description",
        "product_price",
        "is_active",
        "product_id",
        "product_link",
        "product_type_id"
    ];

    public function type()
    {
        return $this->belongsTo(ProductType::class, 'product_type_id');
    }

}
