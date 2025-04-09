<script setup>
import MenuBar from '@/components/MenuBar.vue'
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initialize();
});

const welcomeMessage = () => {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 18) {
    return "Bonjour";
  } else if (hour >= 18 && hour < 22) {
    return "Bonsoir";
  } else {
    return "Bonne nuit";
  }
}
</script>

<template>
  <div class="flex flex-col flex-grow gap-4 p-[16px] bg-background items-center justify-center w-full h-full">
    <MenuBar />

    <main class="flex flex-col flex-grow gap-2 p-4 bg-background items-center justify-center w-full h-full">
      <template v-if="!authStore.isAuthenticated">
        <h1 class="text-h1 text-text mb-4">Bienvenue sur <span class="text-h1 text-esi-blue italic">Attendo</span></h1>
        <p class="text-text mb-6">Veuillez vous connecter pour accéder à plus de contenu !</p>
      </template>
  
      <template v-else>
        <h1 class="text-h1 text-text mb-4">{{ welcomeMessage() }}, <span class="text-h1 text-esi-blue italic">{{ authStore.user?.user_metadata?.name || authStore.user?.email }}</span> !</h1>
      </template>
    </main>
  </div>
</template>
