<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Task;
use App\Item;

class TaskController extends Controller
{
    public function createPost(Request $req) {

        $req->validate([
            'name' => 'required',
            'grouping_id' => 'required|exists:groupings,id',
            'items' => 'required|array|min:1',
            'items.*' => 'min:1',
        ]);
        
        $task = Task::create($req->all());

        foreach ($req->items as $item) {
            Item::create([
                'task_id' => $task->id,
                'desc' => $item,
            ]);
        }

        if ($req->ajax()) {
            return response()->json($task);
        }

        return redirect(route('home'));
    }
}
