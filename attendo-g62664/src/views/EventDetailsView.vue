<script>
import MenuBar from '@/components/MenuBar.vue';
import Breadcrumb from '@/components/BreadCrumb.vue';
import RoomCompo from '@/components/RoomCompo.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref, computed, onMounted } from 'vue';
import { eventService } from '@/services/eventService';
import { roomService } from '@/services/roomService';
import { examinationRoomService } from '@/services/examinationRoomService';

export default {
  components: {
    MenuBar,
    Breadcrumb,
    RoomCompo,
  },
  setup() {
    const authStore = useAuthStore();
    const route = useRoute();
    const router = useRouter();

    const eventId = route.params.eventId;
    const sessionId = route.params.sessionId;
    const ueId = route.params.ueId;

    const event = ref(null);
    const rooms = ref([]);
    const examinationRooms = ref([]);
    const roomSelected = ref(null);
    const errorMessage = ref(null);

    const eventName = computed(() => event.value?.label || 'Loading...');

    const fetchData = async () => {
      try {
        event.value = await eventService.getById(eventId);
        rooms.value = await roomService.getAll();
        examinationRooms.value = await examinationRoomService.getAllForEvent(eventId);
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

      if (!eventId) {
        errorMessage.value = 'Event ID is missing in route parameters.';
        router.push({ name: 'accueil' });
        return;
      }

      await fetchData();
    });

    const handleCreateEvent = async () => {
      try {
        if (!roomSelected.value) {
          errorMessage.value = "Please select a room.";
          return;
        }

        await examinationRoomService.associateRoomToEvent(eventId, roomSelected.value.label);
        await fetchData();
        roomSelected.value = null;
        errorMessage.value = null;
      } catch (error) {
        errorMessage.value = error.message;
        console.error(error.message);
      }
    };

    const refreshExaminationRooms = async () => {
      if (!eventId) {
        errorMessage.value = 'Cannot refresh examination rooms: Event ID is missing.';
        return;
      }
      await fetchData();
    };

    return {
      authStore,
      rooms,
      eventName,
      examinationRooms,
      eventId,
      sessionId,
      ueId,
      roomSelected,
      handleCreateEvent,
      refreshExaminationRooms,
      errorMessage,
    };
  },
};
</script>

<template>
  <div class="flex flex-col gap-4 p-4 bg-background dark:bg-dark-background items-center w-full h-full">
    <MenuBar />

    <main class="flex flex-col gap-8 p-4 bg-background dark:bg-dark-background items-start justify-left w-full h-full">
      <div class="flex flex-col gap-1">
        <h1 class="text-h1 text-text dark:text-dark-text mb-4">
          List of rooms for
          <span class="text-esi-blue italic">{{ ueId }}</span>
          - <span class="text-esi-blue italic">{{ eventName }}</span>
        </h1>
        <Breadcrumb />
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-input-title text-text dark:text-dark-text">Ajouter un local</span>
        <form @submit.prevent="handleCreateEvent" class="flex items-center gap-2 h-fit">
          <select
            v-model="roomSelected"
            name="room"
            id="roomSelected"
            class="border border-border dark:border-dark-border bg-box dark:bg-dark-box rounded-button py-2 px-3 text-button text-text dark:text-dark-text"
            required
          >
            <option value="" disabled>Choisissez un local</option>
            <option v-for="room in rooms" :key="room.label" :value="room">{{ room.label }}</option>
          </select>
          <button type="submit" class="bg-esi-blue hover:bg-opacity-90 dark:hover:bg-opacity-90 text-button text-background py-2 px-3 rounded-button">
            Ajouter
          </button>
        </form>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
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
          :link-to="`/sessions/${sessionId}/ue/${ueId}/event/${eventId}/room/${examination?.room?.label}`"
          :examinationRoomId="examination?.id"
          @room-dissociated="refreshExaminationRooms"
        />
      </div>
    </main>
  </div>
</template>