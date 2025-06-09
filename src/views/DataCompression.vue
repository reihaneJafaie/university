<template>
  <section class="container mx-auto p-4 md:p-6 min-h-screen bg-secondary flex flex-col md:flex-row gap-4 md:gap-6">
    <!-- ستون خروجی (چپ) -->
    <div class="flex-1 bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow min-h-[300px]">
      <component :is="currentComponent" />
    </div>

    <!-- ستون لیست الگوریتم‌ها (راست) -->
    <div class="w-full md:w-[20%] bg-gray-50 rounded-lg border border-gray-200 shadow p-4">
      <h2 class="text-xl font-bold mb-4 text-right">الگوریتم‌ها</h2>
      <ul class="flex flex-col gap-3 text-right">
        <li
          v-for="(algo, index) in algorithms"
          :key="index"
          @click="selected = algo.name"
          :class="[
            'cursor-pointer p-2 rounded',
            selected === algo.name ? 'bg-primary text-white font-semibold' : 'hover:bg-primary/20'
          ]"
        >
          {{ algo.name }}
        </li>
      </ul>
    </div>
  </section>
</template>


<script setup>
import { ref, computed } from 'vue'

// // ایمپورت کامپوننت‌های خروجی هر الگوریتم
import AdaptiveCompressionAlgorithm from '../components/DataCompression/AdaptiveCompressionAlgorithm.vue'
import DictionaryBasedEncoding from '../components/DataCompression/DictionaryBasedEncoding.vue'
import LZ77 from '../components/DataCompression/LZ77.vue'
import LZ78 from '../components/DataCompression/LZ78.vue'
import LZW from '../components/DataCompression/LZW.vue'
import ArithmeticCoding from '../components/DataCompression/ArithmeticCoding.vue'
import preorder from '../components/DataCompression/preorder.vue'
import DecoderPreorder from '../components/DataCompression/DecoderPreorder.vue'
import ShannonFano from '../components/DataCompression/ShannonFano.vue'
import Huffman from '../components/DataCompression/Huffman.vue'
import AdaptiveHuffman from '../components/DataCompression/AdaptiveHuffman.vue'
import UpdateTreeHuffman from '../components/DataCompression/UpdateTreeHuffman.vue'

// import LZWOutput from './outputs/LZWOutput.vue'
// import RLEOutput from './outputs/RLEOutput.vue'
// import BWTOutput from './outputs/BWTOutput.vue'

// لیست الگوریتم‌ها و کامپوننت خروجی‌شان
const algorithms = [
  { name: 'الگوریتم فشرده‌ساز تطبیق‌پذیر', component: AdaptiveCompressionAlgorithm },
  { name: 'رمزگذاری مبتنی بر دیکشنری', component: DictionaryBasedEncoding },
  { name: 'LZ77', component: LZ77 },
   { name: 'LZ78', component: LZ78 },
   { name: 'LZW', component: LZW },
   { name: 'ArithmeticCoding', component: ArithmeticCoding },
   { name: 'preorder', component: preorder },
  { name: 'DecoderPreorder', component: DecoderPreorder },
  { name: 'ShannonFano', component: ShannonFano },
  { name: 'Huffman', component: Huffman },
  { name: 'AdaptiveHuffman', component: AdaptiveHuffman },
  { name: 'UpdateTreeHuffman', component: UpdateTreeHuffman },

 
]

const selected = ref(algorithms[0].name)

const currentComponent = computed(() => {
  const algo = algorithms.find(a => a.name === selected.value)
  return algo ? algo.component : null
})
</script>

<style scoped>
.bg-primary {
  background-color: #2563eb; /* رنگ آبی پررنگ - بر اساس قانون 60 */
}
</style>
