<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronRight } from 'lucide-vue-next';
import { sessionsService } from '@/services/sessionsService'; 
import { eventService } from '@/services/eventService';

export default {
  components: {
    ChevronRight,
  },
  setup() {
    const route = useRoute();
    const breadcrumbSegments = ref([]);

    const segments = async () => {
      const breadcrumb = [];

      console.log("params : ", route.params);

      breadcrumb.push(
        { path: '/', label: 'Accueil', },
        { path: '/sessions', label: 'Sessions', },
      );

      // /sessions/:sessionId/ue/:ueId/event/:eventId/room/:roomId

      if (route.params.sessionId) {
        const session = await sessionsService.getById(route.params.sessionId);

        breadcrumb.push(
          { 
            path: `/sessions/${session.id}`, 
            label: `${session.label}`,
          },
        );

        if (route.params.ueId) {
          breadcrumb.push(
            { 
              path: `/sessions/${session.id}/ue/${route.params.ueId}`, 
              label: `${route.params.ueId}`,
            },
          );

          if (route.params.eventId) {
            const event = await eventService.getById(route.params.eventId);
  
            breadcrumb.push(
              { 
                path: `/sessions/${session.id}/ue/${route.params.ueId}/event/${event.id}`, 
                label: `${event.label}`,
              },
            );          

            if (route.params.roomId) {
              breadcrumb.push(
                { 
                  path: `/sessions/${session.id}/ue/${route.params.ueId}/event/${event.id}/room/${route.params.roomId}`, 
                  label: `${route.params.roomId}`,
                },
              );          
            }
          }
        }
      }
      
      return breadcrumb;
    };

    onMounted(async () => {
      breadcrumbSegments.value = await segments();
    });

    return {
      breadcrumbSegments,
    };
  },
};
</script>

<template>
  <div class="w-full flex items-center text-light-text">
    <div class="flex items-center gap-2">
      <template v-for="(segment, index) in breadcrumbSegments" :key="segment.path">
        <router-link
          v-if="index < breadcrumbSegments.length - 1"
          :to="segment.path"
          class="hover:text-esi-blue transition-colors"
        >
          {{ segment.label }}
        </router-link>
        <span v-else class="font-medium text-text">{{ segment.label }}</span>

        <ChevronRight v-if="index < breadcrumbSegments.length - 1" class="w-4 h-4" />
      </template>
    </div>
  </div>
</template>