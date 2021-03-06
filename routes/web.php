<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'HomeController@activeTasks')->name('home');
Route::get('/completed', 'HomeController@completedTasks')->name('completed');

Route::get('/login', 'AuthController@login')->name('login');
Route::post('/login', 'AuthController@loginPost')->name('login.post');
Route::get('/register', 'AuthController@register')->name('register');
Route::post('/register', 'AuthController@registerPost')->name('register.post');
Route::get('/logout', 'AuthController@logout')->name('logout');

Route::post('/groupings/create', 'GroupingController@create')->name('grouping.create');
Route::get('/groupings/{id}/delete', 'GroupingController@delete')->name('grouping.delete');

Route::post('/tasks/create', 'TaskController@create')->name('task.create');
Route::post('/tasks/{id}/delete', 'TaskController@delete')->name('task.delete');
Route::post('/tasks/{id}/edit', 'TaskController@edit')->name('task.edit');
Route::post('/tasks/{id}/moveup', 'TaskController@moveUp')->name('task.moveup');
Route::post('/tasks/{id}/movedown', 'TaskController@moveDown')->name('task.movedown');

Route::post('/items/{id}/complete', 'ItemController@complete')->name('item.complete');
Route::post('/items/{id}/uncomplete', 'ItemController@uncomplete')->name('item.uncomplete');