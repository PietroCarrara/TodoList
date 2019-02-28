<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'name', 'grouping_id'
    ];

    public function items() {
        return $this->hasMany('App\Item');
    }

    public function grouping() {
        return $this->belongsTo('App\Grouping');
    }
}
