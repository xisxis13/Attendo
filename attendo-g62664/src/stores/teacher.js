import { defineStore } from "pinia";
import { listTeacherService } from "@/services/listTeacherService";

export const useTeacherStore = defineStore('teachers', {
  state: () => ({
    teachers: [],
    currentTeacher: null,
  }),
  actions: {
    async getAllTeachers() {
      this.teachers = await listTeacherService.getAllTeachers();
    },
    async getTeacherById(teacherId) {
      this.currentTeacher = await listTeacherService.getRoomById(teacherId);
    },
  },
});