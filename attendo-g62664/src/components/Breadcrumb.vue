<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronRight } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

const breadcrumbSegments = computed(() => {
  const pathSegments = route.path.split('/').filter(segment => segment);

  const segments = [];

  segments.push({
    path: '/',
    label: 'Accueil',
  });

  let currentPath = '';

  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += `/${pathSegments[i]}`;

    const matchedRoute = router.getRoutes().find(r => r.path == currentPath);

    if (matchedRoute && matchedRoute.name) {
      if (route.params[pathSegments[i]]) {
        segments.push({
          path: currentPath,
          label: route.params[pathSegments[i]].toString(),
        });
      } else {
        const name = typeof matchedRoute.name === 'string' ? matchedRoute.name : pathSegments[i];
        segments.push({
          path: currentPath,
          label: name.charAt(0).toUpperCase() + name.slice(1),
        });
      }
    } else {
      segments.push({
        path: currentPath,
        label: pathSegments[i].charAt(0).toUpperCase() + pathSegments[i].slice(1),
      })
    }
  }

  return segments;
})
</script>

<template>
  <div class=" w-full flex items-center text-light-text">
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