<template>
    <div>
        <h2>{{ $t("Login") }}</h2>
        <div id='firebaseui-auth-container'></div>
    </div>
</template>

<script>
    // Firebase読み込み
    import firebase from 'firebase'
    // FirebaseUI読み込み
    import firebaseui from 'firebaseui-ja'
    import 'firebaseui-ja/dist/firebaseui.css'
<<<<<<< HEAD
    import { ja, enUS, zhCN, zhTW, ru, de, fr, nl, es, pt, it, arSA, ko, sr, cs, ro, hr, sv, sk } from 'date-fns/locale'
=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9

    export default {
        name: 'Login',
        data() {
            return {
<<<<<<< HEAD
                locale: ja
=======
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
            }
        },
        mounted() {
            // thisを格納
            const root = this;
            // 言語の設定
            this.setLanguage();
            // 認証設定
            const uiConfig = {
                callbacks: {
                    signInSuccessWithAuthResult: function(authResult) {
                        //var displayName = authResult.user.displayName;
                        //var photoURL = authResult.user.photoURL;
                        // 認証種類判定
                        if (authResult.additionalUserInfo.providerId === 'twitter.com') {
                            return true;
                        } else if (authResult.additionalUserInfo.providerId === 'facebook.com') {
                            //photoURL = authResult.additionalUserInfo.profile.picture.data.url;
                            //authResult.user.photoURL = authResult.additionalUserInfo.profile.picture.data.url
                            return true
                        } else {
                            // 確認メールの有無
                            const mailFlag = authResult.user.emailVerified;
                            if (mailFlag === false) {
                                // 確認メール未時に確認メール送信
                                firebase.auth().currentUser.sendEmailVerification()
                                    .then(function() {
                                        alert('登録メールを送信しました。ご確認ください。');
                                        // URLリロード
                                        root.$router.go()
                                    })
                                    .catch(function(error) {
                                        console.log(error)
                                    });
                            } else {
                                // 確認メール済時にメイン画面へ移動
                                return true;
                            }
                        }
                        /*
                        var user = {
                            displayName: displayName,
                            photoURL: photoURL
                        };
                        firebase
                            .auth()
                            .currentUser.updateProfile(user)
                            .then(res => {
                                console.log("Auth登録完了", res);
                                alert("ログインしました。");
                                root.$router.go();
                            });
                        */
                    }
                },
                // 認証時に同一ウィンドウで表示
                signInFlow: 'redirect',
                // ログイン後リダイレクト先
                //signInSuccessUrl: '#/main', // localhost
                signInSuccessUrl: '/main/',
                // 各認証
                signInOptions: [
                    // twitter認証
<<<<<<< HEAD
                    //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                    // facebook認証
                    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                    // メール認証
                    firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    // Google認証
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID
=======
                    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                    // facebook認証
                    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                    // メール認証
                    firebase.auth.EmailAuthProvider.PROVIDER_ID
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
                ],
                // 利用規約へリンク
                tosUrl: 'https://i-wan.jp/about/',
                // プライバシーポリシーリンク
                privacyPolicyUrl: 'https://i-wan.jp/about/?request=privacy'
            };

            // 認証UI表示
            const ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start('#firebaseui-auth-container', uiConfig);

            
        },
        methods: {
            setLanguage: function() {
                const lg = navigator.language
                console.log(lg)
<<<<<<< HEAD
                //this.$i18n.locale = lg
                switch (lg) {
                    case "en-US":
                        this.locale = enUS;
                        this.$i18n.locale = "en"
                        break;
                    case "ja":
                        this.locale = ja;
                        this.$i18n.locale = "ja"
                        break;
                    case "zh-CN":
                        this.locale = zhCN;
                        this.$i18n.locale = "zhCN"
                        break;
                    case "zh-TW":
                        this.locale = zhTW;
                        this.$i18n.locale = "zhTW"
                        break;
                    case "ru-RU":
                        this.locale = ru;
                        this.$i18n.locale = "ru"
                        break;
                    case "de":
                        this.locale = de;
                        this.$i18n.locale = "de"
                        break;
                    case "fr":
                        this.locale = fr;
                        this.$i18n.locale = "fr"
                        break;
                    case "nl":
                        this.locale = nl;
                        this.$i18n.locale = "nl"
                        break;
                    case "es-ES":
                        this.locale = es;
                        this.$i18n.locale = "es"
                        break;
                    case "pt-PT":
                        this.locale = pt;
                        this.$i18n.locale = "pt"
                        break;
                    case "it-IT":
                        this.locale = it;
                        this.$i18n.locale = "it"
                        break;
                    case "ar":
                        this.locale = arSA;
                        this.$i18n.locale = "ar"
                        break;
                    case "ko-KR":
                        this.locale = ko;
                        this.$i18n.locale = "ko"
                        break;
                    case "sr-RS":
                        this.locale = sr;
                        this.$i18n.locale = "sr"
                        break;
                    case "cs":
                        this.locale = cs;
                        this.$i18n.locale = "cs"
                        break;
                    case "ro-RO":
                        this.locale = ro;
                        this.$i18n.locale = "ro"
                        break;
                    case "hr":
                        this.locale = hr;
                        this.$i18n.locale = "hr"
                        break;
                    case "sv-SE":
                        this.locale = sv;
                        this.$i18n.locale = "sv"
                        break;
                    case "sk":
                        this.locale = sk;
                        this.$i18n.locale = "sk"
                        break;
                    default:
                        this.locale = ja;
                        this.$i18n.locale = "ja"
                }               
=======
                firebase.auth().languageCode = lg
                switch (lg) {
                    case "en-US":
                        this.$i18n.locale = "en"
                        break;
                    case "ja":
                        this.$i18n.locale = "ja"
                        break;
                    case "zh-CN":
                        this.$i18n.locale = "zhCN"
                        break;
                    case "zh-TW":
                        this.$i18n.locale = "zhTW"
                        break;
                    case "ru-RU":
                        this.$i18n.locale = "ru"
                        break;
                    case "de":
                        this.$i18n.locale = "de"
                        break;
                    case "fr":
                        this.$i18n.locale = "fr"
                        break;
                    case "nl":
                        this.$i18n.locale = "nl"
                        break;
                    case "es-ES":
                        this.$i18n.locale = "es"
                        break;
                    case "pt-PT":
                        this.$i18n.locale = "pt"
                        break;
                    case "it-IT":
                        this.$i18n.locale = "it"
                        break;
                    case "ar":
                        this.$i18n.locale = "ar"
                        break;
                    case "ko-KR":
                        this.$i18n.locale = "ko"
                        break;
                    case "sr-RS":
                        this.$i18n.locale = "sr"
                        break;
                    case "cs":
                        this.$i18n.locale = "cs"
                        break;
                    case "ro-RO":
                        this.$i18n.locale = "ro"
                        break;
                    case "hr":
                        this.$i18n.locale = "hr"
                        break;
                    case "sv-SE":
                        this.$i18n.locale = "sv"
                        break;
                    case "sk":
                        this.$i18n.locale = "sk"
                        break;
                    default:
                        this.$i18n.locale = "en"
                }
>>>>>>> 5c3e9f6dacee420def3ccbc590456f487c55b3a9
            }
        }
    };
</script>

<style scoped>
    h2 {
        margin-top: 40px;
        margin-bottom: 40px;
        text-align: center;
    }
</style>