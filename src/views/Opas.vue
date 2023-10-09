<!-- 外部htmlをペーシの一部として読み込む例（不使用） -->
<template>   
    <div class="hello">
        <p>OPAS</p>
        <div v-html="htmlContent"></div>
    </div>
</template>

<script>
export default {
    name: "HelloWorld",
    data() {
        return {
            htmlContent: "",
            query: this.$route.query
        };
    },
    mounted: function () {
        this.loadHtml();
    },
    methods: {
        loadHtml() {
            fetch("./opas/index.html").then((res) => {
                res.text().then((html) => {
                this.htmlContent = html;
                });
            });
        },
    },
};
</script>

<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>