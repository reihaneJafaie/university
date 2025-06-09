<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4 text-center">درخت هافمن تطبیق‌پذیر (Adaptive Huffman)</h1>
    
    <textarea
      v-model="inputText"
      @input="onInput"
      placeholder="متن را وارد کنید..."
      class="w-full p-3 border border-gray-300 rounded-md mb-6 font-mono h-32 resize-none"
      spellcheck="false"
    ></textarea>

    <h2 class="text-lg font-semibold mb-2">ساختار درخت فعلی:</h2>
    <pre class="bg-gray-100 p-4 rounded-md whitespace-pre-wrap font-mono text-sm max-h-96 overflow-auto">{{ renderTree(root) }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// کلاس گره درخت هافمن تطبیق‌پذیر
class Node {
  constructor(symbol = null, weight = 0, isNYT = false) {
    this.symbol = symbol    // حرف یا null
    this.weight = weight    // وزن گره
    this.isNYT = isNYT      // آیا NYT است
    this.left = null        // فرزند چپ
    this.right = null       // فرزند راست
    this.parent = null      // والد
  }
}

const inputText = ref('')
const root = ref(new Node(null, 0, true))  // شروع با گره NYT
let NYT = root.value                         // مرجع به گره NYT
const nodes = new Map()                      // نگهداری کاراکترها به گره‌ها

// افزودن کاراکتر به درخت
function addSymbol(ch) {
  if (nodes.has(ch)) {
    // اگر قبلا بود، وزن را افزایش بده و بروز رسانی کن
    updateWeights(nodes.get(ch))
  } else {
    // ساخت گره‌های جدید برای کاراکتر جدید
    const newNYT = new Node(null, 0, true)
    const newNode = new Node(ch, 1)
    const internal = new Node(null, 1)

    internal.left = newNYT
    internal.right = newNode
    newNYT.parent = internal
    newNode.parent = internal

    if (NYT.parent) {
      if (NYT.parent.left === NYT) {
        NYT.parent.left = internal
      } else {
        NYT.parent.right = internal
      }
      internal.parent = NYT.parent
    } else {
      root.value = internal
      internal.parent = null
    }

    NYT = newNYT
    nodes.set(ch, newNode)
    updateWeights(internal.parent)
  }
}

// افزایش وزن و بروزرسانی از گره به سمت ریشه
function updateWeights(node) {
  while (node) {
    node.weight++
    node = node.parent
  }
}

// پاکسازی و بازسازی درخت برای متن جدید
function onInput() {
  root.value = new Node(null, 0, true)
  NYT = root.value
  nodes.clear()

  for (const ch of inputText.value) {
    addSymbol(ch)
  }
}

// نمایش درخت به صورت متن
function renderTree(node, indent = '') {
  if (!node) return ''
  const label = node.isNYT
    ? 'NYT'
    : node.symbol
    ? `"${node.symbol}" (${node.weight})`
    : `● (${node.weight})`
  let out = `${indent}${label}\n`
  out += renderTree(node.left, indent + '  ')
  out += renderTree(node.right, indent + '  ')
  return out
}
</script>

<style scoped>
textarea {
  direction: ltr;
}
</style>
