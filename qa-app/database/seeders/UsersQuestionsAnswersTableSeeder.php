<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Question;
use App\Models\Answer;

class UsersQuestionsAnswersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('answers')->delete();
        \DB::table('questions')->delete();
        \DB::table('users')->delete();

        User::Factory(3)->create()->each(function($u) {
            $u->questions()->saveMany(
                Question::factory(rand(1, 5))->make()
            )->each(function($q) {
                $q->answers()->saveMany(
                    Answer::factory(rand(1, 5))->make());
            });
        });
    }
}
