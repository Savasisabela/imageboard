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
            next: null,
            prev: null,
        };
    },

    props: ["id"],

    components: {
        "comment-session": comments,
    },

    mounted: function () {
        this.getImage(this.id);
    },

    template: `
        <div id="popup-bg">
            <div class="left-btn">
                <button @click="prevImg" v-if="prev" :id="prev" class="arrow left">
                    <svg
                        width="60px"
                        height="80px"
                        viewBox="0 0 50 80"
                        xml:space="preserve"
                    >
                        <polyline
                            fill="none"
                            stroke="#8a2387"
                            stroke-width="1"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            points="
                        45.63,75.8 0.375,38.087 45.63,0.375 "
                        />
                    </svg>
                </button>
            </div>
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
                <div class="right-btn">
                <button @click="nextImg" v-if="next" :id="next" class="arrow right">
                    <svg
                        width="60px"
                        height="80px"
                        viewBox="0 0 50 80"
                        xml:space="preserve"
                    >
                        <polyline
                            fill="none"
                            stroke="#8a2387"
                            stroke-width="1"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            points="
                        0.375,0.375 45.63,38.087 0.375,75.8 "
                        />
                    </svg>
                </button>
            </div>
        </div>
    `,

    watch: {
        id(newId, oldId) {
            this.getImage(newId);
        },
    },

    methods: {
        getImage(id) {
            fetch(`/image/${id}`)
                .then((data) => {
                    console.log("data before json:", data.body);
                    return data.json();
                })
                .then((data) => {
                    console.log("data after json:", data);
                    if (data) {
                        console.log("next img id:", data.prevId);
                        this.next = data.prevId;
                        console.log("prev img id:", data.nextId);
                        this.prev = data.nextId;
                        this.url = data.url;
                        this.title = data.title;
                        this.description = data.description;
                        this.username = data.username;
                        this.timestamp = data["created_at"];
                    } else {
                        console.log("THERE IS NOOOO DATA");
                        this.$emit("redirect");
                    }
                })
                .catch((err) => {
                    console.log(
                        "error fetching current image from server:",
                        err
                    );
                    this.$emit("redirect");
                });
        },

        click() {
            this.$emit("close");
        },

        nextImg() {
            console.log("next image id", this.next);
            let newId = this.next;
            this.$emit("change", newId);
        },

        prevImg() {
            console.log("prev image id", this.prev);
            let newId = this.prev;
            this.$emit("change", newId);
        },
    },
};

export default modal;
