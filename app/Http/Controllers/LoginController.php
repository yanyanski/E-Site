<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
        public function getLoginContentUi(Request $request){

        ///Handle if it's ajax or normal HTTP Request
        if($request ->ajax()){
            return view("contents.login") -> render();
        } else {
            return view("index", ["content" => "login"]);
        }
    }

    public function checkLoginCredent(Request $request) {
        $return_val = [
            'status' => false,
            'message'=> ""
        ];
        $username = $request->get("username");
        $password = $request->get("password");

        $user = User::where("user", $username)->first();

        if($user){
            if (!Hash::check($password, $user->password)) {
                $return_val["message"] = "Wrong password. Please try again";
            } else{
                Auth::login($user);
                $return_val["status"] = true;

            }
        } else {
            $return_val["message"] = "Can't find user";
        }

        return $return_val;
    }

    public function logout() {
        Auth::logout();
        return [
            "status" => true,
            "message" => "Successfully logged out"
        ];
    }
}
