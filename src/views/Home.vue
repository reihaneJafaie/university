<template>
  <section class="container mx-auto bg-secondary min-h-screen py-10 px-4">
    <h1 class="text-3xl font-bold text-primary mb-8 text-center">درس‌های من</h1>
    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <router-link
      :to="course.route"
        v-for="(course, index) in courses"
        :key="index"
        @click="goTo(course.route)"
        class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition cursor-pointer hover:ring-2 hover:ring-accent"
      >
   
        <h2 class="text-xl font-semibold text-primary mb-2">{{ course.name }}</h2>
        <p class="text-sm text-gray-600">{{ course.code }}</p>
      </router-link>
    </div>
  </section>
</template>

<script setup>
const courses = [
  { name: 'فشرده‌سازی داده‌ها', code: 'CS402' , route: '/data-compression' },
  { name: 'نظریه محاسبات', code: 'CS305', route: '/' },
  { name: 'برنامه‌سازی پیشرفته', code: 'CS202' , route: '/'},
  { name: 'ساختمان داده', code: 'CS201' , route: '/'},
  { name: 'پایگاه داده', code: 'CS303', route: '/' },
  { name: 'معماری کامپیوتر', code: 'CS204' , route: '/'},
  { name: 'سیستم عامل', code: 'CS304', route: '/' },
  { name: 'شبکه‌های کامپیوتری', code: 'CS401', route: '/' },
]
</script>

<style scoped>
/* انتخابی برای فونت فارسی اگر بخوای */
</style>
