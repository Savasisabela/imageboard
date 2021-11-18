const comments = {
    data() {
        return {
            allComments: [],
            username: "",
            commentText: "",
        };
    },

    props: ["id"],

    mounted: function () {
        fetch(`/comments/${this.id}`)
            .then((data) => data.json())
            .then((data) => {
                console.log("data from comments received", data);
                this.allComments.unshift(data);
            })
            .catch((err) => {
                console.log("error fetching comments from server:", err);
            });
    },

    template: `
        <div class="popup-input">
                <input 
                    v-model="username"
                    type="text" placeholder="username" 
                />
                <input 
                    v-model="commentText"
                    type="text"
                    placeholder="write your comment here"
                />
                <button @click="submit">Submit</button>

        </div>

        <div class="popup-cmtsession" v-if="allComments.length > 0" v-for="comment in allComments">
            <p class="comment">
                {{comment["comment_text"]}}
            </p>
            <p class="author">{{comment.username}}</p>
            <p class="date">{{comment["created_at"]}}</p>
        </div>
    `,

    methods: {
        submit() {
            const commentsData = {
                imageId: this.id,
                username: this.username,
                commentText: this.commentText,
            };

            const stringCommentsData = JSON.stringify(commentsData);

            fetch("/comments.json", {
                method: "POST",
                body: stringCommentsData,
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((data) => data.json())
                .then((data) => {
                    console.log("comments from server POST:", data);
                    this.allComments.unshift(data);
                })
                .catch((err) => {
                    console.log("error fetching comments from server:", err);
                });
        },
    },
};

export default comments;
