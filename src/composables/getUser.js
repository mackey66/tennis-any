import { ref } from 'vue'
//import { projectAuth } from '../firebase/config'
import { projectAuth } from "../main";

// userを初期化するときログインしていたりする場合もあるのでnullは指定できない。
// projectAuthにはcurrentUserがあるのでそれを使う
const user = ref(projectAuth.currentUser)

// onAuthStateChanged()メソッドはログインしたりログアウトしたりサインアップしたりと認証の状態が変化するたびに実行される
projectAuth.onAuthStateChanged(_user => {
  // _userにログインしたりログアウトしたユーザーを格納する
  // 上のuserと分けるため、_userとする
  console.log(('user state changed. Current user is:', _user))
  user.value = _user
})

const getUser = () => {
  return { user }
}

export default getUser