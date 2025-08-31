<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { animate } from '../renderEngine';
import { createInstanceMonitor } from '../renderEngine/instanceMonitor';

const canvas = ref<HTMLCanvasElement | null>(null)
const width = window.innerWidth
const height = window.innerHeight

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = width;
    canvas.value.height = height;
    const ctx = canvas.value.getContext('2d')
    if (!ctx) return;
    const instanceMonitor = createInstanceMonitor();
    instanceMonitor.addShape({
      id: 'rect1',
      x: 100,
      y: 10,
      width: 150,
      height: 100,
      movementVector: { x: 0, y: 1 }
    });
    instanceMonitor.addShape({
      id: 'circle1',
      x: 200,
      y: 320,
      width: 20,
      height: 220,
      movementVector: { x: 0, y: 0 }
    });
    animate(ctx, instanceMonitor);
  }
});


</script>

<template>
  <div>
    <canvas ref="canvas" id="canvas" width="800" height="600"></canvas>
  </div>
</template>

<style scoped>
</style>
