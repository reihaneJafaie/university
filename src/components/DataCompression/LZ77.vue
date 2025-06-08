<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
      <h1 class="text-2xl font-bold text-indigo-600 mb-6 text-center">الگوریتم فشرده‌سازی LZ77 </h1>

      <textarea
        v-model="input"
        placeholder="متن خود را اینجا وارد کنید..."
        class="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
      ></textarea>

      <button
        @click="compress"
        class="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
      >
        فشرده کن
      </button>

      <div v-if="output.length" class="mt-6">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">نتیجه فشرده‌سازی:</h2>
        <p class="bg-gray-100 p-4 rounded-md text-lg break-words" style="white-space: pre-wrap;">
          <template v-for="(item, idx) in output" :key="idx">
            <template v-if="typeof item === 'string'">
              {{ item.replace(/ /g, '_') }}
            </template>
            <template v-else>
              <span class="text-indigo-600 font-mono">&lt;{{ item.offset }},{{ item.length }}&gt;</span>
            </template>
            <span> </span>
          </template>
        </p>
      </div>

      <div v-if="output.some(i => typeof i !== 'string')" class="mt-6">
        <h2 class="text-lg font-semibold mb-2 text-gray-700">جزئیات (offset, length):</h2>
        <table class="w-full border border-gray-300 rounded text-center">
          <thead class="bg-indigo-100">
            <tr>
              <th class="border border-gray-300 px-3 py-2">مرحله</th>
              <th class="border border-gray-300 px-3 py-2">offset</th>
              <th class="border border-gray-300 px-3 py-2">length</th>
              <th class="border border-gray-300 px-3 py-2">توضیح</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in output" :key="'details-' + idx" v-if="typeof item !== 'string'">
              <td class="border border-gray-300 px-3 py-2">{{ idx + 1 }}</td>
              <td class="border border-gray-300 px-3 py-2">{{ item.offset }}</td>
              <td class="border border-gray-300 px-3 py-2">{{ item.length }}</td>
              <td class="border border-gray-300 px-3 py-2">
                {{ item.length }} کاراکتر تکراری، {{ item.offset }} فاصله عقب
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// متغیر واکنش‌گرا برای نگهداری متن ورودی
const input = ref('')

// متغیر واکنش‌گرا برای نگهداری خروجی فشرده‌سازی (آرایه‌ای از رشته‌ها و آبجکت‌های offset/length)
const output = ref([])

/**
 * تابع فشرده‌سازی متن با الگوریتم ساده LZ77
 * - ورودی: متن رشته‌ای که کاربر وارد کرده
 * - خروجی: آرایه‌ای شامل رشته‌ها و آبجکت‌هایی با مشخصات offset و length
 */
function compress() {
  const text = input.value

  // اگر متن ورودی خالی باشد خروجی را پاک کن
  if (!text) {
    output.value = []
    return
  }

  const windowSize = 50 // اندازه پنجره جستجو برای تطابق‌های قبلی (تعداد کاراکترهایی که عقب نگاه می‌کنیم)
  let pos = 0 // موقعیت فعلی در متن ورودی
  const result = [] // آرایه برای ذخیره نتایج فشرده‌سازی

  // تا زمانی که به انتهای متن نرسیده‌ایم ادامه بده
  while (pos < text.length) {
    // تعیین محدوده پنجره (از pos-50 تا pos)
    const startWindow = Math.max(0, pos - windowSize)
    // بخش پنجره (متن قبلی که می‌خواهیم تطابق را در آن جستجو کنیم)
    const window = text.substring(startWindow, pos)

    // متغیرها برای نگهداری بهترین تطابق (بیشترین طول و offset آن)
    let maxLength = 0
    let maxOffset = 0

    // جستجو از بیشترین طول ممکن تا 2 (چون طول 1 را به عنوان تطابق نمی‌گیریم)
    for (let length = Math.min(windowSize, text.length - pos); length > 1; length--) {
      // زیررشته‌ای که می‌خواهیم دنبال تطابقش بگردیم
      const sub = text.substring(pos, pos + length)
      // جستجوی این زیررشته در پنجره
      const idx = window.indexOf(sub)
      if (idx !== -1) {
        // اگر یافت شد، طول و offset را ذخیره کن و از حلقه بیرون بیا
        maxLength = length
        maxOffset = pos - (startWindow + idx)
        break
      }
    }

    if (maxLength > 1) {
      // اگر تطابقی با طول بیشتر از 1 پیدا شد، یک شیء حاوی offset و length اضافه کن
      result.push({ offset: maxOffset, length: maxLength })
      // موقعیت را به اندازه طول تطابق پیش ببر
      pos += maxLength
    } else {
      // اگر تطابق پیدا نشد (یا طول تطابق 1 بود)، کاراکتر فعلی را مستقیم اضافه کن
      result.push(text[pos])
      pos++
    }
  }

  // مرحله ترکیب رشته‌های متوالی برای جلوگیری از بخش‌های بسیار کوچک و پراکنده
  const mergedResult = []
  let buffer = ''

  for (const item of result) {
    if (typeof item === 'string') {
      // اگر آیتم رشته است، در بافر جمع کن
      buffer += item
    } else {
      // اگر آیتم آبجکت offset/length است، ابتدا بافر را به خروجی اضافه کن (اگر خالی نبود)
      if (buffer.length > 0) {
        mergedResult.push(buffer)
        buffer = ''
      }
      // سپس آیتم offset/length را اضافه کن
      mergedResult.push(item)
    }
  }
  // اگر بعد از تمام شدن حلقه بافر رشته‌ای باقی ماند، آن را هم اضافه کن
  if (buffer.length > 0) mergedResult.push(buffer)

  // ذخیره خروجی نهایی در متغیر واکنش‌گرا برای نمایش در UI
  output.value = mergedResult
}
</script>
