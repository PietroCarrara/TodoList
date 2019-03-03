<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Task;
use App\Item;
use App\Grouping;

class TaskController extends Controller
{
    public function createPost(Request $req) {

        $req->validate([
            'name' => 'required',
            'icon' => 'required',
            'grouping_id' => 'required|exists:groupings,id',
            'items' => 'required|array|min:1',
            'items.*' => 'min:1',
        ]);
        
        $group = Grouping::find($req->grouping_id);

        if (Auth::user() != $group->user) {
            return redirect()->back()->withErrors('You don\'t own this group!');
        }
        
        $index = $group->tasks()->max('index') + 1;

        $task = Task::create([
            'icon' => $req->icon,
            'name' => $req->name,
            'grouping_id' => $req->grouping_id,
            'index' => $index,
        ]);

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

    public function edit(Request $req, $id) {

        $req->validate([
            'name' => 'required',
            'icon' => 'required',
            'grouping_id' => 'required|exists:groupings,id',
            'items' => 'required|array|min:1',
            'items.*' => 'min:1',
        ]);

        $task = Task::find($id);
        
        if (!$task) {
            return redirect()->back()->withErrors('This item does not exist!'); 
        }

        if ($task->grouping->user != Auth::user()) {
            return redirect()->back()->withErrors('You don\'t own this task!');
        }

        if ($task->isCompleted()) {
            return redirect()->back()->withErrors('If you want to edit this task, reactivate it first!');
        }

        $task->name = $req->name;
        $task->icon = $req->icon;

        $task->items()->delete();
        foreach($req->items as $key => $item) {
            Item::create([
                'desc' => $item,
                'task_id' => $task->id,
            ]);
        }

        if ($task->grouping_id != $req->grouping_id) {
            $task->grouping_id = $req->grouping_id;
            $group = Grouping::find($req->grouping_id);
            $task->index = $group->incompleteTasks()->max('index') + 1;
        }

        $task->save();

        return redirect(route('home'));
    }

    /**
     * Decreases the index of a given task, so it appears more to the top
     */
    public function moveUp(Request $req, $id) {

        $task = Task::find($id);
        
        if (!$task) {
            return redirect()->back()->withErrors('This item does not exist!'); 
        }

        if ($task->grouping->user != Auth::user()) {
            return redirect()->back()->withErrors('You don\'t own this task!');
        }

        // Get who is right above us
        if ($task->isCompleted()) {
            $toSwitch = $task->grouping->completeTasks();
        } else {
            $toSwitch = $task->grouping->incompleteTasks();
        }
        $toSwitch = $toSwitch->where('index', '<', $task->index)->last();

        // If we have not found someone to switch positions,
        // we are already the first one
        if (!$toSwitch) {
            return redirect()->back()->withErrors('Invalid operation!');
        }

        // Switch places
        $tmp = $task->index;
        $task->index = $toSwitch->index;
        $toSwitch->index = $tmp;

        $toSwitch->save();
        $task->save();

        return redirect()->back();
    }

    /**
     * Increases the index of a given item, so it appears more to the bottom
     */
    public function moveDown(Request $req, $id) {

        $task = Task::find($id);
        
        if (!$task) {
            return redirect()->back()->withErrors('This item does not exist!'); 
        }

        if ($task->grouping->user != Auth::user()) {
            return redirect()->back()->withErrors('You don\'t own this task!'); 
        }

        // Get who is right below us
        if ($task->isCompleted()) {
            $toSwitch = $task->grouping->completeTasks();
        } else {
            $toSwitch = $task->grouping->incompleteTasks();
        }
        $toSwitch = $toSwitch->where('index', '>', $task->index)->first();

        // If we have not found someone to switch positions,
        // we are already the last one
        if (!$toSwitch) {
            return redirect()->back()->withErrors('Invalid operation!');
        }

        // Switch places
        $tmp = $task->index;
        $task->index = $toSwitch->index;
        $toSwitch->index = $tmp;

        $toSwitch->save();
        $task->save();

        return redirect()->back();
    }

    public function delete(Request $req, $id) {

        $task = Task::find($id);

        if (!$task) {
            return redirect()->back()->withErrors('This item does not exist!'); 
        }

        if ($task->grouping->user != Auth::user()) {
            return redirect()->back()->withErrors('You don\'t own this item!'); 
        }

        $task->items()->delete();
        $task->delete();
    }
}
