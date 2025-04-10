<script>
import MenuBar from '@/components/MenuBar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import ObjectTable from '@/components/ObjectTable.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUeStore } from '@/stores/ue';
import { useSessionsStore } from '@/stores/sessions';
import { computed, onMounted } from 'vue';

export default {
  components: {
    MenuBar,
    Breadcrumb,
    ObjectTable,
  },
  setup() {
    const authStore = useAuthStore();
    const ueStore = useUeStore();
    const sessionsStore = useSessionsStore();

    const route = useRoute();
    const router = useRouter();

    const sessionId = route.params.sessionId;

    // Charger les données nécessaires au montage
    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        router.push({ name: 'accueil', query: { authRequired: 'true' } });
        return;
      }

      // Charger les informations de la session
      await sessionsStore.fetchSessionById(sessionId);

      // Charger les UE disponibles et associées
      await ueStore.fetchAvailableUe(sessionId);
      await ueStore.fetchAssociatedUe(sessionId);
    });

    return {
      authStore,
      ueStore,
      sessionsStore,
      sessionId,
      sessionName: computed(() => sessionsStore.currentSession?.label || 'Chargement...'),
      availableUe: computed(() => ueStore.availableUe),
      associatedUe: computed(() => ueStore.associatedUe),
      ueSelected: null,
    };
  },
  methods: {
    async associateUeToSession() {
      if (!this.ueSelected) return;

      await this.ueStore.associateUeToSession(this.ueSelected.ue, this.sessionId);
      this.ueSelected = null;
    },
    async deleteAssociation(ueId) {
      await this.ueStore.deleteAssociation(ueId, this.sessionId);
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
          Session <span class="text-esi-blue italic">{{ sessionName || 'Chargement...' }}</span>
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
      </div>

      <ObjectTable 
        :object-list="associatedUe"
        :columns="[{ key: 'ue', label: 'UE', linkable: true }]"
        :link-to="`/sessions/${sessionId}/:id`"
        :on-delete="deleteAssociation"
        object-type="ue"
        @update:objectList="associatedUe = $event"
      />
    </main>
  </div>
</template>