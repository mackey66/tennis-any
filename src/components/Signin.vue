<template>
    <div>
        <h2>Login</h2>
        <div id='firebaseui-auth-container'></div>
    </div>
</template>

<script>
    // Firebase読み込み
    import firebase from 'firebase'
    // FirebaseUI読み込み
    import firebaseui from 'firebaseui-ja'
    import 'firebaseui-ja/dist/firebaseui.css'

    export default {
        name: 'Login',
        data() {
            return {
            }
        },
        mounted() {
            // thisを格納
            const root = this;
            // 認証設定
            const uiConfig = {
                callbacks: {
                    signInSuccessWithAuthResult: function(authResult) {
                        // 認証種類判定
                        if (authResult.additionalUserInfo.providerId === 'twitter.com') {
                            return true;
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
                    }
                },
                // 認証時に同一ウィンドウで表示
                signInFlow: 'redirect',
                // ログイン後リダイレクト先
                signInSuccessUrl: '/main',
                // 各認証
                signInOptions: [
                    // twitter認証
                    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                    // facebook認証
                    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                    // メール認証
                    firebase.auth.EmailAuthProvider.PROVIDER_ID
                ],
                // 利用規約へリンク
                tosUrl: 'https://i-wan.jp/about/',
                // プライバシーポリシーリンク
                privacyPolicyUrl: 'https://i-wan.jp/about/?request=privacy'
            };

            // 認証UI表示
            const ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start('#firebaseui-auth-container', uiConfig);

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