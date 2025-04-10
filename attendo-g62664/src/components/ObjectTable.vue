<script>
import { RouterLink } from 'vue-router';
import { Trash } from 'lucide-vue-next';

export default {
  components: {
    RouterLink,
    Trash,
  },
  props: {
    objectList: {
      type: Array,
      required: true,
      default: () => [],
    },
    columns: {
      type: Array,
      required: true,
      default: () => [],
    },
    linkTo: {
      type: String,
      required: false,
      default: null,
    },
    onDelete: {
      type: Function,
      required: false,
      default: null,
    },
    objectType: {
      type: String,
      default: true,
    },
  },
  mounted() {
    // Debug - afficher la liste d'objets pour vérifier
    console.log(`ObjectTable - ${this.objectType} data:`, this.objectList);
  },
  methods: {
    async handleDelete(itemId) { 
      if (this.onDelete) {
        const success = await this.onDelete(itemId);
        if (success) {
          if (this.objectType === 'session') {
            this.$emit('update:objectList', this.objectList.filter(item => item.id !== itemId));
          } else if (this.objectType === 'ue') {
            this.$emit('update:objectList', this.objectList.filter(item => item.ue !== itemId));
          } else if (this.objectType === 'event') {
            this.$emit('update:objectList', this.objectList.filter(item => item.id !== itemId));
          }
        }
      }
    },
    // Méthode pour récupérer la valeur à afficher en fonction du type d'objet
    getDisplayValue(item) {
      if (this.objectType === 'event') {
        return item.label; // Assurez-vous que les événements ont une propriété 'label'
      } else if (this.objectType === 'ue') {
        return item.ue;
      } else if (this.objectType === 'session') {
        return item.label;
      }
      // Fallback - essayer de trouver une propriété utilisable
      return item.label || item.ue || item.name || item.id || 'Sans nom';
    },
    // Méthode pour récupérer l'ID de l'item
    getItemId(item) {
      if (this.objectType === 'ue') {
        return item.ue;
      }
      return item.id;
    }
  },
};
</script>

<template>
  <div class="bg-box w-full rounded-xl border border-border overflow-hidden">
    <table class="w-full">
      <thead class="w-full bg-background">
        <tr class="border-b border-border">
          <th v-for="column in columns" :key="column.key" class="px-5 py-4 text-left">
            {{ column.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!objectList || objectList.length === 0">
          <td :colspan="columns.length" class="py-4 px-5 text-center text-text">
            Aucun {{ 
              objectType === 'session' ? 'session' : 
              objectType === 'ue' ? 'UE' : 
              objectType === 'event' ? 'épreuve' : 'élément' 
            }} enregistré
          </td>
        </tr>

        <template v-else>
          <tr v-for="item in objectList" :key="getItemId(item)" class="border-t border-border">
            <td class="py-2 px-5 flex items-center justify-between">
              <RouterLink 
                :to="linkTo ? linkTo.replace(':id', getItemId(item)) : '#'"
                class="text-esi-blue hover:underline"
              >
                {{ getDisplayValue(item) }}
              </RouterLink>

              <Trash
                v-if="onDelete"
                @click="handleDelete(getItemId(item))"
                class="w-5 h-5 text-text cursor-pointer hover:text-red-500"
              />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>