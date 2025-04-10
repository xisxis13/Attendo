import { defineStore } from "pinia";
import { listEventService } from "@/services/listEventService";

export const useEventsStore = defineStore('events', {
  state:() => ({
    events: [],
  }),
  actions: {
    async fetchEvents(ueId, sessionId) {
      this.events = await listEventService.getAllUeEvent(ueId, sessionId);
    },
    async createEvent(eventdata) {
      const newEvent = await listEventService.createEvent(eventdata);
      if (newEvent) {
        this.events.push(newEvent);
      }
    },
    async deleteEvent(eventId) {
      const success = await listEventService.deleteEvent(eventId);
      if (success) {
        this.events = this.events.filter(event => event.id !== eventId);
      }
    },
  },
});