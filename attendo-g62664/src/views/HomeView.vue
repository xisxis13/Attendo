<script setup>
import MenuBar from '@/components/MenuBar.vue'
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initialize();
});

const handleLogin = () => {
  authStore.signInWithGoogle();
};

const handleLogout = () => {
  authStore.signOut();
};

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
  <div class="flex flex-col flex-grow gap-2 p-[16px] bg-background items-center justify-center w-full h-full">
    <MenuBar />

    <main class="flex flex-col flex-grow gap-2 p-4 bg-background items-center justify-center w-full h-full">
      <template v-if="!authStore.isAuthenticated">
        <h1 class="text-h1 text-text mb-4">Bienvenue sur <span class="text-h1 text-esi-blue italic">Attendo</span></h1>
        <p class="text-text mb-6">Veuillez vous connecter pour accéder à plus de contenu !</p>
      </template>
  
      <template v-else>
        <h1 class="text-h1 text-text mb-4">{{ welcomeMessage() }}, <span class="text-h1 text-esi-blue italic">{{ authStore.user?.user_metadata?.name || authStore.user?.email }}</span> !</h1>
      </template>
      <!-- <div class="bg-box p-6 rounded-button border border-border max-w-xl w-full">
        <h1 class="text-h1 text-text mb-4">Bienvenue sur Attendo</h1>
        <p class="text-light-text mb-6">Veuillez vous connecter pour accéder à plus de contenu !</p>
        
        <button
          v-if="!authStore.isAuthenticated"
          @click="handleLogin"
          class="flex gap-[8px] items-center bg-esi-blue text-white rounded-button px-4 py-2 hover:bg-opacity-90"
        >
          <img :src="googleIcon" alt="Google icon" class="w-5 h-5" />
          <span class="text-button">Connexion avec Google</span>
        </button>
      </div> -->
    </main>
  
    <!-- <main class="flex flex-col gap-2 w-full h-screen bg-esi-blue">
      <template v-if="!authStore.isAuthenticated">
        <span>Bienvenue, veuillez vous connecter pour plus de contenu !</span>
        
        <span>Utiliser le bouton en haut pour vous connecter</span>
      </template>
  
      <template v-else>
        <span class="font-medium">Bonjour, {{ authStore.user?.user_metadata?.name || authStore.user?.email }} !</span>
      </template>
    </main> -->
  </div>
</template>
