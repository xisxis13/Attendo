<script>
import MenuBar from '@/components/MenuBar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import ObjectTable from '@/components/ObjectTable.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useEventsStore } from '@/stores/event';
import { useSessionsStore } from '@/stores/sessions';
import { computed, onMounted } from 'vue';
import { listUeService } from '@/services/listUeService';

export default {
  components: {
    MenuBar,
    Breadcrumb,
    ObjectTable,
  },
  setup() {
    const authStore = useAuthStore();
    const eventStore = useEventsStore();
    const sessionsStore = useSessionsStore();

    const route = useRoute();
    const router = useRouter();

    const sessionId = route.params.sessionId;
    const ueId = route.params.ueId;

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        router.push({ name: 'accueil', query: { authRequired: 'true' } });
        return;
      }

      await eventStore.fetchEvents(ueId, sessionId);

      await sessionsStore.fetchSessionById(sessionId);
    });

    return {
      authStore,
      events: computed(() => eventStore.events),
      createEvent: eventStore.createEvent,
      deleteEvent: eventStore.deleteEvent,
      sessionName: computed(() => sessionsStore.currentSession?.label || 'Chargement...'),
      sessionId,
      ueId,
      newEventLabel: null,
    };
  },
  methods: {
    async handleCreateEvent() {
      try {
        if (!this.newEventLabel || !this.newEventLabel.trim()) {
          console.error("The event name can't be null")
          return;
        }

        const sessionCompo = await listUeService.getSessionCompoId(this.ueId, this.sessionId);
        if (!sessionCompo || !sessionCompo.id) {
          console.error("Impossible to find the session_compo relation");
          return;
        }

        const eventData = {
          label: this.newEventLabel.trim(),
          session_compo: sessionCompo.id,
        };

        await this.createEvent(eventData);
        this.newEventLabel = null;
      } catch (error) {
        console.log("Error creating the event:", error);
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
        <h1 class="text-h1 text-text mb-4">
          Liste des épreuves de 
          <span class="text-esi-blue italic">{{ ueId || 'Chargement...' }}</span>
          (session : <span class="text-esi-blue italic">{{ sessionName }}</span>)
        </h1>
        <Breadcrumb />
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-input-title">Ajouter une épreuve</span>
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
        </form>
      </div>

      <ObjectTable 
        :object-list="events"
        :columns="[{ key: 'label', label: 'Épreuve', linkable: true }]"
        :link-to="`/sessions/${sessionId}/${ueId}/:id`"
        :on-delete="deleteEvent"
        object-type="event"
        @update:objectList="events = $event"
      />
    </main>
  </div>
</template>