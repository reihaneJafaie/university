<template>
  <div class="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto mt-10">
    <h1 class="text-2xl font-bold text-indigo-700 mb-4">Prefix-Free Decoder</h1>

    <textarea
      v-model="encoded"
      class="w-full h-24 p-3 border border-gray-300 rounded mb-4"
      placeholder="رمز باینری را وارد کنید (مثلاً 01110)"
    ></textarea>

    <textarea
      v-model="mappingText"
      class="w-full h-32 p-3 border border-gray-300 rounded mb-4"
      placeholder='دیکشنری کدگذاری را وارد کن، مثلاً {"A": "0", "B": "10", "C": "11"}'
    ></textarea>

    <button @click="decode" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
      دیکد کن
    </button>

    <div v-if="decoded" class="mt-6">
      <h2 class="text-lg font-semibold text-gray-700 mb-2">متن دیکد شده:</h2>
      <div class="bg-gray-100 p-3 rounded text-sm font-mono break-words whitespace-pre-wrap">
        {{ decoded }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const encoded = ref('')
const mappingText = ref('')
const decoded = ref('')

const decode = () => {
  let mapping
  try {
    mapping = JSON.parse(mappingText.value)
  } catch (e) {
    decoded.value = 'فرمت دیکشنری اشتباهه!'
    return
  }

  // تبدیل map معکوس: از کد به حرف
  const codeMap = {}
  for (const [char, code] of Object.entries(mapping)) {
    codeMap[code] = char
  }

  let buffer = ''
  let result = ''

  for (let bit of encoded.value) {
    buffer += bit
    if (codeMap[buffer]) {
      result += codeMap[buffer]
      buffer = ''
    }
  }

  if (buffer !== '') {
    decoded.value = 'کد ناقص است یا رمزنگاری اشتباهه.'
  } else {
    decoded.value = result
  }
}
</script>
