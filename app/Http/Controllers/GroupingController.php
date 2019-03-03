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
            'name' => 'required',
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

    public function delete($id) {
        $gp = Grouping::find($id);

        if (!$gp) {
            return redirect()->back()->withErrors('That group does not exist!');
        }

        if (Auth::user() != $gp->user) {
            return redirect()->back()->withErrors("You don't own that group!");
        }

        foreach($gp->tasks as $task) {
            $task->items()->delete();
        }
        $gp->tasks()->delete();
        $gp->delete();

        return redirect()->back();
    }
}
