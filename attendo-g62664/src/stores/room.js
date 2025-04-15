import { defineStore } from "pinia";
import { listRoomService } from "@/services/listRoomService";

export const useRoomStore = defineStore('rooms', {
  state: () => ({
    rooms: [],
    currentRoom: null,
  }),
  actions: {
    async getAllRooms() {
      this.rooms = await listRoomService.getAllRooms();
    },
    async getRoomById(roomId) {
      this.currentRoom = await listRoomService.getRoomById(roomId);
    },
  },
});