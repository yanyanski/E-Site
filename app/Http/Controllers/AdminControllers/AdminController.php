<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getAdminIndex(Request $request){
        if ($request -> ajax()){
            return view("admin.admin-index") -> render();
        } 
        return view("index", [
            "is_admin" => true,
            "content" => "admin_products"
        ]);
    }
}
