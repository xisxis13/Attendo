<script>
import MenuBar from '@/components/MenuBar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import ObjectTable from '@/components/ObjectTable.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { listSessionsService } from '@/services/listSessionsService';
import { listUeService } from '@/services/listUeService';
import { listEventService } from '@/services/listEventService';

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

    return {
      authStore,
      router,
      sessionId: route.params.sessionId,
      sessionName: null,
      ueId: route.params.ueId,
      events: [],
      newEventLabel: null,
    };
  },
  watch: {
    '$route.params.ueId'() {
      this.loadEvents();
    },
    '$route.params.sessionId'() {
      this.loadEvents();
    }
  },
  async mounted() {
    if (!this.authStore.isAuthenticated) {
      this.router.push({ name: 'accueil', query: { authRequired: 'true' } });
      return;
    }

    await this.loadEvents();
    const session = await listSessionsService.getSessionById(this.sessionId);
    this.sessionName = session.label;
  },
  methods: {
    async loadEvents() {
      try {
        const session = await listSessionsService.getSessionById(this.sessionId);
        this.sessionName = session?.label || 'Session inconnue';
        
        console.log("Chargement des événements pour UE:", this.ueId, "dans la session:", this.sessionId);
        this.events = await listEventService.getAllUeEvent(this.ueId, this.sessionId);
        console.log("Événements chargés:", this.events);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        this.events = [];
      }
    },
    async createEvent() {
      try {
        if (!this.newEventLabel || !this.newEventLabel.trim()) {
          console.error("Le nom de l'épreuve ne peut pas être vide");
          return;
        }

        const sessionCompo = await listUeService.getSessionCompoId(this.ueId, this.sessionId);
        
        if (!sessionCompo || !sessionCompo.id) {
          console.error("Impossible to find ue-session relation");
          return;
        }

        const eventData = {
          session_compo: sessionCompo.id,
          label: this.newEventLabel.trim(),
          completed: false
        };

        const success = await listEventService.createEvent(eventData);
        
        if (success !== null) {
          this.events = await listEventService.getAllUeEvent(this.ueId, this.sessionId);
          console.log("Événements après création:", this.events);
          this.newEventLabel = null;
        }
      } catch (error) {
        console.error("Error creating event:", error);
      }
    },
    async deleteEvent(eventId) {
      try {
        const success = await listEventService.deleteEvent(eventId);
        if (success) {
          this.events = await listEventService.getAllUeEvent(this.ueId, this.sessionId);
        }
        return success;
      } catch (error) {
        console.error("Error deleting event:", error);
        return false;
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
          (session : <span class="text-esi-blue italic">{{ sessionName || 'Chargement...' }}</span> )
        </h1>
        <Breadcrumb />
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-input-title">Ajouter une épreuve</span>
        <form @submit.prevent="createEvent" class="flex items-center gap-2 h-fit">
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