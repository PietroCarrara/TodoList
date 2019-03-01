<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Grouping extends Model
{
    public $fillable = [
        'name', 'user_id'
    ];

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function tasks() {
        return $this->hasMany('App\Task')->orderBy('index');
    }

    public function completeTasks() {
        return $this->tasks->filter(function($task) {
            return $task->isCompleted();
        })->values();
    }

    public function incompleteTasks() {
        return $this->tasks->filter(function($task) {
            return !$task->isCompleted();
        })->values();
    }
}
