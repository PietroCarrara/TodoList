<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticable;

class User extends Authenticable
{
    protected $fillable = [
        'email', 'password',
    ];

    public function groupings() {
        return $this->hasMany('App\Grouping');
    }
}
