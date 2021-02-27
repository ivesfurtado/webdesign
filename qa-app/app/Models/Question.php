<?php

namespace App\Models;

use App\VotableTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class Question extends Model
{
    protected $fillable = ['title', 'body'];

    protected $appends = ['created_date', 'is_favorited', 'favorites_count', 'body_html'];

    use HasFactory;
    use VotableTrait;

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function setTitleAttribute($value) {
        $this->attributes['title'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    public function getUrlAttribute() {
        return route("questions.show", $this->slug);
    }

    public function getCreatedDateAttribute() {
        return $this->created_at->diffForHumans();
    }

    public function getStatusAttribute() {
        if ($this->answers_count > 0) {
            if ($this->best_answer_id) {
                return "answer-accepted";
            }
            return "answered";
        } else {
            return "unanswered";
        }
    }

    public function getBodyHtmlAttribute() {
        return clean($this->bodyHtml());
    }

    public function answers() {
        return $this->hasMany(Answer::class)->orderBy('votes_count', 'DESC');
    }

    public function acceptBestAnswer(Answer $answer) {
        $this->best_answer_id = $answer->id;
        $this->save();
    }

    public function favorites() {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    public function isFavorited() {
        return $this->favorites()->where('user_id', auth()->id())->count() > 0;
    }

    public function getIsFavoritedAttribute() {
        return $this->isFavorited();
    }

    public function getFavoritesCountAttribute() {
        return $this->favorites->count();
    }

    public function getExcerptAttribute() {
        return $this->excerpt(250);
    }

    public function excerpt($length) {
        return Str::limit(strip_tags($this->bodyHtml()), $length);
    }

    private function bodyHtml() {
        $Parsedown = new \Parsedown();
        return $Parsedown->text($this->body);
    }
}
