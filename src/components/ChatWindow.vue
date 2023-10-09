<template>
  <div class="chat-window">
    <div v-if="error">{{ error }}</div>
    <div v-if="documents" class="message" ref="messages">
      <div v-for="doc in formattedDocuments" :key="doc.id" class="single">
        <span class="created-at">{{ doc.createdAt }}</span>
        <span class="name">{{ doc.name }}</span>
        <span class="message">{{ doc.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>

import getCollection from '../composables/getCollection'
//import { formatDistanceToNow } from 'date-fns'
//import { ja } from 'date-fns/locale'
//import { computed, onUpdated, ref } from 'vue'
import { onUpdated, ref } from 'vue'

export default {
    setup() {
        const { error, documents } = getCollection('message')
        
        // 新しい日付に変換する Error: Expected to return a value in computed function
        const formattedDocuments = computed(() => {
            if (documents.value) {
                return documents.value.map(doc => {
                let time = formatDistanceToNow(doc.createdAt.toDate(), {
                    addSuffix: true,
                    locale: ja
                })
                return { ...doc, createdAt: time } //docにはmessageとかが含まれていて、createdAtはtimeで上書きする
                })
            }
        })
        
        // 最新メッセージへ自動スクロール
        const messages = ref(null)

        onUpdated(() => {
            messages.value.scrollTop = messages.value.scrollHeight
        })
        //return { error, documents, formattedDocuments, messages }
        return { error, documents, messages }
    }
}
</script>