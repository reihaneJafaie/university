<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
      <h1 class="text-2xl font-bold text-indigo-600 mb-6 text-center">فشرده‌سازی LZW رشته به اعداد</h1>

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

      <div v-if="compressed.length" class="mt-6">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">نتیجه فشرده‌سازی (کدهای عددی):</h2>
        <p class="bg-gray-100 p-4 rounded-md text-lg break-words">
          {{ compressed.join(", ") }}
        </p>
      </div>

      <div v-if="Object.keys(dictionary).length" class="mt-6">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">دیکشنری کلمات و کدها:</h2>
        <div class="max-h-48 overflow-auto border border-gray-300 rounded-md bg-gray-50 p-4">
          <table class="w-full table-auto text-gray-800">
            <thead>
              <tr>
                <th class="border px-2 py-1 text-left">کلمه</th>
                <th class="border px-2 py-1 text-left">کد عددی</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(code, word) in dictionary" :key="code">
                <td class="border px-2 py-1 font-mono">{{ word }}</td>
                <td class="border px-2 py-1 font-mono">{{ code }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const input = ref("");
const compressed = ref([]);
const dictionary = ref({});

function compress() {
  compressed.value = [];
  dictionary.value = {};

  // دیکشنری اولیه 256 کاراکتر ASCII
  const dict = {};
  for (let i = 0; i < 256; i++) {
    dict[String.fromCharCode(i)] = i;  // مثلا " " => 32, "A" => 65 و ...
  }
  dictionary.value = { ...dict };

  let dict_size = 256;      // تغییر نام به dict_size به جای dictSize
  let w = "";
  const result = [];

  for (let i = 0; i < input.value.length; i++) {
    const c = input.value.charAt(i);
    const wc = w + c;
    if (dict.hasOwnProperty(wc)) {
      w = wc;
    } else {
      result.push(dict[w]);
      dict[wc] = dict_size++;  // اینجا هم dict_size
      w = c;
    }
  }

  if (w !== "") {
    result.push(dict[w]);
  }

  compressed.value = result;
  dictionary.value = { ...dict };
}
</script>

<style scoped>
/* فونت مونوسپیس برای کلمات داخل جدول */
.font-mono {
  font-family: monospace;
}
</style>
