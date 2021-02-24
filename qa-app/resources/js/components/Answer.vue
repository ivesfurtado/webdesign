<script>
export default {
    props: ['answer'],

    data() {
        return {
            editing: false,
            body: this.answer.body,
            bodyHtml: this.answer.body_html,
            id: this.answer.id,
            questionId: this.answer.question_id,
            beforeEditCache: null
        }
    },

    computed: {
        isInvalid() {
            return this.body.length < 1;
        }
    },

    methods: {
        edit() {
            this.beforeEditCache = this.body;
            this.editing = true;
        },

        cancel() {
            this.body = this.beforeEditCache;
            this.editing = false;
        },

        update() {
            axios.patch(`${this.questionId}/answers/${this.id}`, {
                body: this.body
            })
            .then(response => {
                this.editing = false;
                this.bodyHtml = response.data.body_html;
                alert("Yahooo!");
            })
            .catch(error => {
                alert(error.response.data.errors.body);
                console.log(error.response);
            });
        }
    }
}
</script>