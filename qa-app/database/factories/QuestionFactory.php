<?php

namespace Database\Factories;

use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Faker\Factory as Faker;


class QuestionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Question::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = Faker::create();
        return [
            'title' => rtrim($this->faker->sentence(rand(5, 10)), '.'),
            'body' =>  $faker->paragraph(rand(10, 20), true),
            'views' => rand(0, 10),
            'answers_count' => rand(0, 10),
            'votes' => rand(-3, 10)
        ];
    }
}
