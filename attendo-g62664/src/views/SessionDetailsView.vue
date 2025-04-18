<script>
import MenuBar from '@/components/MenuBar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import ObjectTable from '@/components/ObjectTable.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref, computed, onMounted, useId } from 'vue';
import { sessionsService } from '@/services/sessionsService';
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
    const session = ref(null);
    const availableUe = ref([]);
    const associatedUe = ref([]);
    const ueSelected = ref(null);
    const errorMessage = ref(null);

    const sessionName = computed(() => session.value?.label || 'Chargement...');

    const fetchSessionDetails = async () => {
      try {
        session.value = await sessionsService.getById(sessionId);
        availableUe.value = await ueService.getAvailableForSession(sessionId);
        associatedUe.value = await ueService.getAssociatedToSession(sessionId);
        errorMessage.value = null;
      } catch (error) {
        errorMessage.value = error.message;
        console.error(error.message);
      }
    }

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        router.push({ name: 'accueil', query: { authRequired: 'true' } });
        return;
      }

      await fetchSessionDetails();
    });

    const associateUeToSession = async () => {
      if (!ueSelected.value) {
        errorMessage.value = 'Veuillez choisir une UE à associer';
        return;
      }
      try {
        await ueService.associateToSession(ueSelected.value.ue, sessionId);
        await fetchSessionDetails();
        ueSelected.value = null;
        errorMessage.value = null;
      } catch (error) {
        errorMessage.value = error.message;
        console.error(error.message);
      }
    };

    const deleteAssociation = async (ueId) => {
      try {
        await ueService.dissociateFromSession(ueId, sessionId);
        errorMessage.value = null;
      } catch (error) {
        errorMessage.value = error.message;
        console.error(error.message);
      }
    };

    return {
      authStore,
      sessionId,
      sessionName,
      availableUe,
      associatedUe,
      ueSelected,
      associateUeToSession,
      deleteAssociation,
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
          Session <span class="text-esi-blue italic">{{ sessionName }}</span>
        </h1>
        <Breadcrumb />
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-input-title">Ajouter une UE dans la session</span>
        <form @submit.prevent="associateUeToSession" class="flex items-center gap-2 h-fit">
          <select
            v-model="ueSelected"
            name="ue"
            id="ueSelected"
            class="border border-border rounded-button py-2 px-3 text-button text-text"
          >
            <option value="" disabled>Sélectionnez une UE</option>
            <option v-for="ue in availableUe" :key="ue.ue" :value="ue">{{ ue.ue }}</option>
          </select>
          <button
            type="submit"
            class="bg-esi-blue text-button text-background py-2 px-3 rounded-button"
          >
            Ajouter
          </button>
        </form>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </div>

      <ObjectTable 
        :object-list="associatedUe"
        :columns="[{ key: 'ue', label: 'UE', linkable: true }]"
        :link-to="`/sessions/${sessionId}/ue/:id`"
        :on-delete="deleteAssociation"
        object-type="ue"
        @update:objectList="associatedUe = $event"
      />
    </main>
  </div>
</template>