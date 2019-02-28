<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'desc', 'task_id'
    ];

    public function task() {
        return $this->belongsTo('App\Task');
    }
}
