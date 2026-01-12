<?php

namespace App\Http\Controllers\AdminControllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminUsers extends Controller
{   

    public function getUsers(Request $request) {
        $columns = [
            "id as user_id",
            "user as user_username",
            "status as user_status",
        ];

        return response() -> json(User::all($columns));
    }

    public function addUser(Request $request) {
        try {
            Log::info($request->all());
            $id = $request->get("id");
            $username = $request->get("username");
            $status = $request->get("status");
            $password = $request->get("password");

            // Update Mode
            if($id) {
                $user = User::find($id);
                if($user) {
                    if($password && $password !== "") {
                        $user->update([
                            "user" => $username,
                            "status" => $status,
                            "password" => Hash::make($password)
                        ]);
                    } else {
                        $user->update([
                            "user" => $username,
                            "status" => $status,
                        ]);
                    }

                    return response()->json([
                        "status" => true,
                        "message" => "Variant {$username} was updated successfully.",
                        "data" => [
                            "type_id" => $user->id,
                            "type_name" => $user->product_type,
                            "type_ca" => $user->created_at
                        ]
                    ]);
                } else {
                    return response() -> json([
                        "status" => false,
                        "message" => "User with user id of ". $id . " does not exist in the database.",
                        "data" => null
                    ]);
                }
            }

            // Insert Mode

            $user = User::create([
                "user" => $username,
                "status" => $status,
                "password" => Hash::make($password)
            ]);
            return response() -> json([
                "status" => true,
                "data" => [
                    "user_id" => $user->id,
                    "user_username" => $user->user,
                    "user_status" => $user->status
                ]
            ]);

        } catch(QueryException $e) {
            Log::info($e);
            return response() -> json([
                "status" => false,
                "message" => 'Something went wrong.' . $e
            ]);
        }

    }

    /**
     * Get a paginated data of the users
     */
    public function getPaginatedUsers(Request $request) {
        $per_page = $request->get("paginate", 10);
        $page = $request->get("page", 1);


        $columns = ["id as us_id", "user as us_name", "created_at as us_ca", "status as us_stat"];

        if($request->get("pagination_type") == "normal"){
            $users = User::orderBy("id", "asc") ->paginate($per_page, $columns, "page", $page);
        } else {
            $users = User::orderBy("id", "asc") -> simplePaginate($per_page, $columns, "page", $page);
        }
        return response() -> json($users);
    }

    /**
     * Set the status value of the user
     */
    public function setUserStatus(Request $request) {

        $status = $request->get("status");
        $id = $request->get("id");

        if($id && $status) {
            $user = User::find($id);

            if($user) {
                $user->status = $status;
                $user->save();

                return response()->json(
                    [
                        'status' => true, 
                        'message' => 'User status updated successfully',
                        'updated_column' => [
                            "status" => $status
                        ],
                    ]
                );
            } else {
                return response() -> json(
                    [
                        'status' => false,
                        'message' => "User not found"
                    ]
                );
            }
        }
        return response()->json(['message' => 'Invalid request data'], 400);
    }
}
