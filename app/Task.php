<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'name', 'index', 'icon', 'grouping_id'
    ];

    protected $appends = [
        'items',
    ];

    public function items() {
        return $this->hasMany('App\Item');
    }

    public function grouping() {
        return $this->belongsTo('App\Grouping');
    }

    public function getItemsAttribute() {
        return $this->items()->get();
    }
}
