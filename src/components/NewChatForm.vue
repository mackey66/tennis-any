<template>
  <form>
    <textarea
      placeholder="メッセージを入力して、enterキーを押してください"
      v-model="message"
      @keypress.enter.prevent="handleSubmit"
    >
    </textarea>
    <div class="error">{{error}}</div>
  </form>
</template>

<script>
import { ref } from '@vue/reactivity'
import getUser from '../composables/getUser'
import useCollection from '../composables/useCollection'
import { timestamp } from '../main'

export default {
  setup() {
    const { user } = getUser()
    const { addDoc, error } = useCollection('message')
    const message = ref('')
    const handleSubmit = async () => {
      const chat = {
        name: user.value.displayName,
        message: message.value,
        createdAt: timestamp()
      }
      await addDoc(chat)
      if(!error.value) {
        message.value = ''

      }
    }

    return { message, handleSubmit, error }
  }
}
</script>