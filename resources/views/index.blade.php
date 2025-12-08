
@extends((isset($is_admin) && $is_admin) ? 'layouts.app_admin' : 'layouts.app_content', ['is_admin' => isset($is_admin) ? true : false])
