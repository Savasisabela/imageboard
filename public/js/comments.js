import gifs from "./gifsearch.js";

const comments = {
    data() {
        return {
            allComments: [],
            username: "",
            commentText: "",
            gifUrl: "",
        };
    },

    props: ["id"],

    components: {
        "gif-search": gifs,
    },

    mounted: function () {
        fetch(`/comments/${this.id}`)
            .then((data) => data.json())
            .then((data) => {
                this.allComments = data;
                console.log("COMMENTS DATA", data);
            })
            .catch((err) => {
                console.log("error fetching comments from server:", err);
            });
    },

    template: `
    <div class="popup-cmts">
        
        <div class="popup-cmtsession">
            <div v-if="allComments.length > 0" v-for="comment in allComments">
                <p class="author"><strong>{{comment.username}}</strong> said:</p>
                <p class="comment">
                    {{comment["comment_text"]}}
                </p>
                <img :src="comment['gif_url']">
               
                <p class="date">{{comment["created_at"]}}</p>
                <hr>
            </div>
        </div>
        <div class="popup-input">
            <div class="popup-user">
                <input 
                    v-model="username"
                    type="text" placeholder="username" 
                />
            </div>
            <div class="popup-comment">
                <textarea 
                    v-model="commentText"
                    type="text"
                    placeholder="write your comment here"> 
                    
                </textarea>
            </div>
            <gif-search @setgif="addGif"></gif-search>
            <div class="popup-submitbtn">
                <button @click="submit">Submit</button>
            </div>

        </div>
    </div>
    `,

    methods: {
        submit() {
            const commentsData = {
                imageId: this.id,
                username: this.username,
                commentText: this.commentText,
                gifUrl: this.gifUrl,
            };
            console.log("data before stringify", commentsData);
            const stringCommentsData = JSON.stringify(commentsData);
            console.log("data after stringify", stringCommentsData);
            fetch("/comments.json", {
                method: "POST",
                body: stringCommentsData,
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((data) => data.json())
                .then((data) => {
                    this.allComments.unshift(data);
                })
                .then(() => {
                    this.username = "";
                    this.commentText = "";
                })
                .catch((err) => {
                    console.log("error fetching comments from server:", err);
                });
        },

        addGif(gif) {
            this.gifUrl = gif;
        },
    },
};

export default comments;
