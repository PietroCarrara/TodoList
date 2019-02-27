<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Grouping;

class GroupingController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }

    public function createPost(Request $req) {

        $req->validate([
            'name' => 'required|unique:groupings',
        ]);

        $group = Grouping::create([
            'name' => $req->name,
            'user_id' => Auth::id(),
        ]);

        if ($req->ajax()) {
            return view('components.grouping', [
                'grouping' => $group,
            ]);
        }

        return redirect(route('home'));
    }
}
