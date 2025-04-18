<script>
import MenuBar from '@/components/MenuBar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import ObjectTable from '@/components/ObjectTable.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref, computed, onMounted } from 'vue';
import { sessionsService } from '@/services/sessionsService';
import { eventService } from '@/services/eventService';
import { ueService } from '@/services/ueService';

export default {
  components: {
    MenuBar,
    Breadcrumb,
    ObjectTable,
  },
  setup() {
    const authStore = useAuthStore();
    const route = useRoute();
    const router = useRouter();

    const sessionId = route.params.sessionId;
    const ueId = route.params.ueId;

    const session = ref(null);
    const events = ref([]);
    const newEventLabel = ref(null);
    const errorMessage = ref(null);

    const sessionName = computed(() => session.value?.label || 'Chargement...');

    const fetchData = async () => {
      try {
        session.value = await sessionsService.getById(sessionId);
        events.value = await eventService.getAllForUeAndSession(ueId, sessionId);
        errorMessage.value = null;
      } catch (error) {
        errorMessage.value = error.message;
        console.error(error.message);
      }
    };

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        router.push({ name: 'accueil', query: { authRequired: 'true' } });
        return;
      }

      await fetchData();
    });

    const handleCreateEvent = async () => {
      try {
        if (!newEventLabel.value || !newEventLabel.value.trim()) {
          errorMessage.value = 'The event can\'t be empty';
          return;
        }

        const sessionCompoId = await ueService.getSessionCompoId(ueId, sessionId);

        if (!sessionCompoId) {
          errorMessage.value = 'Failed to find the session_compo relation';
          return;
        }

        const eventData = {
          label: newEventLabel.value.trim(),
          session_compo: sessionCompoId,
        };

        await eventService.create(eventData);
        await fetchData();
        newEventLabel.value = null;
        errorMessage.value = null;
      } catch (error) {
        errorMessage.value = error.message;
        console.error(error.message);
      }
    };

    const deleteEvent = async () => {
      try {
        await eventService.delete(eventId);
        await fetchData();
        errorMessage.value = null;
      } catch (error) {
        errorMessage.value = error.message;
        console.error(error.message);
      }
    };

    return {
      authStore,
      events,
      sessionName,
      sessionId,
      ueId,
      newEventLabel,
      handleCreateEvent,
      deleteEvent,
      errorMessage,
    };
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
            placeholder="e.g., Test, Exam..."
            type="text"
            name="event"
            id="newEvent"
            class="border border-border rounded-button py-2 px-3 text-button text-text"
            required
          />
          <button type="submit" class="bg-esi-blue text-button text-background py-2 px-3 rounded-button">
            Ajouter
          </button>
        </form>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </div>

      <ObjectTable 
        :object-list="events"
        :columns="[{ key: 'label', label: 'Épreuves', linkable: true }]"
        :link-to="`/sessions/${sessionId}/${ueId}/:id`"
        :on-delete="deleteEvent"
        object-type="event"
        @update:objectList="events = $event"
      />
    </main>
  </div>
</template>