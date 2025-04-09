<script setup>
import attendoLogo from '@/assets/icons/attendo-logo.svg';
import googleIcon from '@/assets/icons/google-icon.svg';
import { RouterLink } from 'vue-router';
import { Home, CalendarCheck, Info, LogOut } from 'lucide-vue-next';
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
</script>

<template>
  <header
    class="bg-box border border-border rounded-header px-[32px] py-[16px] w-full flex justify-between items-center"
  >
    <div class="flex">
      <img class="h-[23px]" :src="attendoLogo" alt="Attendo logo" />
      <span class="text-h1 text-esi-blue italic">ttendo</span>
    </div>

    <ul class="flex gap-[16px] h-full">
      <li class="h-full">
        <RouterLink
          class="flex gap-[8px] rounded-full bg-box hover:bg-esi-blue px-4 py-3 text-text hover:text-box items-center justify-center w-[130px] h-full"
          :to="'/'"
        >
          <Home class="w-5 h-5" />
          <span class="text-button">Accueil</span>
        </RouterLink>
      </li>

      <li class="h-full">
        <RouterLink
          class="flex gap-[8px] rounded-full bg-box hover:bg-esi-blue px-4 py-3 text-text hover:text-box items-center justify-center w-[130px] h-full"
          :to="'/sessions'"
        >
          <CalendarCheck class="w-5 h-5" />
          <span class="text-button">Sessions</span>
        </RouterLink>
      </li>

      <li class="h-full">
        <RouterLink
          class="flex gap-[8px] rounded-full bg-box hover:bg-esi-blue px-4 py-3 text-text hover:text-box items-center justify-center w-[130px] h-full"
          :to="'/about'"
        >
          <Info class="w-5 h-5" />
          <span class="text-button">À propos</span>
        </RouterLink>
      </li>
    </ul>

    <button
      v-if="!authStore.isAuthenticated"
      @click="handleLogin"
      class="flex gap-[8px] items-center bg-box border border-border rounded-full px-4 py-2 text-text hover:bg-gray-50"
    >
      <img :src="googleIcon" alt="Google icon" class="w-5 h-5" />
      <span class="text-button">Connexion avec Google</span>
    </button>

    <div v-else class="flex items-center gap-2">
      <div class="text-text">
        <span class="font-medium">{{ authStore.user?.user_metadata?.name || authStore.user?.email }}</span>
      </div>
      <button
        @click="handleLogout"
        class="flex gap-[8px] items-center bg-box border border-border rounded-full px-4 py-2 text-text hover:bg-gray-50"
      >
        <LogOut class="w-5 h-5" />
        <span class="text-button">Déconnexion</span>
      </button>
    </div>
  </header>
</template>