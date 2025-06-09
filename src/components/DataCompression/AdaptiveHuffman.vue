<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-center mb-4">کدگذاری هافمن تطبیق‌پذیر</h1>

    <textarea
      v-model="text"
      class="w-full h-32 p-3 border border-gray-300 rounded-md mb-4"
      placeholder="متن مورد نظر را وارد کنید..."
    ></textarea>

    <button @click="run" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
      فشرده‌سازی
    </button>

    <div v-if="result.length" class="mt-6">
      <h2 class="text-lg font-semibold mb-2">نتیجه کلی</h2>
      <table class="w-full table-auto border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2">کاراکتر</th>
            <th class="border px-4 py-2">کد دودویی</th>
            <th class="border px-4 py-2">وزن</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in result" :key="i">
            <td class="border px-4 py-2 text-center">{{ item.char }}</td>
            <td class="border px-4 py-2 text-center font-mono">{{ item.code }}</td>
            <td class="border px-4 py-2 text-center">{{ item.weight }}</td>
          </tr>
        </tbody>
      </table>

      <div class="mt-4">
        <h3 class="font-semibold mb-2">رشته فشرده‌شده:</h3>
        <div class="bg-gray-100 p-3 rounded-md text-sm font-mono break-words">
          {{ compressed }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

class Node {
  constructor(symbol = null, weight = 0, parent = null, isNYT = false) {
    this.symbol = symbol
    this.weight = weight
    this.parent = parent
    this.left = null
    this.right = null
    this.isNYT = isNYT
  }

  isLeaf() {
    return !this.left && !this.right
  }
}

class AdaptiveHuffman {
  constructor() {
    this.root = new Node(null, 0, null, true)
    this.NYT = this.root
    this.nodes = {} // symbol => node
  }

  getCode(node) {
    let code = ''
    while (node && node.parent) {
      code = (node.parent.left === node ? '0' : '1') + code
      node = node.parent
    }
    return code
  }

  findNode(symbol) {
    return this.nodes[symbol]
  }

  updateTree(node) {
    while (node) {
      node.weight += 1
      node = node.parent
    }
  }

  insert(symbol) {
    const existingNode = this.findNode(symbol)
    if (existingNode) {
      const code = this.getCode(existingNode)
      this.updateTree(existingNode)
      return { code, node: existingNode }
    }

    const nytNode = this.NYT
    const internal = new Node(null, 0, nytNode.parent)
    const symbolNode = new Node(symbol, 0, internal)
    const newNYT = new Node(null, 0, internal, true)

    internal.left = newNYT
    internal.right = symbolNode

    if (!nytNode.parent) {
      this.root = internal
    } else {
      if (nytNode.parent.left === nytNode) {
        nytNode.parent.left = internal
      } else {
        nytNode.parent.right = internal
      }
    }

    this.NYT = newNYT
    this.nodes[symbol] = symbolNode

    this.updateTree(symbolNode)

    const code = this.getCode(internal) + symbol.charCodeAt(0).toString(2).padStart(8, '0')
    return { code, node: symbolNode }
  }
}

const text = ref('')
const result = ref([])
const compressed = ref('')

function run() {
  const huffman = new AdaptiveHuffman()
  const tempResult = []
  let output = ''

  for (const char of text.value) {
    const { code, node } = huffman.insert(char)
    output += code
    const existing = tempResult.find(r => r.char === char)
    if (existing) {
      existing.code = code
      existing.weight = node.weight
    } else {
      tempResult.push({
        char,
        code,
        weight: node.weight
      })
    }
  }

  result.value = tempResult
  compressed.value = output
}
</script>
