import { ref, watchEffect } from 'vue'
//import { projectFirestore } from '../firebase/config'
import { db } from "../main";

const getCollection = collection => {
  const documents = ref(null) //複数のコンポーネントが考えられるため、毎回宣言されるように関数内で宣言する
  const error = ref(null)
  let collectionRef = db
    .collection(collection)
    .orderBy('createdAt')

  // onSnapshotでは第一引数ではsnapshotのメソッドを作成する
  // 第二引数では、エラーのメソッドを作成する
  const unsub = collectionRef.onSnapshot(
    // onSnapshotの第一引数部分
    snap => {
      //snapにはすべてのdocの情報が渡される
      let results = [] //ここに必要な情報のみを格納する
      snap.docs.forEach(doc => {
        //doc.data().createdAtがある場合にのみ、resultsにデータを格納するので&&でつなげる
        // createdAtはtimestampなので、timestampがない場合はそれ移行は実行されない。
        doc.data().createdAt && results.push({ ...doc.data(), id: doc.id })
      })
      documents.value = results //chatの内容の入ったデータをdocumentsに代入する
      error.value = null
    },
    // onSnapshotの第二引数部分
    err => {
      console.log(err.message)
      documents.value = null
      error.value = 'could not fetch data'
    }
  )

  // snapshotが複数回実行されてしまうのでアップデートされたときのみ実行したい
  watchEffect(onInvalidate => {
    // ウォッチャーが止まったら(コンポーネントがアンマウントしたら)prev collectionからアンサブスクライブする
    onInvalidate(() => unsub())
  })
  return { documents, error }
}

export default getCollection