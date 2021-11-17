import * as Vue from "./vue.js";
import modal from "./modal.js";

Vue.createApp({
    data() {
        return {
            images: [],
            id: null,
            title: "",
            description: "",
            username: "",
            file: null,
        };
    },

    components: {
        "image-modal": modal,
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
            console.log("this.file:", this.file);
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

        setId(e) {
            const id = e.target.id;
            this.id = id;
            console.log("this.id:", this.id);
        },

        closeModal() {
            this.id = null;
        },
    },
}).mount("#main");
