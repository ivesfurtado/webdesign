<template>
    <div class="row mt-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div class="card-title">
                        <h3>Your Answer</h3>
                    </div>
                    <hr>
                    <form @submit.prevent="create">
                        <div class="form-group">
                            <textarea v-model="body" class="form-control" rows="7" name="body" required></textarea>
                        </div>
                        <div class="form-group">
                            <button type="submit" :disabled="isInvalid" class="btn btn-lg btn-outline-primary">
                                <spinner :small="true" :min-width="59.22" v-if="$root.loading"></spinner>
                                <span v-else>Submit</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div> 
</template>

<script>
export default {
    props: ['question_id'],

    data() {
        return {
            body: ''
        };
    },

    computed: {
        isInvalid() {
            return !this.signedIn || this.body.length < 10;
        },
    },

    methods: {
        create() {
            axios.post(`/questions/${this.question_id}/answers`, {
                body: this.body
            })
            .catch(error => {
                this.$toast.error(error.response.data.message, "Error");
            })
            .then(({ data }) => {
                this.$toast.success(data.message, "Success");
                this.body = '';
                this.$emit('answerCreated', data.answer);
            });
        }
    }
}
</script>