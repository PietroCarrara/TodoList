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
}
