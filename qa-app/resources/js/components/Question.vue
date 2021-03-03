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
                            <h1 class="text-break">{{ title }}</h1>
                            <div class="ml-auto">
                                <router-link exact :to="{ name: 'questions' }" class="btn btn-outline-secondary">Back to all Questions</router-link>
                            </div>
                        </div>
                    </div>

                    <hr>

                    <div class="media">
                        <vote :model="question" name="question"></vote>
                        
                        <div class="media-body">
                            <div class="text-break" v-html="bodyHtml"></div>
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
import modification from '../mixins/modification';
import EventBus from '../event-bus'

export default {
    props: ['question'],

    mixins: [modification],

    components: {
        Vote,
        UserInfo
    },

    mounted () {
        EventBus.$on('answers-count-changed', (count) => {
            this.question.answers_count = count;
        })
    },

    data() {
        return {
            title: this.question.title,
            body: this.question.body,
            bodyHtml: this.question.body_html,
            id: this.question.id,
            beforeEditCache: null
        }
    },

    computed: {
        isInvalid() {
            return this.body.length < 10 || this.title.length < 10;
        },

        endpoint () {
            return `/questions/${this.id}`;
        },

        uniqueName () {
            return `question-${this.id}`; 
        }
    },

    methods: {
        delete() {
            axios.delete(this.endpoint)
                    .then(({data}) => {
                        this.$toast.success(data.message, "Success", {
                            timeout: 2000
                        });
                    });
            setTimeout(() => {
                this.$router.push({ name: 'questions' });
            }, 1500);
        },

        setEditCache() {
            this.beforeEditCache = {
                body: this.body,
                title: this.title
            };
        },

        restoreFromCache() {
            this.body = this.beforeEditCache.body;
            this.title = this.beforeEditCache.title;
        },

        payload() {
            return {
                body: this.body,
                title: this.title
            }
        }
    },
}
</script>