<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CreateUserController extends Controller
{
    public function getCreateUserUi(Request $request){
        if($request->ajax()){
            return view("index", ["content" => "create_user", "is_admin" => true]) -> render();
        } else{
            return view("index", ["content" => "create_user", "is_admin" => true]);
        }
    }
}
