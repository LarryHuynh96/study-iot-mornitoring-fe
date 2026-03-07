<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useMappingStore } from '@/stores/mappings'
import { useTable } from '@/composables/useTable'
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { formatDateTime } from '@/utils/format'
import type { MappingForm, Mapping } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'

const store = useMappingStore()

const { page, pageSize, search, refresh, handlePageChange, handleSizeChange } = useTable(
  async (params) => {
    await store.loadMappings(params)
  },
)

onMounted(() => {
  refresh()
})

// Dialog state
const dialogVisible = ref(false)
const dialogTitle = ref('Add Mapping')
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive<MappingForm>({
  machine_id: '',
  pad_ip: '',
  machine_ip: '',
})

const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/

const rules: FormRules = {
  machine_id: [{ required: true, message: 'Machine ID is required', trigger: 'blur' }],
  pad_ip: [
    { required: true, message: 'Pad IP is required', trigger: 'blur' },
    { pattern: ipPattern, message: 'Invalid IP address format', trigger: 'blur' },
  ],
  machine_ip: [
    { required: true, message: 'Machine IP is required', trigger: 'blur' },
    { pattern: ipPattern, message: 'Invalid IP address format', trigger: 'blur' },
  ],
}

function openAddDialog() {
  dialogTitle.value = 'Add Mapping'
  editingId.value = null
  form.machine_id = ''
  form.pad_ip = ''
  form.machine_ip = ''
  dialogVisible.value = true
}

function openEditDialog(row: Mapping) {
  dialogTitle.value = 'Edit Mapping'
  editingId.value = row.id
  form.machine_id = row.machine_id
  form.pad_ip = row.pad_ip
  form.machine_ip = row.machine_ip
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate()
  submitting.value = true
  try {
    if (editingId.value) {
      await store.editMapping(editingId.value, { ...form })
    } else {
      await store.addMapping({ ...form })
    }
    dialogVisible.value = false
    refresh()
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div v-loading="store.loading">
    <PageHeader
      title="Mapping Management"
      :breadcrumbs="[{ label: 'Dashboard', to: '/' }, { label: 'Mappings' }]"
    />

    <el-card shadow="hover">
      <div class="table-page__actions">
        <el-input
          v-model="search"
          placeholder="Search mappings..."
          clearable
          style="width: 280px"
          prefix-icon="el-icon-search"
        />
        <el-button type="primary" @click="openAddDialog">
          Add Mapping
        </el-button>
      </div>

      <el-table v-if="store.mappings.length" :data="store.mappings" stripe>
        <el-table-column prop="machine_id" label="Machine ID" min-width="140" />
        <el-table-column prop="pad_ip" label="Pad IP" min-width="140" />
        <el-table-column prop="machine_ip" label="Machine IP" min-width="140" />
        <el-table-column label="Created" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="Updated" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.updated_at) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEditDialog(row)">
              Edit
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <EmptyState v-else description="No mappings configured" />

      <div class="table-page__pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="store.total"
          layout="total, sizes, prev, pager, next"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="Machine ID" prop="machine_id">
          <el-input v-model="form.machine_id" placeholder="e.g. MC-001" />
        </el-form-item>
        <el-form-item label="Pad IP" prop="pad_ip">
          <el-input v-model="form.pad_ip" placeholder="e.g. 192.168.1.100" />
        </el-form-item>
        <el-form-item label="Machine IP" prop="machine_ip">
          <el-input v-model="form.machine_ip" placeholder="e.g. 192.168.1.101" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ editingId ? 'Update' : 'Create' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
