<script>
import MenuBar from '@/components/MenuBar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useEventsStore } from '@/stores/event';
import { useSessionsStore } from '@/stores/sessions';
import { computed, onMounted } from 'vue';

export default {
  components: {
    MenuBar,
    Breadcrumb,
  },
  setup() {
    const authStore = useAuthStore();
    const eventStore = useEventsStore();
    const sessionsStore = useSessionsStore();

    const route = useRoute();
    const router = useRouter();

    const eventId = route.params.eventId;
    const sessionId = route.params.sessionId;
    const ueId = route.params.ueId;

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        router.push({ name: 'accueil', query: { authRequired: 'true' } });
        return;
      }

      // Fetch event details
      await eventStore.getEventById(eventId);
    });

    return {
      authStore,
      sessionName: computed(() => sessionsStore.currentSession?.label || 'Chargement...'),
      eventName: computed(() => eventStore.currentEvent?.label || 'Chargement...'), // Ensure `currentEvent` is populated
      eventId,
      sessionId,
      ueId,
    };
  },
}

</script>

<template>
  <div class="flex flex-col gap-4 p-4 bg-background items-center w-full h-full">
    <MenuBar />

    <main class="flex flex-col gap-8 p-4 bg-background items-start justify-left w-full h-full">
      <div class="flex flex-col gap-1">
        <h1 class="text-h1 text-text mb-4">
          Liste des locaux pour
          <span class="text-esi-blue italic">{{ ueId }}</span>
          - <span class="text-esi-blue italic">{{ eventName }}</span>
        </h1>
        <Breadcrumb />
      </div>

      <div class="flex flex-col gap-2">
        <!-- <span class="text-input-title">Ajouter une épreuve</span>
        <form @submit.prevent="handleCreateEvent" class="flex items-center gap-2 h-fit">
          <input
            v-model="newEventLabel"
            placeholder="ex. : bilan, examen..."
            type="text"
            name="session"
            id="newSession"
            class="border border-border rounded-button py-2 px-3 text-button text-text"
            required
          />
          <button type="submit" class="bg-esi-blue text-button text-background py-2 px-3 rounded-button">
            Ajouter
          </button>
        </form> -->
      </div>
    </main>
  </div>
</template>