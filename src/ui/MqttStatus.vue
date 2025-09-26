<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { mqttService } from '@/lib/mqtt';

/* Estado reactivo: conexión MQTT */
const connected = ref(mqttService.isConnected());

/* Sincroniza el estado con el servicio */
onMounted(() => {
  /* Listener de cambios emitidos por mqttService */
  const off = mqttService.onConnectionChange(state => {
    connected.value = state;
  });

  /* Refresco pasivo cada 4 s por si se pierde el listener */
  const iv = setInterval(() => {
    connected.value = mqttService.isConnected();
  }, 4000);

  onUnmounted(() => {
    off();
    clearInterval(iv);
  });
});
</script>

<template>
  <div
    class="
      flex items-center gap-1.5
      px-2 py-0.5 rounded-full
      bg-white/50 backdrop-blur-xl
      border border-white/30
      text-[10px] font-semibold
    "
  >
    <Icon
      :icon="connected ? 'mdi:wifi-strength-2' : 'mdi:wifi-strength-off-outline'"
      :class="[
        'w-3.5 h-3.5',
        connected ? 'text-cyan-500 subtle-neon' : 'text-red-500 subtle-pulse',
      ]"
    />
    <span :class="connected ? 'text-cyan-700' : 'text-red-600'">
      MQTT{{ connected ? 'Online' : 'Off' }}
    </span>
  </div>
</template>
