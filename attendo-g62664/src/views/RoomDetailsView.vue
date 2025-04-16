<script>
import MenuBar from '@/components/MenuBar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useEventsStore } from '@/stores/event';
import { useSessionsStore } from '@/stores/sessions';
import { useRoomStore } from '@/stores/room';
import { useExaminationStore } from '@/stores/examination';
import { ref, computed, onMounted } from 'vue';

export default {
  components: {
    MenuBar,
    Breadcrumb,
  },
  setup() {
    const authStore = useAuthStore();
    const eventStore = useEventsStore();
    const roomStore = useRoomStore();
    const examinationStore = useExaminationStore();

    const route = useRoute();
    const router = useRouter();

    const eventId = route.params.eventId;
    const sessionId = route.params.sessionId;
    const ueId = route.params.ueId;
    const roomId = route.params.roomId;

    const currentRoom = ref(null);
    const currentEvent = ref(null);
    const currentExamination = ref(null);
    const availableTeachers = ref([]);

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        router.push({ name: 'accueil', query: { authRequired: 'true' } });
        return;
      }

      await roomStore.getRoomById(roomId);
      currentRoom.value = roomStore.currentRoom;
      await examinationStore.getAllExaminationRoomsByEvent(eventId);
      await eventStore.getEventById(eventId);
      currentEvent.value = eventStore.currentEvent;
      await examinationStore.getExaminationById(eventId, roomId);
      currentExamination.value = examinationStore.currentExamination;
      await examinationStore.getAvailableTeacher();
      availableTeachers.value = examinationStore.availableTeachers;
    });

    return {
      authStore,
      examinationStore,
      eventId,
      sessionId,
      ueId,
      roomId,
      currentRoom,
      currentEvent,
      currentExamination,
      availableTeachers,
      currentTeacher: null,
      teacherSelected: null,
    };
  },
  methods: {
    async setSupervisor() {
      if (!this.teacherSelected) return;

      try {
        const result = await this.examinationStore.setSupervisor(this.currentExamination.id, this.teacherSelected);
        if (result.success) {
          this.currentExamination.supervisor = this.teacherSelected.acro;
          this.availableTeachers = this.examinationStore.availableTeachers;
          this.teacherSelected = null;
        } else {
          console.error('Failed to set supervisor:', result.error);
        }
      } catch (error) {
        console.error('Error setting supervisor:', error);
      }
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
          Prise de présence du local 
          <span class="text-esi-blue italic">{{ currentExamination?.room?.label || 'Chargement...' }}</span>
          <span v-if="currentExamination?.supervisor"> par <span class="text-esi-blue italic">{{ currentExamination?.supervisor?.acro || currentExamination?.supervisor || 'N/A' }}</span></span>
        </h1>
        <Breadcrumb />
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-input-title">Définir un surveillant</span>
        <form @submit.prevent="setSupervisor" class="flex items-center gap-2 h-fit">
          <select
            v-model="teacherSelected"
            name="teacher"
            id="teacherSelected"
            class="border border-border rounded-button py-2 px-3 text-button text-text w-full max-w-sm"
            required
          >
            <option value="" disabled>Sélectionnez un surveillant</option>
            <option v-for="teacher in availableTeachers" :key="teacher.acro" :value="teacher">{{ teacher.acro }}</option>
          </select>
          <button
            type="submit"
            class="bg-esi-blue text-button text-white py-2 px-3 rounded-button hover:bg-esi-blue/90 transition"
          >
            Ajouter
          </button>
        </form>
      </div>
    </main>
  </div>
</template>