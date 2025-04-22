<script>
import attendoLogo from '@/assets/icons/attendo-logo.svg';
import googleIcon from '@/assets/icons/google-icon.svg';
import { RouterLink } from 'vue-router';
import { Home, CalendarCheck, Info, LogOut, Moon, Sun } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';

export default {
  components: {
    RouterLink,
    Home,
    CalendarCheck,
    Info,
    LogOut,
    Moon,
    Sun,
  },
  data() {
    return {
      googleIcon,
      attendoLogo,
      isDarkMode: false,
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
  },
  mounted() {
    this.authStore.initialize();
    this.isDarkMode = document.documentElement.classList.contains('dark');
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    handleLogin() {
      this.authStore.signInWithGoogle();
    },
    handleLogout() {
      this.authStore.signOut();
    },
  },
};
</script>

<template>
  <header class="bg-box border border-border rounded-header px-8 py-4 w-full flex justify-between items-center dark:bg-dark-box dark:border-dark-border">
    <div class="flex items-center">
      <img class="h-6" :src="attendoLogo" alt="Attendo logo" />
      <span class="text-h1 text-esi-blue italic">ttendo</span>
    </div>

    <ul class="flex gap-4 h-full">
      <li class="h-full">
        <RouterLink
          class="flex gap-2 rounded-full bg-box hover:bg-esi-blue dark:hover:bg-esi-blue px-4 py-3 text-text hover:text-box items-center justify-center w-[130px] h-full dark:bg-dark-box dark:text-dark-text dark:hover:text-white"
          :to="'/'"
        >
          <Home class="w-5 h-5" />
          <span class="text-button">Accueil</span>
        </RouterLink>
      </li>

      <li class="h-full">
        <RouterLink
          class="flex gap-2 rounded-full bg-box hover:bg-esi-blue dark:hover:bg-esi-blue px-4 py-3 text-text hover:text-box items-center justify-center w-[130px] h-full dark:bg-dark-box dark:text-dark-text dark:hover:text-white"
          :to="'/sessions'"
        >
          <CalendarCheck class="w-5 h-5" />
          <span class="text-button">Sessions</span>
        </RouterLink>
      </li>

      <li class="h-full">
        <RouterLink
          class="flex gap-2 rounded-full bg-box hover:bg-esi-blue dark:hover:bg-esi-blue px-4 py-3 text-text hover:text-box items-center justify-center w-[130px] h-full dark:bg-dark-box dark:text-dark-text dark:hover:text-white"
          :to="'/about'"
        >
          <Info class="w-5 h-5" />
          <span class="text-button">À propos</span>
        </RouterLink>
      </li>
    </ul>

    
    <div class="flex items-center gap-2">
      <button
        v-if="!authStore.isAuthenticated"
        @click="handleLogin"
        class="flex gap-2 items-center bg-box dark:bg-dark-box border border-border dark:border-dark-border rounded-full px-4 py-2 text-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <img :src="googleIcon" alt="Google icon" class="w-5 h-5" />
        <span class="text-button">Connexion avec Google</span>
      </button>

      <div class="text-text dark:text-dark-text">
        <span class="font-medium">{{ authStore.user?.user_metadata?.name || authStore.user?.email }}</span>
      </div>
      
      <button
        v-if="authStore.isAuthenticated"
        @click="handleLogout"
        class="flex gap-2 items-center bg-box dark:bg-dark-box border border-border dark:border-dark-border rounded-full p-2 text-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <LogOut class="w-5 h-5" />
      </button>

      <button
        @click="toggleDarkMode"
        class="flex gap-2 items-center bg-box border border-border rounded-full p-2 text-text hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-dark-box dark:border-dark-border dark:text-dark-text"
      >
        <template v-if="isDarkMode">
          <Sun class="w-5 h-5" />
          <!-- <span class="text-button">Mode clair</span> -->
        </template>
        <template v-else>
          <Moon class="w-5 h-5" />
          <!-- <span class="text-button">Mode sombre</span> -->
        </template>
      </button>
    </div>
  </header>
</template>