import { defineStore } from "pinia";
import { listUeService } from "@/services/listUeService";

export const useUeStore = defineStore('ue', {
  state: () => ({
    availableUe: [],
    associatedUe: [],
  }),
  actions: {
    async fetchAvailableUe(sessionId) {
      this.availableUe = await listUeService.getAvailabledUe(sessionId);
    },
    async fetchAssociatedUe(sessionId) {
      this.associatedUe = await listUeService.fetchAssociatedUe(sessionId);
    },
    async associateUeToSession(ueId, sessionId) {
      const success = await listUeService.associateUeToSession(ueId, sessionId);
      if (success) {
        this.associatedUe.push({ ue: ueId });
        this.availableUe = this.availableUe.filter(ue => ue.ue !== ueId)
      }
    },
    async deleteAssociation(ueId, sessionId) {
      const success = await listUeService.deleteAssociation(ueId, sessionId);
      if (success) {
        this.associatedUe = this.associatedUe.filter(ue => ue.ue !== ueId);
        await this.fetchAvailableUe(sessionId);
      }
    },
  },
});