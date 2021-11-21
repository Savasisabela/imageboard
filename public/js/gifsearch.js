import { secret } from "./secret.js";
// import gifSearch from "vue-gif-search";

const gifs = {
    data() {
        return {
            gifUrl: "http://api.giphy.com/v1/gifs",
            gifKey: secret,
            url: "",
            secret: secret,
            search: "",
            searchedGifs: null,
            timer: null,
        };
    },

    template: `
        <div>
            <div class="results-box" v-if="searchedGifs">
                <div  v-for="gif in searchedGifs">               
                    
                    <img @click.self="clicked" class="gifs" :src="gif.images.preview_gif.url" :gifurl="gif.url">                                           
                    
                </div>
            </div>
            <input type="text" name="search" v-model="search" @keyup="searchGifs">
        </div>
    `,

    methods: {
        searchGifs() {
            const url = `${this.gifUrl}/search?api_key=${this.gifKey}&q=${this.search}&limit=10`;
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.timer = setTimeout(() => {
                fetch(url)
                    .then((data) => data.json())
                    .then((data) => {
                        console.log("data.data------>", data.data);
                        return (this.searchedGifs = data.data);
                    })
                    .catch((err) => console.log("error fetching gifs", err));
            }, 800);
        },

        clicked(e) {
            console.log("gif was clicked");
            this.searchedGifs = null;
            let gif = e.target.src;
            this.$emit("setgif", gif);
        },
    },
};

export default gifs;
