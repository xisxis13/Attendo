<script>
import { RouterLink } from 'vue-router';
import { Trash2 } from 'lucide-vue-next';

export default {
  components: {
    RouterLink,
    Trash2,
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
    onTogglePresence: {
      type: Function,
      required: false,
      default: null,
    },
    objectType: {
      type: String,
      required: true,
    },
  },
  mounted() {
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
    async handleTogglePresence(student) {
      if (this.onTogglePresence) {
        await this.onTogglePresence(student);
      }
    },
    getDisplayValue(item, columnKey) {
      if (this.objectType === 'student') {
        return item[columnKey] || 'N/A';
      } else if (this.objectType === 'event') {
        return item.label;
      } else if (this.objectType === 'ue') {
        return item.ue;
      } else if (this.objectType === 'session') {
        return item.label;
      }
      return item.label || item.ue || item.name || item.id || 'No name';
    },
    getItemId(item) {
      if (this.objectType === 'ue') {
        return item.ue;
      } else if (this.objectType === 'student') {
        return item.student_id;
      }
      return item.id;
    },
  },
};
</script>

<template>
  <div class="bg-box dark:bg-dark-box w-full rounded-xl border border-border dark:border-dark-border overflow-hidden">
    <table class="w-full">
      <thead class="w-full bg-background dark:bg-dark-background">
        <tr class="border-b border-border dark:border-dark-border">
          <th v-for="column in columns" :key="column.key" class="px-5 py-4 text-left text-text dark:text-dark-text">
            {{ column.label }}
          </th>
          <th v-if="objectType === 'student'" class="px-5 py-4 text-left text-text dark:text-dark-text">Presence</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!objectList || objectList.length === 0">
          <td :colspan="columns.length + (objectType === 'student' ? 1 : 0)" class="py-4 px-5 text-center text-text dark:text-dark-text">
            Aucune {{
              objectType === 'session' ? 'session' :
              objectType === 'ue' ? 'UE' :
              objectType === 'event' ? 'épreuve' : 'élément'
            }} enregistrée
          </td>
        </tr>
        <tr
          v-for="item in objectList"
          :key="getItemId(item)"
          class="border-t border-border dark:border-dark-border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <td v-for="column in columns" :key="column.key" class="py-2 px-5">
            <template v-if="column.linkable">
              <div class="flex items-center justify-between">
                <RouterLink
                  :to="linkTo ? linkTo.replace(':id', getItemId(item)) : '#'"
                  class="text-esi-blue dark:text-esi-blue hover:underline flex-1"
                >
                  {{ getDisplayValue(item, column.key) }}
                </RouterLink>
                <Trash2
                  v-if="onDelete"
                  @click.stop="handleDelete(getItemId(item))"
                  class="w-5 h-5 text-text dark:text-dark-text cursor-pointer hover:text-red-500 dark:hover:text-red-500 ml-2 shrink-0"
                />
              </div>
            </template>
            <span v-else class="text-text dark:text-dark-text">{{ getDisplayValue(item, column.key) }}</span>
          </td>
          <td v-if="objectType === 'student'" class="py-2 px-5">
            <button
              @click="handleTogglePresence(item)"
              class="px-3 py-1 rounded-button"
              :class="item.isPresent ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
            >
              {{ item.isPresent ? 'Present(e)' : 'Absent(e)' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>