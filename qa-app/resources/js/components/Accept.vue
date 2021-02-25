<template>
    <div>
        <a v-if="canAccept" title="Mark this answer as best answer" 
            :class="classes"
            @click.prevent="create">
            <i class="fas fa-check fa-2x"></i>
        </a>
        <a v-if="accepted" title="This is the best answer" 
            :class="classes">
            <i class="fas fa-check fa-2x"></i>
        </a>
    </div>
</template>

<script>
import eventBus from '../event-bus.js';

export default {
    props: ['answer'],

    data() {
        return {
            isBest: this.answer.is_best,
            id: this.answer.id
        }
    },

    computed: {
        canAccept() {
            return this.authorize('accept', this.answer);
        },

        accepted() {
            return !this.canAccept && this.isBest;
        },

        classes() {
            return [
                'mt-2',
                this.isBest ? 'vote-accepted' : ''
                ];
        },

        endpoint() {
            return `/answers/${this.id}/accept`;
        }
    },

    created() {
        eventBus.$on('accepted', id => {
            this.isBest = id === this.id;
        });
    },

    methods: {
        create() {
            axios.post(this.endpoint)
            .then(response => {
                this.$toast.success(response.data.message, "Success", {
                    timeout: 3000,
                    position: 'bottomLeft',
                    displayMode: 2
                });

                this.isBest = true;

                eventBus.$emit('accepted', this.id);
            })
        }
    }
}
</script>