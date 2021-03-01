<template>
    <form @submit.prevent="handleSubmit">
        <div class="form-group">
            <label for="question-title">Question Title</label>
            <input type="text" name="title" v-model="title" :class="errorClass('title')">

            <div v-if="errors['title'][0]" class="invalid-feedback">
                <strong>{{ errors['title'][0] }}</strong>
            </div>
        </div>
        <div class="form-group">
            <label for="question-body">Describe your question</label>
            <textarea name="body" :class="errorClass('body')" rows="10" v-model="body"></textarea>

            <div v-if="errors['body'][0]" class="invalid-feedback">
                <strong>{{ errors['body'][0] }}</strong>
            </div>
        </div>
        <div class="form-group d-grid gap-2 dd-md-flex justify-content-md-end">
            <button type="submit" class="btn btn-primary btn-lg">
                <spinner :small="true" v-if="$root.loading"></spinner>
                <p v-else>{{ buttonText }}</p>
            </button>
        </div>
    </form>
</template>

<script>
import EventBus from '../event-bus';

export default {
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            title: '',
            body: '',
            errors: {
                title: [],
                body: []
            }
        }
    },

    mounted() {
        EventBus.$on('error', errors => this.errors = errors);

        if (this.isEdit) {
            this.fetchQuestion();
        }
    },

    methods: {
        fetchQuestion() {
            axios.get(`/questions/${this.$route.params.id}`)
            .then(({ data }) => {
                this.title = data.title
                this.body = data.body
                })
            .catch(error => {
                console.log(error.response);
                })
        },

        handleSubmit() {
            this.$emit('submitted', {
                title: this.title,
                body: this.body
            })
        },

        errorClass(column) {
            return [
                'form-control',
                this.errors[column] && this.errors[column][0] ? 'is-invalid' : ''
            ]
        }
    },

    computed: {
        buttonText() {
            return this.isEdit ? 'Update Question' : 'Ask Question';
        },
    }
}
</script>