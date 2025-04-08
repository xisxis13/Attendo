<script>
import logoImg from '@/assets/icons/logo.svg';
import googleIcon from '@/assets/icons/google-icon.svg';
import { RouterLink } from 'vue-router';
import { Home, CalendarCheck, Info } from 'lucide-vue-next';

export default {
  components: {
    RouterLink,
    Home,
    CalendarCheck,
    Info,
  },
  data() {
    return {
      logoImg,
      googleIcon,
    };
  },
};
</script>

<template>
  <header
    class="bg-box border border-border rounded-header px-[32px] py-[24px] w-full flex justify-between items-center"
  >

  <img class="h-[44px]" :src="logoImg" alt="Attendo logo" />

    <ul class="flex gap-[16px] h-full">
      <li class="h-full">
        <RouterLink
          class="flex gap-[8px] rounded-full bg-esi-blue px-4 py-2 text-white items-center justify-center w-[150px] h-full"
          :to="'/'"
        >
          <Home class="w-5 h-5" />
          <span>Accueil</span>
        </RouterLink>
      </li>

      <li class="h-full">
        <RouterLink
          class="flex gap-[8px] rounded-full bg-esi-blue px-4 py-2 text-white items-center justify-center w-[150px] h-full"
          :to="'/sessions'"
        >
          <CalendarCheck class="w-5 h-5" />
          <span>Sessions</span>
        </RouterLink>
      </li>

      <li class="h-full">
        <RouterLink
          class="flex gap-[8px] rounded-full bg-esi-blue px-4 py-2 text-white items-center justify-center w-[150px] h-full"
          :to="'/about'"
        >
          <Info class="w-5 h-5" />
          <span>À propos</span>
        </RouterLink>
      </li>
    </ul>

    <button
      class="flex gap-[8px] items-center bg-box border border-border rounded-full px-4 py-2 text-text hover:bg-gray-50"
    >
      <img :src="googleIcon" alt="Google icon" class="w-5 h-5" />
      <span>Connexion avec Google</span>
    </button>
  </header>
</template>
