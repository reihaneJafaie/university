<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
      <h1 class="text-2xl font-bold text-indigo-600 mb-6 text-center">فشرده‌سازی کلمات به اعداد</h1>

      <textarea
        v-model="input"
        placeholder="جمله را اینجا وارد کنید..."
        class="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
      ></textarea>

      <button
        @click="compress"
        class="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
      >
        فشرده کن
      </button>

      <div v-if="output" class="mt-6">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">نتیجه فشرده‌سازی:</h2>
        <p class="bg-gray-100 p-4 rounded-md text-lg break-words">{{ output }}</p>
      </div>

      <div v-if="Object.keys(dictionary).length" class="mt-6">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">دیکشنری کلمات:</h2>
        <ul class="bg-gray-50 border border-gray-300 rounded-md p-4 max-h-48 overflow-auto">
          <li v-for="(index, word) in dictionary" :key="word" class="text-gray-800">
            "{{ word }}" =&gt; {{ index }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const output = ref('')
const dictionary = ref({})

const compress = () => {
  const text = input.value.trim()
  if (!text) {
    output.value = ''
    dictionary.value = {}
    return
  }

  const words = text.split(/\s+/)
  const wordMap = {}
  let index = 1

  const compressedArray = words.map(word => {
    if (!wordMap[word]) {
      wordMap[word] = index++
    }
    return wordMap[word]
  })

  output.value = compressedArray.join(' ')
  dictionary.value = wordMap
}
</script>
