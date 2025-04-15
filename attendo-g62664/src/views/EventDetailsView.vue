<script>
import MenuBar from '@/components/MenuBar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import RoomCompo from '@/components/RoomCompo.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useEventsStore } from '@/stores/event';
import { useSessionsStore } from '@/stores/sessions';
import { useRoomStore } from '@/stores/room';
import { useExaminationStore } from '@/stores/examination';
import { computed, onMounted } from 'vue';

export default {
  components: {
    MenuBar,
    Breadcrumb,
    RoomCompo,
  },
  setup() {
    const authStore = useAuthStore();
    const eventStore = useEventsStore();
    const sessionsStore = useSessionsStore();
    const roomService = useRoomStore();
    const examinationStore = useExaminationStore();

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

      if (!eventId) {
        console.error('Event ID is missing in route parameters');
        router.push({ name: 'accueil' }); 
        return;
      }

      await examinationStore.getAllExaminationRoomsByEvent(eventId);
      console.log('Normalized Examination Rooms:', examinationStore.examinationRoomsByEvent);
      await eventStore.getEventById(eventId);
      await roomService.getAllRooms();
    });

    return {
      authStore,
      rooms: computed(() => roomService.rooms),
      sessionName: computed(() => sessionsStore.currentSession?.label || 'Chargement...'),
      eventName: computed(() => eventStore.currentEvent?.label || 'Chargement...'),
      examinationRooms: computed(() => examinationStore.examinationRoomsByEvent),
      createEvent: examinationStore.createExaminationRooms,
      eventId,
      sessionId,
      ueId,
      roomSelected: null,
    };
  },
  methods: {
    async handleCreateEvent() {
      try {
        if (!this.roomSelected) {
          console.error("The room can't be null");
          return;
        }

        await this.createEvent(this.eventId, this.roomSelected.label);
        this.roomSelected = null;
      } catch (error) {
        console.log("Error creating the examination room:", error);
      }
    },
    async refreshExaminationRooms() {
      if (!this.eventId) {
        console.error('Cannot refresh examination rooms: Event ID is missing');
        return;
      }
      await this.examinationStore.getAllExaminationRoomsByEvent(this.eventId);
    },
  },
};
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
        <span class="text-input-title">Ajouter une épreuve</span>
        <form @submit.prevent="handleCreateEvent" class="flex items-center gap-2 h-fit">
          <select
            v-model="roomSelected"
            name="room"
            id="roomSelected"
            class="border border-border rounded-button py-2 px-3 text-button text-text w-full max-w-sm"
            required
          >
            <option value="" disabled>Sélectionnez un local</option>
            <option v-for="room in rooms" :key="room.label" :value="room">{{ room.label }}</option>
          </select>
          <button
            type="submit"
            class="bg-esi-blue text-button text-white py-2 px-3 rounded-button hover:bg-esi-blue/90 transition"
          >
            Ajouter
          </button>
        </form>
      </div>

      <div class="room-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        <RoomCompo
          v-for="(examination, index) in examinationRooms"
          :key="`${examination?.id}-${index}-${examination?.room?.label}`"
          :room="{
            label: examination?.room?.label || examination?.room || 'N/A',
            capacity: examination?.room?.capacity || 'N/A'
          }"
          :supervisor="examination?.supervisor?.acro"
          :eventId="eventId"
          @room-dissociated="refreshExaminationRooms"
        />
      </div>
    </main>
  </div>
</template>