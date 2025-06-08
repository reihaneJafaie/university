<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl">
      <h1 class="text-2xl font-bold mb-4 text-center text-indigo-600">الگوریتم LZ78</h1>

      <!-- ورودی متن -->
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

      <!-- خروجی کدهای فشرده -->
      <div v-if="output.length" class="mt-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">نتیجه فشرده‌سازی (کدها):</h2>
        <pre class="bg-gray-100 p-3 rounded-md text-sm break-words whitespace-pre-wrap">
          <span v-for="(code, idx) in output" :key="idx">
            ({{ code.index }}, "{{ code.char }}")&nbsp;
          </span>
        </pre>
      </div>

      <!-- نمایش دیکشنری -->
      <div v-if="dictionary.length" class="mt-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">دیکشنری (واژه‌ها):</h2>
        <ul class="bg-gray-100 p-3 rounded-md text-sm max-h-40 overflow-auto">
          <li v-for="(word, idx) in dictionary" :key="idx" class="mb-1">
            {{ idx + 1 }} : "{{ word }}"
          </li>
        </ul>
      </div>

      <!-- نمایش درخت -->
      <div v-if="tree.children.length" class="mt-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">نمای درختی دیکشنری:</h2>
        <TreeNode :node="tree" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const input = ref('')
const output = ref([])
const dictionary = ref([])

const compress = () => {
  const text = input.value.trim()
  if (!text) {
    output.value = []
    dictionary.value = []
    return
  }

  const dict = ['']
  const codes = []
  let current = ''

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const temp = current + char
    const index = dict.indexOf(temp)
    if (index !== -1) {
      current = temp
    } else {
      const prevIndex = dict.indexOf(current)
      codes.push({ index: prevIndex, char })
      dict.push(temp)
      current = ''
    }
  }

  if (current !== '') {
    const prevIndex = dict.indexOf(current)
    codes.push({ index: prevIndex, char: '' })
  }

  output.value = codes
  dictionary.value = dict.slice(1)
}

const buildTree = () => {
  const root = { label: '', children: [] }
  dictionary.value.forEach((word) => {
    let node = root
    for (const char of word) {
      let child = node.children.find(c => c.label === char)
      if (!child) {
        child = { label: char, children: [] }
        node.children.push(child)
      }
      node = child
    }
  })
  return root
}

const tree = computed(() => buildTree())
</script>

<!-- درخت بازگشتی -->
<script>
export default {
  components: {
    TreeNode: {
      name: 'TreeNode',
      props: ['node'],
      template: `
        <ul class="pl-4 border-l border-gray-300">
          <li>
            <span class="text-indigo-600 font-medium">{{ node.label }}</span>
            <TreeNode
              v-for="(child, index) in node.children"
              :key="index"
              :node="child"
            />
          </li>
        </ul>
      `,
      components: {
        TreeNode: null // برای بازگشتی بودن، بعداً مقداردهی می‌شود
      },
      created() {
        this.$options.components.TreeNode = this.$options
      }
    }
  }
}
</script>
