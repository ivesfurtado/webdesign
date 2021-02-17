@csrf
<div class="form-group">
    <label for="question-title">Question Title</label>
    <input type="text" name="title" value="{{ old('title', $question->title) }}" id="question-title" class="form-control {{ $errors->has('title') ? 'is-invalid' : '' }}">

    @if ($errors->has('title'))
        <div class="invalid-feedback">
            <strong>{{ $errors->first('title') }}</strong>
        </div>
    @endif
</div>
<div class="form-group">
    <label for="question-body">Describe your question</label>
    <textarea name="body" id="question-body" class="form-control {{ $errors->has('body') ? 'is-invalid' : '' }}" rows="10">{{ old('body', $question->body) }}</textarea>

    @if ($errors->has('body'))
        <div class="invalid-feedback">
            <strong>{{ $errors->first('body') }}</strong>
        </div>
    @endif
</div>
<div class="form-group d-grid gap-2 dd-md-flex justify-content-md-end">
    <button type="submit" class="btn btn-primary btn-lg">{{ $buttonText }}</button>
</div>