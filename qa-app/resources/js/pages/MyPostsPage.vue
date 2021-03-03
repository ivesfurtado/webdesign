<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card text-center">
                    <div class="card-header">
                        <ul class="nav nav-tabs card-header-tabs">
                            <li class="nav-item">
                                <router-link exact :to="{ name: 'my-posts' }" class="nav-link" aria-current="true">All</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link exact :to="{ name: 'my-posts', query: { type: 'questions'} }" class="nav-link" aria-current="true">Questions</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link exact :to="{ name: 'my-posts', query: { type: 'answers'} }" class="nav-link" aria-current="true">Answers</router-link>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <spinner v-if="$root.loading"></spinner>
                        <ul v-else-if="posts.length" class="list-group list-group-flush">
                            <li v-for="(post, index) in posts" class="list-group-item" :key="index">
                                <div class="row">
                                    <div class="col">
                                        <span class="post-badge" :class="{ accepted: post.accepted }">{{ post.type }}</span>
                                        <span class="ml-4 votes-count" :class="{ accepted: post.accepted }">{{ post.votes_count }}</span>
                                    </div>
                                    <div class="col-md-9 text-left">
                                        <router-link :to="{ name: 'questions.show', params: {slug: post.slug} }">{{ post.title }}</router-link>
                                    </div>
                                    <div class="col text-right">{{ post.created_at }}</div>
                                </div>
                            </li>
                        </ul>
                        <div v-else class="alert alert-warning">
                            <p>You have no questions or answers.</p>
                            <p>
                                <router-link :to="{ name: 'questions.create' }">Ask Question</router-link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    $color-green: rgba(95, 187, 126);

    .votes-count {
        border: 1px solid #ddd;
        display: inline-block;
        min-width: 40px;
        text-align: center;

        &.accepted {
            background: $color-green;
            border: 1px solid $color-green;
            color: #fff;
        }
    }

    .post-badge {
        border: 1px solid #ddd;
        display: inline-block;
        width: 25px;
        text-align: center;
        border-radius: 100%;

        &.accepted {
            border: 1px solid $color-green;
            color: $color-green;
        }
    }
</style>

<script>
export default {
    data() {
        return {
            posts: []
        }
    },

    mounted() {
        this.fetchPosts();
    },

    methods: {
        fetchPosts() {
            axios.get('/my-posts', { params: this.$route.query })
                .then(({ data }) => {
                    console.log(data);
                    this.posts = data.data;
                })
                .catch(errors => console.log(errors));
        }
    },

    watch: {
        '$route': 'fetchPosts'
    }
}
</script>