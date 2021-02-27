<template>
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <form v-if="editing" @submit.prevent="update" class="card-body">
                    <div class="card-title">
                        <input type="text" class="form-control form-control-lg" v-model="title">
                    </div>
                    <hr>

                    <div class="media">
                        <div class="media-body">
                            <div class="form-group">
                                <textarea v-model="body" rows="10" class="form-control" required></textarea>
                            </div>
                            <button class="btn btn-outline-primary" :disabled="isInvalid">Update</button>
                            <button class="btn btn-outline-secondary" @click="cancel" type="button">Cancel</button>
                        </div>
                    </div>
                </form>

                <div v-else class="card-body">
                    <div class="card-title">
                        <div class="d-flex align-items-center">
                            <h1>{{ title }}</h1>
                            <div class="ml-auto">
                                <a href="/questions" class="btn btn-outline-secondary">Back to All Questions</a>
                            </div>
                        </div>
                    </div>

                    <hr>

                    <div class="media">
                        <vote :model="question" name="question"></vote>
                        
                        <div class="media-body">
                            <div v-html="bodyHtml"></div>
                            <div class="row">
                                <div class="col-4">
                                    <div class="ml-auto">
                                        <a v-if="authorize('modify', question)" @click.prevent="edit" class="btn btn-sm btn-outline-info">Edit</a>
                                        <button v-if="authorize('deleteQuestion', question)" @click="destroy" class="btn btn-sm btn-outline-danger">Delete</button>
                                    </div>
                                </div>
                                <div class="col-4"></div>
                                <div class="col-4">                                    
                                    <user-info :model="question" label="Asked"></user-info>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vote from './Vote.vue';
import UserInfo from './UserInfo.vue';

export default {
    props: ['question'],

    components: {
        Vote,
        UserInfo
    },

    data() {
        return {
            title: this.question.title,
            body: this.question.body,
            bodyHtml: this.question.body_html,
            editing: false,
            id: this.question.id,
            beforeEditCache: null
        }
    },

    computed: {
        isInvalid() {
            return this.body.length < 10 || this.title.length < 10;
        },

        endpoint() {
            return `${this.id}`;
        }
    },

    methods: {
        destroy() {
            this.$toast.question("Are you sure about that?", 'Confirm', {
            timeout: 20000,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 999,
            position: 'center',
            buttons: [
                ['<button><b>YES</b></button>', (instance, toast) => {
                    axios.delete(this.endpoint)
                    .then(({data}) => {
                        this.$toast.success(data.message, "Success", {
                            timeout: 2000
                        });
                    });

                    setTimeout(() => {
                        window.location.href = "/questions";
                    }, 3000);

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        
                }, true],
                ['<button>NO</button>', function (instance, toast) {
        
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
        
                }],
            ]
        });
        },

        edit() {
            this.beforeEditCache = {
                body: this.body,
                title: this.title
            };
            this.editing = true;
        },

        cancel() {
            this.body = this.beforeEditCache.body;
            this.title = this.beforeEditCache.title;
            this.editing = false;
        },

        update() {
            axios.put(this.endpoint, {
                body: this.body,
                title: this.title
            })
            .then(response => {
                this.editing = false;
                this.bodyHtml = response.data.body_html;
                this.$toast.success(response.data.message, "Success", { timeout: 3000 });
            })
            .catch(error => {
                this.$toast.error(error.response.data.message, "Error", { timeout: 3000 });
            });
        }
    }
}
</script>