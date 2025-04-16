<script>
import { useExaminationStore } from '@/stores/examination';
import { ref } from 'vue';

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
  },
  setup(props, { emit }) {
    const examinationStore = useExaminationStore();
    const isDissociating = ref(false);

    const dissociateRoom = async () => {
      if (!window.confirm('Voulez-vous vraiment dissocier ce local ?')) {
        return;
      }

      if (!props.room?.label || !props.eventId) {
        console.error('Room or event ID is missing');
        return;
      }

      isDissociating.value = true;
      try {
        const result = await examinationStore.dissociateRoomFromExamination(props.eventId, props.room.label);
        // Vérifier si result est défini et a une propriété success
        if (result && result.success) {
          console.log(`Room ${props.room.label} successfully dissociated from event ${props.eventId}`);
          emit('room-dissociated', props.room.label);
        } else {
          console.error('Failed to dissociate room:', result?.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Error while dissociating room:', error);
      } finally {
        isDissociating.value = false;
      }
    };

    return {
      dissociateRoom,
      isDissociating,
    };
  },
  mounted() {
    console.log('Room received in RoomCompo:', this.room);
  },
};
</script>

<template>
  <div class="flex flex-col gap-3 p-4 w-full max-w-xs h-fit border border-border rounded-2xl bg-box">
    <RouterLink :to="linkTo" class="flex justify-between items-center w-full">
      <span class="text-text font-bold text-xl truncate">{{ room?.label || "N/A" }}</span>
      <div class="border border-esi-blue rounded-full py-1 px-3 bg-esi-blue/10">
        <span class="text-text font-semibold text-sm">
          <span class="text-esi-blue italic">{{ room?.capacity || "N/A" }}</span>
          / 
          {{ room?.capacity || "N/A" }}
        </span> 
      </div>
    </RouterLink>
    <hr class="border-light-content w-full">
    <div>
      <span class="text-text text-sm font-medium">Surveillant : <span class="text-esi-blue italic font-semibold">{{ supervisor }}</span></span>
    </div>
    <hr class="border-light-content w-full">
    <div class="flex flex-col gap-2">
      <button 
        class="bg-red-600 text-button text-white py-2 px-3 rounded-button hover:bg-red-700 transition"
        @click="dissociateRoom"
        :class="{ 'cursor-not-allowed opacity-70': !room?.label || isDissociating }"
        :disabled="!room?.label || isDissociating"
      >
        {{ isDissociating ? 'Suppression...' : 'Supprimer' }}
      </button>
    </div>
  </div>
</template>