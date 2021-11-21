import * as Vue from "./vue.js";
import modal from "./modal.js";

Vue.createApp({
    data() {
        return {
            images: [],
            id: location.pathname.slice(1),
            title: "",
            description: "",
            username: "",
            file: null,
            moreBtn: true,
            bigFile: false,
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
                this.images = data;
            })
            .catch((err) => {
                console.log("error fetching images from server:", err);
            });

        addEventListener("popstate", (e) => {
            this.id = location.pathname.slice(1);
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
                .then((data) => {
                    return data.json();
                })
                .then((data) => {
                    if (data.fileTooBig) {
                        this.bigFile = true;
                    } else {
                        this.images.unshift(data);
                        this.bigFile = false;
                    }
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

            if (!isNaN(id)) {
                history.pushState({}, "", `/${id}`);
            }
        },

        changeId(newId) {
            let id = (this.id = newId);
            console.log("ID ON CHANGEID APP.JS", id);
            if (!isNaN(id)) {
                history.pushState({}, "", `/${id}`);
            }
        },

        closeModal() {
            history.pushState({}, "", `/`);
            this.id = null;
        },

        delImage() {
            history.pushState({}, "", `/`);
            for (let i = 0; i < this.images.length; i++) {
                if (this.id == this.images[i].id) {
                    this.images.splice(i, 1);
                }
            }
            this.id = null;
        },

        redirectModal() {
            this.id = null;
            history.replaceState({}, "", `/`);
        },

        loadMore() {
            let lowestId = this.images[this.images.length - 1].id;
            fetch(`/getmore/${lowestId}`)
                .then((data) => data.json())
                .then((data) => {
                    data.forEach((image) => {
                        if (image.id != lowestId) {
                            this.images.push(image);
                        }
                    });
                    let dataLowestId = data[0].lowestId;
                    let newLowestId = this.images[this.images.length - 1].id;
                    if (dataLowestId === newLowestId) {
                        this.moreBtn = false;
                    }
                })
                .catch((err) => {
                    console.log("error fetching more images from server:", err);
                });
        },
    },
}).mount("#main");
