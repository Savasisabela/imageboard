import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        };
    },

    mounted: function () {
        console.log("Vue app mounted");
        fetch("/images.json")
            .then((data) => data.json())
            .then((data) => {
                console.log("images from server GET:", data);
                this.images = data;
            })
            .catch((err) => {
                console.log("error fetching images from server:", err);
            });
    },
    updated: function () {
        console.log("Vue just updated");
    },
    methods: {
        setFile(e) {
            this.file = e.target.files[0];
        },
        upload() {
            const formData = new FormData();
            formData.append("file", this.file);
            formData.append("title", this.title);
            formData.append("username", this.username);
            formData.append("description", this.description);
            fetch("/upload", {
                method: "POST",
                body: formData,
            })
                .then((data) => data.json())
                .then((data) => {
                    console.log("images from server POST:", data);
                    this.images.unshift(data);
                })
                .catch((err) => {
                    console.log(
                        "error fetching uploaded images from server:",
                        err
                    );
                });
        },
    },
}).mount("#main");
