<template>
    <div class="chat_"><Menu class="sticky-top"></Menu>
        <!-- Firebase から取得したリストを描画（トランジション付き） -->
        <transition-group name="chat" tag="div" class="chat bg-light p-1">
            <section v-for="{ key, name, image, date, message, memberUid } in chat" :key="key" class="item">          
                <div class="container-fluid padding0">
                    <div v-if='memberUid!=loginMemberUid' class="message d-flex flex-row align-items-center mb-0"> 
                        <div v-if='image' class="message-icon"><img :src="image" ></div>
                        <div v-else class="message-icon rounded-circle bg-secondary text-white fs-3">
                            <fa icon="user" />
                        </div>
                        <div class="item-detail text-left">
                            <div class="boxContainer">
                                <div class="item-name">{{ name }}</div>
                                <div class="item-date">&ensp;{{ dateFormat(date.toDate()) }}</div>
                            </div>
                            <p class="message-text p-2 ms-2 mb-0 bg-warning text-left">
                                {{ message }}
                            </p>
                        </div>
                    </div>
                    <div v-else class="message d-flex flex-row-reverse align-items-center mb-0">
                        <div v-if='image' class="message-icon"><img :src="image"></div>
                        <div v-else class="message-icon rounded-circle bg-secondary text-white fs-3">
                            <fa icon="user" />
                        </div>
                        <div class="item-detail-reverse">
                            <div class="boxContainer-reverse">
                                <div class="item-date ">{{ dateFormat(date.toDate()) }}&ensp;
                                </div>
                                <div class="item-name ">{{ name }}</div>   
                            </div>
                            <p class="message-text p-2 me-2 mb-0 bg-info text-left">
                                {{ message }}
                            </p>
                        </div>
                    </div>
                </div>
            </section>           
        </transition-group>
        <div class="bottom"></div>
        <div class="container-fluid fixed-bottom chat">
            <!-- 入力フォーム -->
            <form action="" @submit.prevent="buttonDoSend" class="form">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" :placeholder='$t("Please send a message")' aria-label="Recipient's username" aria-describedby="basic-addon2"
                        v-model="input"
                        :disabled="!user.uid"
                        @keyup.enter="doSend"
                        @keypress="setCanMessageSubmit">                      
                    <div class="input-group-append">
                        <button type="submit" :disabled="!user.uid" class="btn btn-primary">{{ $t("Send") }}</button>
                    </div>
                </div> 
            </form>  
        </div>
              
    </div>
</template>

<script>
    // Firebase読み込み
    import firebase from 'firebase'
    import { db } from "../main";
    import Menu from '@/components/Menu.vue'
    //import Nl2br from 'vue3-nl2br'
    import { format, formatDistanceToNow } from 'date-fns'
    import ja from 'date-fns/locale/ja'

    export default {
        name: 'ramens',
        components: {
            Menu,
            //Nl2br
        },
        data() {
            return {
                ramens: [],
                isLogin: false,
                loginUser: null,
                loginMemberName: null,
                loginMemberUid: null,
                format: format,
                locale: ja,
                name: null,
                user: {},  // ユーザー情報
                chat: [],  // 取得したメッセージを入れる配列
                input: '',  // 入力したメッセージ
                canMessageSubmit: false, // 日本語変換確定誤送信防止フラグ
                //composing: false,
                lastInput: null,
                source: this.$store.state.getOption
            }
        },
        mounted() {
            // ユーザー情報取得
            firebase.auth().onAuthStateChanged(user => {
                this.isLogin = true;
                this.loginUser = user;
                //
                this.user = user ? user : {}

                db.collection("members").where("userUid", "==", this.loginUser.uid)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            this.loginMemberName = doc.data().displayName;
                            this.loginMemberUid = doc.id;
                        });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                });
                this.getMessage()
            });
        },
        methods: {
            getMessage: function() {
                var ref_message = db.collection("messages");
                this.chat = []
                const array = [];
                ref_message.where("config", "==", this.$store.state.config).where("class", "==", "chat").orderBy('date', 'desc').limit(50).onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        const d = change.doc.data()
                        d.key = change.doc.id
                        array.push(d)                                                 
                    });
                    array.sort(function(a,b){
                        if(a.date < b.date) return -1;
                        if(a.date > b.date) return 1;
                        return 0;
                    });
                    this.chat = array
                    this.scrollBottom()
                })
            },
            // スクロール位置を一番下に移動
            scrollBottom() {
                this.$nextTick(() => {
                    window.scrollTo(0, document.body.clientHeight)
                })
            },
            setCanMessageSubmit() {
                this.canMessageSubmit = true
            },
            buttonDoSend: function() {
                this.canMessageSubmit = true
                this.doSend()
            },
            doSend: function() {
                if (this.user.uid && this.input.length) { 
                    /*                 
                    if (!this.composing) {
                        // 変換確定時
                        console.log("変換確定時?")
                    } else {
                        // それ以外（英数モード?）
                        console.log("英数モード?")
                    }
                    */
                    if (!this.canMessageSubmit) return   
                    // 同じ内容の送信防止（更新後1回目に日本語変換なしの英数モードで入力すると2重に送信さるのを防止）
                    if (this.lastInput == this.input) return
                    this.lastInput = this.input
                    // firebase にメッセージを追加
                    db.collection("messages").doc().set({
                        config: this.$store.state.config,
                        class: "chat",
                        date: firebase.firestore.Timestamp.fromDate(new Date()),
                        message: this.input,
                        name: this.loginMemberName,
                        image: this.user.photoURL,
                        memberUid: this.loginMemberUid
                    })
                    .then(() => {    
                        this.getMessage()
                        this.input = '' // フォームを空にする
                        this.canMessageSubmit = false
                    })
                    .catch((error) => {
                        console.log("Error writing documents: ", error);
                    });                   
                }
            },
            dateFormat: function(d) {
                let a = formatDistanceToNow(d, {
                    addSuffix: true,
                    locale: ja
                })
                return a 
            }          
        }
    }
</script>

<style scoped>
    h4 {
        margin-top: 20px;
    }
    .chat_ {
        min-width: 376px;
    }

    * {
        margin: 0;
        box-sizing: border-box;
    }

    ._header {
        background: #3ab383;
        margin-bottom: 1em;
        padding: 0.4em 0.8em;
        color: #fff;
    }
    .content {
        margin: 0 0 auto 0;
        padding: 0 10px;
        max-width: 600px;
    }
    ._form {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        bottom: 0;
        height: 45px;
        width: 60%;
        background: #f5f5f5;
    }
    .form _textarea {
        border: 1px solid #ccc;
        border-radius: 2px;
        height: 4em;
        width: calc(100% - 6em);
        resize: none;
    }
    .list {
        margin-bottom: 100px;
    }
    .item {
        position: relative;
        display: flex;
        align-items: flex-end;
        margin-bottom: 0.8em;
    }
    .item-image img {
        border-radius: 20px;
        vertical-align: top;
    }
    
    .item-name {
        font-size: 80%;
    }
    .item-date {
        font-size: 60%;
    }
    .item-message {
        position: relative;
        display: inline-block;
        padding: 0.8em;
        background: #deefe8;
        border-radius: 4px;
        line-height: 1.2em;
    }
    .item-message::before {
        position: absolute;
        content: " ";
        display: block;
        left: -16px;
        bottom: 12px;
        border: 4px solid transparent;
        border-right: 12px solid #deefe8;
    }
    .item-message-other {
        position: relative;
        display: inline-block;
        padding: 0.8em;
        background: #dedeef;
        border-radius: 4px;
        line-height: 1.2em;
    }
    .item-message-other::before {
        position: absolute;
        content: " ";
        display: block;
        left: -16px;
        bottom: 12px;
        border: 4px solid transparent;
        border-right: 12px solid #deefe8;
    }
    .send-button {
        height: 4em;
    }
    /* トランジション用スタイル */
    .chat-enter-active {
        transition: all 1s;
    }
    .chat-enter {
        opacity: 0;
        transform: translateX(-1em);
    }
    .item-detail {
        margin: 0 0 0 0.5em;
    }
    .item-detail-reverse {
        margin: 0 0.5em 0 0 ;
        text-align: right;

    }
    .boxContainer {
        display: flex;
        align-items: center;
    }
    .boxContainer-reverse {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    body {
        font-size: 100%;
    }
    .chat {
        max-width: 500px;
        
        margin: 0 auto;
    }
    
    .message-icon {
        width: 48px;
        height: 48px;
        text-align: center;
        line-height: 48px;
    }
    .message-icon img {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        vertical-align: top;
    }
    .message-text {
        display: inline-block;
        max-width: 100%;
        border-radius: 1rem;
    }
    .bottom {
        margin-bottom: 70px;
    }
    .padding0 {
        padding: 0;
    }
</style>