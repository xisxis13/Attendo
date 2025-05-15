<script>
import { ref, onMounted } from 'vue';
import { examinationRoomService } from '@/services/examinationRoomService';

export default {
  props: {
    room: {
      type: Object,
      required: true,
      validator: (room) => {
        return (
          room &&
          typeof room.label === 'string' &&
          (typeof room.capacity === 'number' || room.capacity === undefined)
        );
      },
    },
    supervisor: {
      type: String,
      required: false,
      default: null,
    },
    eventId: {
      type: String,
      required: true,
      validator: (eventId) => typeof eventId === 'string' && eventId.length > 0,
    },
    linkTo: {
      type: String,
      required: true,
      default: null,
    },
    examinationRoomId: {
      type: [String, Number],
      required: true,
      validator: (id) => id !== null && id !== undefined,
    },
  },
  setup(props, { emit }) {
    const isDissociating = ref(false);
    const errorMessage = ref(null);
    const presenceCount = ref(0);

    const fetchPresenceCount = async () => {
      try {
        presenceCount.value = await examinationRoomService.getPresenceCountForRoom(props.examinationRoomId);
      } catch (error) {
        console.error('Error fetching presence count:', error.message);
        presenceCount.value = 0;
      }
    };

    onMounted(() => {
      fetchPresenceCount();
      console.log('Room received in RoomCompo:', props.room);
    });

    const dissociateRoom = async () => {
      if (!window.confirm('Are you sure you want to dissociate this room?')) {
        return;
      }

      if (!props.room?.label || !props.eventId) {
        errorMessage.value = 'Room label or event ID is missing.';
        console.error(errorMessage.value);
        return;
      }

      isDissociating.value = true;
      try {
        await examinationRoomService.dissociateRoomFromEvent(props.eventId, props.room.label);
        console.log(`Room ${props.room.label} successfully dissociated from event ${props.eventId}`);
        emit('room-dissociated', props.room.label);
        errorMessage.value = null;
      } catch (error) {
        errorMessage.value = error.message;
        console.error('Error while dissociating room:', error.message);
      } finally {
        isDissociating.value = false;
      }
    };

    return {
      dissociateRoom,
      isDissociating,
      errorMessage,
      presenceCount,
    };
  },
};
</script>

<template>
  <div class="flex flex-col gap-3 p-4 w-full max-w-xs h-fit border border-border dark:border-dark-border rounded-2xl bg-box dark:bg-dark-box">
    <RouterLink :to="linkTo" class="flex justify-between items-center w-full">
      <span class="text-text dark:text-dark-text font-bold text-xl truncate">{{ room?.label || "N/A" }}</span>
      <div class="border border-esi-blue rounded-full py-1 px-3 bg-esi-blue/10">
        <span class="text-text dark:text-dark-text font-semibold text-sm">
          <span class="text-esi-blue italic">{{ presenceCount }}</span>
          /
          {{ room?.capacity || "N/A" }}
        </span>
      </div>
    </RouterLink>
    <hr class="border-light-content dark:border-dark-light-content w-full">
    <div>
      <span class="text-text dark:text-dark-text text-sm font-medium">Surveillant : <span class="text-esi-blue italic font-semibold">{{ supervisor }}</span></span>
    </div>
    <hr class="border-light-content dark:border-dark-light-content w-full">
    <div class="flex flex-col gap-2">
      <button
        class="bg-red-600 text-button text-white py-2 px-3 rounded-button hover:bg-red-700 transition"
        @click="dissociateRoom"
        :class="{ 'cursor-not-allowed opacity-70': !room?.label || isDissociating }"
        :disabled="!room?.label || isDissociating"
      >
        {{ isDissociating ? 'Dissociation...' : 'Dissocier' }}
      </button>
      <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
    </div>
  </div>
</template>