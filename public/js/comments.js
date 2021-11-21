import gifs from "./gifsearch.js";

const comments = {
    data() {
        return {
            allComments: [],
            username: "",
            commentText: "",
            gifUrl: "",
            commentId: null,
        };
    },

    props: ["id"],

    watch: {
        id(newId, oldId) {
            console.log("newId", newId);
            console.log("oldId", oldId);

            if (newId != oldId && !isNaN(newId)) {
                this.fetchComments(newId);
            }
        },
    },

    components: {
        "gif-search": gifs,
    },

    mounted: function () {
        this.fetchComments(this.id);
    },

    template: `
    <div class="popup-cmts">
        
        <div class="popup-cmtsession">
            <div v-if="allComments.length > 0" v-for="comment in allComments">
                <p class="author"><strong>{{comment.username}}</strong> said: <button @click="delCom" :id="comment.id" class="del-comment">delete comment</button></p>
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
                    type="text" placeholder="username" required
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
        fetchComments(myId) {
            fetch(`/comments/${myId}`)
                .then((data) => data.json())
                .then((data) => {
                    this.allComments = data;
                    console.log("COMMENTS DATA", data);
                })
                .catch((err) => {
                    console.log("error fetching comments from server:", err);
                });
        },

        submit() {
            const commentsData = {
                imageId: this.id,
                username: this.username,
                commentText: this.commentText,
                gifUrl: this.gifUrl,
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
                    console.log("comments data on client side", data);
                    this.allComments.unshift(data);
                })
                .then(() => {
                    this.username = "";
                    this.commentText = "";
                    this.gifUrl = "";
                })
                .catch((err) => {
                    console.log("error fetching comments from server:", err);
                });
        },

        addGif(gif) {
            this.gifUrl = gif;
        },

        delCom(e) {
            console.log("comment id", e.target.id);

            fetch(`/delcom/${e.target.id}`)
                .then(() => console.log("comment successfully deleted"))
                .catch((err) =>
                    console.log("error deleting comment on client side", err)
                );
            for (let i = 0; i < this.allComments.length; i++) {
                if (e.target.id == this.allComments[i].id) {
                    this.allComments.splice(this.allComments[i], 1);
                }
            }
        },
    },
};

export default comments;
