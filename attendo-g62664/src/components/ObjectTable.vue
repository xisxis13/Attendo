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
  methods: {
    async handleDelete(itemId) { 
      if (this.onDelete) {
        const success = await this.onDelete(itemId);
        if (success) {
          if (this.objectType === 'session') {
            this.$emit('update:objectList', this.objectList.filter(item => item.id !== itemId));
          } else if (this.objectType === 'ue') {
            this.$emit('update:objectList', this.objectList.filter(item => item.ue !== itemId));
          }
        }
      }
    },
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
        <tr v-if="objectList.length === 0">
          <td :colspan="columns.length" v-if="objectType === 'session'" class="py-4 px-5 text-center text-text">
            Aucune session enregistrée
          </td>
          <td :colspan="columns.length" v-if="objectType === 'ue'" class="py-4 px-5 text-center text-text">
            Aucune UE enregistrée
          </td>
          <td :colspan="columns.length" v-if="objectType === 'etu'" class="py-4 px-5 text-center text-text">
            Aucun étudiant enregistré
          </td>
        </tr>

        <template v-else>
          <tr v-if="objectType === 'session'" v-for="item in objectList" :key="item.id" class="border-t border-border">
            <td class="py-2 px-5 flex items-center justify-between">
              <RouterLink 
                :to="linkTo.replace(':id', item.id)"
                class="text-esi-blue hover:underline"
              >
                {{ item.label }}
              </RouterLink>

              <Trash
                @click="handleDelete(item.id)" 
                class="w-5 h-5 text-text cursor-pointer hover:text-red-500"
              />
            </td>
          </tr>

          <tr v-if="objectType === 'ue'" v-for="item in objectList" :key="item.ue" class="border-t border-border">
            <td class="py-2 px-5 flex items-center justify-between">
              <RouterLink 
                :to="linkTo.replace(':id', item.ue)"
                class="text-esi-blue hover:underline"
              >
                {{ item.ue }}
              </RouterLink>

              <Trash
                @click="handleDelete(item.ue)"
                class="w-5 h-5 text-text cursor-pointer hover:text-red-500"
              />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>