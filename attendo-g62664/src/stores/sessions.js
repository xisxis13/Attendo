import { defineStore } from "pinia";
import { listSessionsService } from "@/services/listSessionsService";

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [],
    currentSession: null,
  }),
  actions: {
    async fetchSessions() {
      this.sessions = await listSessionsService.getAllSessions();
    },
    async fetchSessionById(sessionId) {
      this.currentSession = await listSessionsService.getSessionById(sessionId);
    },
    async createSession(sessionName) {
      const newSession = await listSessionsService.createSession(sessionName);
      if (newSession) {
        this.sessions.push(newSession);
      }
    },
    async deleteSession(sessionId) {
      const success = await listSessionsService.deleteSession(sessionId);
      if (success) {
        this.sessions = this.sessions.filter(session => session.id !== sessionId);
      }
    },
  },
});