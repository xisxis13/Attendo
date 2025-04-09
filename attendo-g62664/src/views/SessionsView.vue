<script setup>
import MenuBar from '@/components/MenuBar.vue'
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'home', query: { authRequired: 'true' } })
  }
})
</script>

<template>
  <div class="flex flex-col flex-grow gap-4 p-[16px] bg-background items-center w-full h-full">
    <MenuBar />

    <main class="flex flex-col flex-grow gap-2 p-4 bg-background items-center justify-center w-full h-full">
      <h1 class="text-h1 text-text mb-4">Sessions</h1>
      <p class="text-light-text mb-6">Liste des sessions disponibles</p>
      
      <!-- Contenu des sessions ici -->
    </main>
  </div>
</template>
