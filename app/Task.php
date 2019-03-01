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

    public function isCompleted() {
        // If there is any incomplete item, we are incomplete
        foreach($this->items as $item) {
            if (!$item->completed) {
                return false;
            }
        }
        return true;
    }
}
