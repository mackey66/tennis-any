<template>
    <div id="app" class="about">
        <Menu></Menu>
        <h4>チャット</h4>
        <ChatWindow  />
        <NewChatForm  />
    </div>
</template>

<script>
    // Firebase読み込み
    //import firebase from 'firebase'
    //import { db } from "../main";
    import Menu from '@/components/Menu.vue'
    import ChatWindow from '../components/ChatWindow.vue'
    import NewChatForm from '../components/NewChatForm.vue'

    export default {
        name: 'ramens',
        components: {
            Menu,
            ChatWindow,
            NewChatForm
        },
        data() {
            return {
                ramens: [],
                isLogin: false,
                loginUser: null,
                docId: null,
                no: 0,
                name: null
            }
        },
        mounted() {
            //            
        },
        methods: {
            //
        }
    }
</script>

<style scoped>
    h4 {
        margin-top: 20px;
    }
    
</style>