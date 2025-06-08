<template>
  <div class="max-w-xl mx-auto p-6 bg-gray-100 rounded-md shadow-md">
    <h1 class="text-2xl font-bold mb-4">کدگذاری حسابی ساده</h1>

    <input
      v-model="inputString"
      type="text"
      placeholder="رشته (مثلا: AB)"
      class="w-full p-2 border border-gray-300 rounded mb-4"
      maxlength="10"
    />

    <button
      @click="encode"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      کدگذاری کن
    </button>

    <div v-if="steps.length" class="mt-6">
      <h2 class="text-xl font-semibold mb-2">گام‌های کدگذاری:</h2>

      <table class="table-auto w-full border border-gray-300">
        <thead>
          <tr class="bg-gray-200">
            <th class="border px-2 py-1">کاراکتر</th>
            <th class="border px-2 py-1">بازه حداقل</th>
            <th class="border px-2 py-1">بازه حداکثر</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(step, index) in steps"
            :key="index"
            class="text-center border-t border-gray-300"
          >
            <td class="border px-2 py-1 font-mono">{{ step.char }}</td>
            <td class="border px-2 py-1 font-mono">{{ step.low.toFixed(4) }}</td>
            <td class="border px-2 py-1 font-mono">{{ step.high.toFixed(4) }}</td>
          </tr>
        </tbody>
      </table>

      <p class="mt-4 text-lg font-semibold">
        بازه نهایی:  
        <span class="font-mono text-green-700">
          [{{ finalRange.low.toFixed(5) }}, {{ finalRange.high.toFixed(5) }})
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// تعریف کاراکترها و احتمال‌شان
const probabilities = {
  A: 0.5,
  B: 0.2,
  C: 0.3,
};

// برای هر کاراکتر بازه احتمالات را بسازیم
function buildIntervals(probs) {
  const intervals = {};
  let start = 0;
  for (const char of Object.keys(probs)) {
    const prob = probs[char];
    intervals[char] = { low: start, high: start + prob };
    start += prob;
  }
  return intervals;
}

const intervals = buildIntervals(probabilities);

const inputString = ref("");
const steps = ref([]);
const finalRange = ref({ low: 0, high: 1 });

function encode() {
  const str = inputString.value.toUpperCase();
  let low = 0;
  let high = 1;
  steps.value = [];

  for (const char of str) {
    const range = high - low;
    if (!intervals[char]) {
      alert(`کاراکتر ${char} در جدول احتمالات وجود ندارد!`);
      return;
    }

    const charInterval = intervals[char];
    const newLow = low + range * charInterval.low;
    const newHigh = low + range * charInterval.high;

    steps.value.push({
      char,
      low: newLow,
      high: newHigh,
    });

    low = newLow;
    high = newHigh;
  }

  finalRange.value = { low, high };
}
</script>
