import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            images: [],
        };
    },

    mounted: function () {
        console.log("vue app mounted");
        fetch("/images.json")
            .then((data) => data.json())
            .then((data) => {
                console.log("images from server:", data);
                this.images = data;
            })
            .catch((err) => {
                console.log("error fetching images from server:", err);
            });
    },
    updated: function () {
        console.log("vue just updated");
    },
    methods: {},
}).mount("#main");
