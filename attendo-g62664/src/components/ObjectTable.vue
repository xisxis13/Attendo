<script>
import { RouterLink } from 'vue-router';
import { Trash } from 'lucide-vue-next';

export default {
  components: {
    RouterLink,
    Trash,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
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
    isSessions: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getColumnValue(item, columnKey) {
      return columnKey.split('.').reduce((obj, key) => obj?.[key], item) || 'N/A';
    },
    async handleDelete(itemId) {
      if (this.onDelete && this.isSessions) {
        const success = await this.onDelete(itemId);
        if (success) {
          this.$emit('update:objectList', this.objectList.filter(item => item.id !== itemId));
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
          <td :colspan="columns.length" class="py-4 px-5 text-center text-text">
            Aucun élément à afficher
          </td>
        </tr>
        <tr v-else v-for="item in objectList" :key="item.id" class="border-t border-border">
          <td v-for="column in columns" :key="column.key" class="py-2 px-5">
            <div v-if="isSessions && onDelete && column.linkable" class="flex items-center justify-between">
              <RouterLink
                v-if="linkTo"
                :to="linkTo.replace(':id', item.id)"
                class="text-esi-blue hover:underline"
              >
                {{ getColumnValue(item, column.key) }}
              </RouterLink>
              <Trash
                @click="handleDelete(item.id)"
                class="w-5 h-5 text-text cursor-pointer hover:text-red-500"
              />
            </div>
            <RouterLink
              v-else-if="linkTo && column.linkable"
              :to="linkTo.replace(':id', item.id)"
              class="text-esi-blue hover:underline"
            >
              {{ getColumnValue(item, column.key) }}
            </RouterLink>
            <span v-else>
              {{ getColumnValue(item, column.key) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>