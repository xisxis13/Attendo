<script>
import { listSessionsService } from '@/services/listSessionsService';
import MenuBar from '@/components/MenuBar.vue'
import Breadcrumb from '@/components/Breadcrumb.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export default {
  components: {
    MenuBar,
    Breadcrumb,
  },
  data() {
    return {
      authStore: useAuthStore(),
      router: useRouter(),
      sessions: [],
    };
  },
  async mounted() {
    if (!authStore.isAuthenticated) {
      this.router.push({ name: 'home', query: { authRequired: 'true' } })
    }

    this.sessions = await listSessionsService.getAllSessions();
  },
  methods: {
    async deleteSession(sessionId) {
      const success = await listSessionsService.deleteSession(sessionId);

      if (success) {
        this.sessions = this.sessions.filter((s) => s.id !== sessionId);
      }
    },
  },
};
</script>

<template>
  <div class="flex flex-col flex-grow gap-4 p-[16px] bg-background items-center w-full h-full">
    <MenuBar />

    <main class="flex flex-col flex-grow gap-8 p-4 bg-background items-start justify-left w-full h-full">
      <div class="flex flex-col gap-1">
        <h1 class="text-h1 text-text mb-4">Sessions</h1>
        <Breadcrumb />
      </div>
      
      <div class="flex flex-col gap-2">
        <span class="text-input-title">Ajouter une session</span>
        <div class="flex items-center gap-2 h-fit">
          <input placeholder="ex. : mai-juin-2025" type="text" name="session" id="newSession" class="border border-border rounded-button py-2 px-3 text-button text-text">
          <button class="bg-esi-blue text-button text-background py-2 px-3 rounded-button cursor-not-allowed">Ajouter</button>
        </div>
      </div>
      
      <template v-if="sessions.length > 0">
        <h3>There is {{ sessions.length }} sessions in the database</h3>
      </template>

      <template v-else>
        <h3>No session in the database</h3>
      </template>
    </main>
  </div>
</template>
