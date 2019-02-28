<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Item;

class ItemController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }

    public function complete(Request $req, $id) {
        $this->setCompleted($req, $id, true);
    }

    public function uncomplete(Request $req, $id) {
        $this->setCompleted($req, $id, false);
    }

    private function setCompleted(Request $req, $id, $status) {
        $item = Item::find($id);
        
        if (!$item) {
            return redirect()->back()->withErrors('This item does not exist!'); 
        }

        if ($item->task->grouping->user != Auth::user()) {
            return redirect()->back()->withErrors('You don\'t own this item!'); 
        }

        $item->completed = $status;
        $item->save();
    }
}
