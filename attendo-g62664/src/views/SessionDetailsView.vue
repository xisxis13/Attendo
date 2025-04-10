<script>
import MenuBar from '@/components/MenuBar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import ObjectTable from '@/components/ObjectTable.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { listSessionsService } from '@/services/listSessionsService';
import { listUeService } from '@/services/listUeService';

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
    };
  },
  data() {
    return {
      ueSelected: null,
      availableUe: [],
      associatedUe: [],
    };
  },
  async mounted() {
    if (!this.authStore.isAuthenticated) {
      this.router.push({ name: 'accueil', query: { authRequired: 'true' } });
      return;
    }

    const session = await listSessionsService.getSessionById(this.sessionId)
    this.sessionName = session.label;
    this.availableUe = await listUeService.getAvailabledUe(this.sessionId);
    await this.fetchAssociatedUe();
  },
  methods: {
    async fetchAssociatedUe() {
      const success = await listUeService.fetchAssociatedUe(this.sessionId);
      if (success !== null) {
        this.associatedUe = success;
      }
    },
    async associateUeToSession() {
      if (!this.ueSelected) return;

      const success = await listUeService.associateUeToSession(this.ueSelected.ue, this.sessionId);
      if (success !== null) {
        this.associatedUe.push({ ue: this.ueSelected.ue });
        this.availableUe = this.availableUe.filter(ue => ue.ue !== this.ueSelected.ue);
        this.ueSelected = null;
      }
    },
    async deleteAssociation(ueId) {
      const success = await listUeService.deleteAssociation(ueId, this.sessionId);
      if (success) {
        this.availableUe = await listUeService.getAvailabledUe(this.sessionId);
      }
      return success;
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
            :disabled="!ueSelected"
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