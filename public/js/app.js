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
        };
    },

    components: {
        "image-modal": modal,
    },

    mounted: function () {
        console.log("Vue app mounted");

        // if (isNaN(this.id)) {
        //     this.id = null;
        //     history.replaceState({}, "", `/`);
        // }
        fetch("/images.json")
            .then((data) => data.json())
            .then((data) => {
                this.images = data;
            })
            .catch((err) => {
                console.log("error fetching images from server:", err);
            });

        addEventListener("popstate", (e) => {
            console.log(location.pathname, e.state);
            this.id = location.pathname.slice(1);
            // console.log("location pathname:", location.pathname.slice(1));
            // show whatever is appropriate for the new url
            // if you need it, e.state has the data you passed to `pushState`
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
                    this.images.unshift(data);
                })
                // .then(() => {
                //     this.username = "";
                //     this.description = "";
                //     this.title = "";
                //     this.file = null;
                // })
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
            history.pushState({}, "", `/${id}`);
        },

        closeModal() {
            this.id = null;
            history.pushState({}, "", `/`);
        },

        loadMore() {
            let lowestId = this.images[this.images.length - 1].id;
            fetch(`/getmore/${lowestId}`)
                .then((data) => data.json())
                .then((data) => {
                    console.log("dataaaaaa:", data);
                    data.forEach((image) => {
                        if (image.id != lowestId) {
                            this.images.push(image);
                        }
                    });
                    let dataLowestId = data[0].lowestId;
                    let newLowestId = this.images[this.images.length - 1].id;
                    console.log("newLowestId", newLowestId);
                    if (dataLowestId === newLowestId) {
                        this.moreBtn = false;
                    }
                    console.log("moreBtn:", this.moreBtn);
                })
                .catch((err) => {
                    console.log("error fetching more images from server:", err);
                });
        },
    },
}).mount("#main");
