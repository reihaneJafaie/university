<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-center mb-4">کدگذاری هافمن</h1>

    <textarea
      v-model="text"
      class="w-full h-32 p-3 border border-gray-300 rounded-md mb-4"
      placeholder="متن مورد نظر را وارد کنید..."
    ></textarea>

    <button @click="run" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
      تولید کدها
    </button>

    <div v-if="frequencies.length" class="mt-6 space-y-6">
      <h2 class="text-lg font-semibold mb-2">نتیجه کلی</h2>
      <table class="w-full table-auto border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2">کاراکتر</th>
            <th class="border px-4 py-2">تعداد</th>
            <th class="border px-4 py-2">فرکانس</th>
            <th class="border px-4 py-2">کد هافمن</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in frequencies" :key="i">
            <td class="border px-4 py-2 text-center">{{ item.char }}</td>
            <td class="border px-4 py-2 text-center">{{ item.count }}</td>
            <td class="border px-4 py-2 text-center">{{ item.freq.toFixed(3) }}</td>
            <td class="border px-4 py-2 text-center">{{ codes[item.char] }}</td>
          </tr>
        </tbody>
      </table>

      <div class="mt-6">
        <h2 class="text-lg font-semibold mb-2">متن فشرده شده (رشته باینری)</h2>
        <textarea
          class="w-full h-24 p-3 border border-gray-300 rounded-md font-mono"
          readonly
          :value="compressed"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
const frequencies = ref([])
const codes = ref({})
const compressed = ref('')

class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char
    this.freq = freq
    this.left = left
    this.right = right
  }
}

const run = () => {
  const input = text.value.trim()
  if (!input) return

  const freqMap = {}
  for (const ch of input) {
    freqMap[ch] = (freqMap[ch] || 0) + 1
  }

  const total = input.length
  const freqList = Object.entries(freqMap).map(([char, count]) => ({
    char,
    count,
    freq: count / total
  }))

  freqList.sort((a, b) => a.freq - b.freq)
  frequencies.value = freqList

  let nodes = freqList.map(item => new HuffmanNode(item.char, item.freq))

  while (nodes.length > 1) {
    const left = nodes.shift()
    const right = nodes.shift()
    const merged = new HuffmanNode(null, left.freq + right.freq, left, right)
    nodes.push(merged)
    nodes.sort((a, b) => a.freq - b.freq)
  }

  const root = nodes[0]

  const codeMap = {}
  const buildCodes = (node, prefix = '') => {
    if (!node) return
    if (node.char !== null) {
      codeMap[node.char] = prefix || '0'
      return
    }
    buildCodes(node.left, prefix + '0')
    buildCodes(node.right, prefix + '1')
  }
  buildCodes(root)
  codes.value = codeMap

  // ساخت رشته فشرده شده
  compressed.value = input.split('').map(ch => codeMap[ch]).join('')
}
</script>

<style>
body {
  direction: rtl;
  font-family: sans-serif;
}
textarea[readonly] {
  background-color: #f9f9f9;
  resize: none;
  font-family: monospace;
  letter-spacing: 0.1em;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
