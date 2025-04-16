import { defineStore } from 'pinia';
import { listExaminationService } from '@/services/listExaminationService';

export const useExaminationStore = defineStore('examination', {
  state: () => ({
    examinationRoomsByEvent: [],
    currentExamination: null,
    availableTeachers: [],
    currentTeacher: null,
  }),
  actions: {
    async getAllExaminationRoomsByEvent(eventId) {
      const data = await listExaminationService.getAllExaminationRoomByEvent(eventId);
      this.examinationRoomsByEvent = data;
      return data;
    },

    async getExaminationById(eventId, roomId) {
      const result = await listExaminationService.getExaminationById(eventId, roomId);
      if (result) {
        this.currentExamination = result;
      }
      return result;
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

    async setSupervisor(examinationId, supervisor) {
      const result = await listExaminationService.setSupervisor(examinationId, supervisor);
      if (result.success) {
        this.currentExamination.supervisor = supervisor.acro;
        await this.getAvailableTeacher();
      }
      return result;
    },

    async getAvailableTeacher() {
      const result = await listExaminationService.getAvailableTeacher();
      this.availableTeachers = result;
      return result;
    },

    async getTeacherById(teacherId) {
      const result = await listExaminationService.getTeacherById(teacherId);
      if (result) {
        this.currentTeacher = result;
      }
      return result;
    },
  },
});