<template>
  <div class="p-6 max-w-xl mx-auto bg-white rounded-xl shadow space-y-4">
    <h2 class="text-xl font-bold text-indigo-600">پیمایش پیش‌نوندی (Preorder Traversal)</h2>

    <button @click="startPreorder"
            class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition">
      پیمایش کن
    </button>

    <div class="text-gray-800">
      <p class="mt-4 font-semibold">نتیجه پیمایش:</p>
      <div class="mt-2 p-2 bg-gray-100 rounded-md">
        {{ result.join(' → ') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// درخت دودویی نمونه
const tree = ref({
  label: 'A',
  left: {
    label: 'B',
    left: {
      label: 'D',
      left: null,
      right: null
    },
    right: {
      label: 'E',
      left: null,
      right: null
    }
  },
  right: {
    label: 'C',
    left: {
      label: 'F',
      left: null,
      right: null
    },
    right: {
      label: 'G',
      left: null,
      right: null
    }
  }
})

const result = ref([])

const preorder = (node) => {
  if (!node) return
  result.value.push(node.label)
  preorder(node.left)
  preorder(node.right)
}

const startPreorder = () => {
  result.value = []
  preorder(tree.value)
}
</script>