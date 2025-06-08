<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl">
      <h1 class="text-2xl font-bold mb-4 text-center text-indigo-600">الگوریتم فشرده‌ساز تطبیق‌پذیر</h1>

      <textarea
        v-model="input"
        class="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="متن را اینجا وارد کنید..."
      ></textarea>

      <button
        @click="compress"
        class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
      >
        فشرده کن
      </button>

      <div v-if="output" class="mt-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">نتیجه فشرده‌سازی:</h2>
        <pre class="bg-gray-100 p-3 rounded-md text-sm break-words whitespace-pre-wrap">{{ output }}</pre>
      </div>

      <div v-if="Object.keys(dictionary).length" class="mt-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">دیکشنری فشرده‌سازی:</h2>
        <ul class="bg-gray-100 p-3 rounded-md text-sm max-h-40 overflow-auto">
          <li v-for="(count, char) in dictionary" :key="char" class="mb-1">
            "{{ char }}" : تکرار {{ count }}
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

  // تقسیم متن ورودی به آرایه کلمات (بر اساس فاصله)
  const words = text.split(/\s+/)
  
  let result = ''
  let current = words[0]
  let count = 1
  const dict = {}

  for (let i = 1; i < words.length; i++) {
    if (words[i] === current) {
      count++
    } else {
      if (count > 1) {
        dict[current] = (dict[current] || 0) + count
        result += `${current}${count} `
      } else {
        result += (current + ' ').repeat(count)
      }
      current = words[i]
      count = 1
    }
  }

  // آخرین کلمه
  if (count > 1) {
    dict[current] = (dict[current] || 0) + count
    result += `${current}${count} `
  } else {
    result += (current + ' ').repeat(count)
  }

  output.value = result.trim()
  dictionary.value = dict
}
</script>

