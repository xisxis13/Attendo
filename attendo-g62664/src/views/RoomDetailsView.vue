<script>
import MenuBar from '@/components/MenuBar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import ObjectTable from '@/components/ObjectTable.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref, computed, onMounted } from 'vue';
import { eventService } from '@/services/eventService';
import { roomService } from '@/services/roomService';
import { examinationRoomService } from '@/services/examinationRoomService';
import { studentService } from '@/services/sudentService';
import { teacherService } from '@/services/teacherService';

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

    const eventId = route.params.eventId;
    const sessionId = route.params.sessionId;
    const ueId = route.params.ueId;
    const roomId = route.params.roomId;

    const currentRoom = ref(null);
    const currentEvent = ref(null);
    const currentExamination = ref(null);
    const availableTeachers = ref([]);
    const allStudents = ref([]);
    const presentStudents = ref([]);
    const teacherSelected = ref(null);
    const errorMessage = ref(null);

    const fetchData = async () => {
      try {
        currentRoom.value = await roomService.getById(roomId);  
        currentEvent.value = await eventService.getById(eventId);
        currentExamination.value = await examinationRoomService.getByEventAndRoom(eventId, roomId);
        availableTeachers.value = await teacherService.getAvailableSupervisors();
        allStudents.value = await studentService.getForUe(ueId);
        const present = await studentService.getPresentForExaminationRoom(currentExamination.value.id);
        allStudents.value = allStudents.value.map(student => ({
          ...student,
          isPresent: present.some(p => p.student_id === student.student_id),
        }));
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

    const setSupervisor = async () => {
      if (!teacherSelected.value) {
        errorMessage.value = "Please select a supervisor.";
        return;
      }

      try {
        await examinationRoomService.setSupervisor(currentExamination.value.id, teacherSelected.value.acro);
        await fetchData();
        teacherSelected.value = null;
        errorMessage.value = null;
      } catch (error) {
        errorMessage.value = error.message;
        console.error(error.message);
      }
    };

    const handleTogglePresence = async (student) => {
      try {
        const newPresence = await studentService.togglePresence(student.student_id, currentExamination.value.id, eventId);
        student.isPresent = newPresence;
        errorMessage.value = null;
      } catch (error) {
        errorMessage.value = error.message;
        console.error(error.message);
      }
    };

    return {
      authStore,
      eventId,
      sessionId,
      ueId,
      roomId,
      currentRoom,
      currentEvent,
      currentExamination,
      availableTeachers,
      allStudents,
      teacherSelected,
      setSupervisor,
      handleTogglePresence,
      errorMessage,
    };
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
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </div>

      <ObjectTable 
        :object-list="allStudents"
        :columns="[
          { key: 'student_id', label: 'Matricule' },
          { key: 'lastname', label: 'Nom' },
          { key: 'firstname', label: 'Prénom' },
        ]"
        object-type="student"
        :on-toggle-presence="handleTogglePresence"
      />
    </main>
  </div>
</template>