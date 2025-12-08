<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductType extends Model
{
    protected $fillable = [
        'product_type',
    ];

    public function infos()
    {
        return $this->hasMany(ProductInfo::class, 'product_type_id');
    }
}
