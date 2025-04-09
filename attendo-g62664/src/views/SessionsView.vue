<script>
import { listSessionsService } from '@/services/listSessionsService';
import MenuBar from '@/components/MenuBar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import ObjectTable from '@/components/ObjectTable.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export default {
  components: {
    MenuBar,
    Breadcrumb,
    ObjectTable,
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    return { authStore, router };
  },
  data() {
    return {
      sessions: [],
      newSessionName: null,
    };
  },
  async mounted() {
    if (!this.authStore.isAuthenticated) {
      this.router.push({ name: 'accueil', query: { authRequired: 'true' } });
      return;
    }
    this.sessions = await listSessionsService.getAllSessions();
  },
  methods: {
    async createSession() {
      const success = await listSessionsService.createSession(this.newSessionName);
      if (success !== null) {
        this.sessions.push(success);
        this.newSessionName = null;
      }
    },
    async deleteSession(sessionId) {
      const success = await listSessionsService.deleteSession(sessionId);
      if (success) {
        this.sessions = this.sessions.filter((s) => s.id !== sessionId);
      }
      return success;
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
        <form @submit.prevent="createSession" class="flex items-center gap-2 h-fit">
          <input
            v-model="newSessionName"
            placeholder="ex. : mai-juin-2025"
            type="text"
            name="session"
            id="newSession"
            class="border border-border rounded-button py-2 px-3 text-button text-text"
          />
          <button type="submit" class="bg-esi-blue text-button text-background py-2 px-3 rounded-button">
            Ajouter
          </button>
        </form>
      </div>

      <ObjectTable
        title="Sessions"
        :object-list="sessions"
        :columns="[{ key: 'label', label: 'Sessions', linkable: true }]"
        link-to="/sessions/:id"
        :on-delete="deleteSession"
        :is-sessions="true"
        @update:objectList="sessions = $event"
      />
    </main>
  </div>
</template>