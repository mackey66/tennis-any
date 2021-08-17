import { ref } from 'vue'
//import { projectFirestore } from '../firebase/config'
import { db } from "../main";


// Firescoreのcollection()メソッドに渡したいコレクションを指定する。
// 今回の場合messageを渡したいので、useCollectionの引数としてmessageを受け取れるようにする
const useCollection = collection => {
  const error = ref(null) //collectionはいろいろあるので複数のエラーが考えられる。そのため毎回errorを作成できるように関数内で宣言する

  const addDoc = async doc => { //docにはchatが渡ってくる
    error.value = null
    try {
      // collection()メソッドの引数にはmessageが渡ってくる
      await db.collection(collection).add(doc)
    } catch (err) {
      console.log(err.message)
      error.value = 'could not send the message'
    }
  }
  return { addDoc, error }
}

export default useCollection