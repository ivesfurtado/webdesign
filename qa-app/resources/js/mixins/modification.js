import destroy from './destroy';

export default {
    mixins: [destroy],

    data() {
        return {
            editing: false
        }
    },

    methods: {
        edit() {
            this.setEditCache();
            this.editing = true;
        },

        cancel() {
            this.restoreFromCache();
            this.editing = false;
        },

        setEditCache() {},
        restoreFromCache() {},

        update() {
            axios.put(this.endpoint, this.payload())
            .then(response => {
                this.editing = false;
                this.bodyHtml = response.data.body_html;
                this.$toast.success(response.data.message, "Success", { timeout: 3000 });
            })
            .catch(error => {
                this.$toast.error(error.response.data.message, "Error", { timeout: 3000 });
            });
        },

        payload() {},
    }
}