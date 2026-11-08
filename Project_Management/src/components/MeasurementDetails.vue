<script setup lang="ts">
defineProps<{ formulas: readonly string[] }>();
</script>

<template>
  <div class="bg-indigo-50 p-4 rounded-xl border-l-4 border-indigo-600 mb-6 shadow-sm">
    <p class="font-bold text-indigo-700 flex items-center">🎯 KPI (Key Performance Indicator)</p>
    <p class="text-[11px] font-semibold text-indigo-600 italic">Indicador Clave de Desempeño</p>
    <p class="text-[10px] mt-1 text-slate-600">
      Métrica cuantificable que evalúa el progreso hacia los objetivos operativos.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div class="bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm">
      <p class="font-bold text-blue-700 flex items-center">🚀 SPI</p>
      <p class="text-[11px] font-semibold text-blue-600 italic">Schedule Performance Index</p>
      <p class="text-[10px] mt-1 text-slate-600">
        Índice de desempeño del tiempo. Valores mayores a 1 indican adelanto.
      </p>
    </div>
    <div class="bg-emerald-50 p-3 rounded-lg border border-emerald-200 shadow-sm">
      <p class="font-bold text-emerald-700 flex items-center">💰 CPI</p>
      <p class="text-[11px] font-semibold text-emerald-600 italic">Cost Performance Index</p>
      <p class="text-[10px] mt-1 text-slate-600">
        Índice de desempeño del costo. Valores mayores a 1 indican ahorro.
      </p>
    </div>
  </div>

  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 text-xs leading-relaxed">
    <h4 class="font-bold text-slate-800 text-sm mb-2 uppercase tracking-wide">Fórmulas y Tipos</h4>
    <ul class="infographic-list">
      <li v-for="formula in formulas" :key="formula">{{ formula }}</li>
    </ul>
  </div>
</template>
