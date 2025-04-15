import { defineStore } from 'pinia';
import { listExaminationService } from '@/services/listExaminationService';

export const useExaminationStore = defineStore('examination', {
  state: () => ({
    examinationRoomsByEvent: [],
  }),
  actions: {
    async getAllExaminationRoomsByEvent(eventId) {
      const data = await listExaminationService.getAllExaminationRoomByEvent(eventId);
      this.examinationRoomsByEvent = data;
      return data;
    },

    async createExaminationRooms(eventId, roomId) {
      const result = await listExaminationService.createExamination(eventId, roomId);
      if (result) {
        await this.getAllExaminationRoomsByEvent(eventId);
      }
      return result;
    },

    async dissociateRoomFromExamination(eventId, roomId) {
      const result = await listExaminationService.dissociateRoomFromExamination(eventId, roomId);
      if (result?.success) {
        await this.getAllExaminationRoomsByEvent(eventId);
      }
      return result;
    },
  },
});