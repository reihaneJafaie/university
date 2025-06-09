<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-center mb-4">کدگذاری شانون–فانو</h1>

    <textarea
      v-model="text"
      class="w-full h-32 p-3 border border-gray-300 rounded-md mb-4"
      placeholder="متن مورد نظر را وارد کنید..."
    ></textarea>

    <button @click="run" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
      تولید کدها
    </button>

    <div v-if="frequencies.length" class="mt-6">
      <h2 class="text-lg font-semibold mb-2">نتیجه کلی</h2>
      <table class="w-full table-auto border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2">کاراکتر</th>
            <th class="border px-4 py-2">تعداد</th>
            <th class="border px-4 py-2">فرکانس</th>
            <th class="border px-4 py-2">کد شانون–فانو</th>
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
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'

const text = ref('')
const frequencies = ref([])
const codes = ref({})

const run = () => {
  const input = text.value.trim()
  if (!input) return

  // شمارش تعداد
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

  // مرتب‌سازی نزولی
  freqList.sort((a, b) => b.freq - a.freq)

  frequencies.value = freqList

  // ساخت درخت شانون-فانو
  const buildCodes = (list, prefix = '') => {
    if (list.length === 1) {
      codes.value[list[0].char] = prefix || '0'
      return
    }

    // پیدا کردن نقطه تقسیم
    let split = 1
    let totalFreq = list.reduce((sum, item) => sum + item.freq, 0)
    let minDiff = Infinity

    for (let i = 1; i < list.length; i++) {
      const leftFreq = list.slice(0, i).reduce((sum, item) => sum + item.freq, 0)
      const rightFreq = totalFreq - leftFreq
      const diff = Math.abs(leftFreq - rightFreq)
      if (diff < minDiff) {
        minDiff = diff
        split = i
      }
    }

    const left = list.slice(0, split)
    const right = list.slice(split)

    buildCodes(left, prefix + '0')
    buildCodes(right, prefix + '1')
  }

  codes.value = {}
  buildCodes(freqList)
}
</script>

<style>
body {
  direction: rtl;
  font-family: sans-serif;
}
</style>
