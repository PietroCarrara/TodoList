<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Hash;
use App\User;

class AuthController extends Controller
{
    public function __construct() {
        $this->middleware('guest')->except('logout');
    }

    public function login() {
        return view('login');
    }

    public function register() {
        return view('register');
    }

    public function logout() {
        Auth::logout();

        return redirect(route('login'));
    }

    public function loginPost(Request $req) {

        $req->validate([
            'email' => 'email|exists:users|required',
            'password' => 'required',
        ]);
    
        if (Auth::attempt($req->only(['email', 'password']))) {
            return redirect(route('home'));
        }

        return redirect()->back()->withErrors('Login failed!');
    }

    public function registerPost(Request $req) {

        $req->validate([
            'email' => 'email|unique:users,email|required',
            'password' => 'min:6|max:16|required|alpha_num',
        ]);

        $usr = User::create([
            'email' => $req->input('email'),
            'password' => Hash::make($req->input('password')),
        ]);

        Auth::login($usr);

        return redirect(route('home'));
    }
}
