import comments from "./comments.js";

const modal = {
    data() {
        return {
            // url: "https://media.giphy.com/media/26CaLiM6RSxSwFwOI/giphy.gif",
            // title: "Good Job!",
            // description: "You are doing great, sweetie",
            // username: "God",
            // timestamp: "at some point in time",

            url: "",
            title: "",
            description: "",
            username: "",
            timestamp: "",
        };
    },

    props: ["id"],

    components: {
        "comment-session": comments,
    },

    mounted: function () {
        fetch(`/image/${this.id}`)
            .then((data) => {
                console.log("data before json:", data.body);
                return data.json();
            })
            .then((data) => {
                console.log("data after json:", data);
                if (data) {
                    this.url = data.url;
                    this.title = data.title;
                    this.description = data.description;
                    this.username = data.username;
                    this.timestamp = data["created_at"];
                } else {
                    this.$emit("close");
                }
            })
            .catch((err) => {
                console.log("error fetching current image from server:", err);
                this.$emit("close");
            });
    },

    template: `
        <div id="popup-bg">
            <div class="popup-items">
                <div class="popup-left">
                    <div class="popup-img">
                        <img
                            :src="url"
                            :alt="description"
                        />
                    </div>
                    <div class="popup-title">
                        <h3>{{title}}</h3>
                    </div>
                    <div class="popup-desc">
                        <p>{{description}}</p>
                    </div>
                    <div class="popup-time">
                        <p>{{username}} - {{timestamp}}</p>
                    </div>
                    

                </div>
                <div class="popup-right">
                    <div class="popup-btn">
                        <button @click="click">Close</button>
                    </div>
                    

                    <comment-session v-if='id' :id="id"></comment-session>
                </div>
            </div>
        </div>
    `,

    // filters: {
    //     moment: function (date) {
    //         return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    //     },
    // },

    methods: {
        click() {
            this.$emit("close");
        },
    },
};

export default modal;
