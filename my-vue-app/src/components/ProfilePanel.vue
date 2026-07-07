<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import type { UserProfile } from '../data/dashboard'

const props = defineProps<{ open: boolean; user: UserProfile }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'save', value: UserProfile): void }>()

const form = reactive<UserProfile>({ ...props.user })

watch(
  () => props.open,
  (open) => {
    if (open) Object.assign(form, props.user)
  },
)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) emit('close')
}

onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))

function initialsFrom(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function save() {
  emit('save', { ...form, initials: initialsFrom(form.name) })
}
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="overlay" @click.self="emit('close')">
      <div
        class="panel ff-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
      >
        <div class="panel-head">
          <h2 id="profile-title">Your account</h2>
          <button type="button" class="close" aria-label="Close" @click="emit('close')">✕</button>
        </div>

        <p class="panel-sub">Update the details shown across your Fastforward workspace.</p>

        <form @submit.prevent="save">
          <label>
            <span>Full name</span>
            <input v-model="form.name" type="text" autocomplete="name" required />
          </label>
          <label>
            <span>Role</span>
            <input v-model="form.role" type="text" required />
          </label>
          <label>
            <span>Email</span>
            <input v-model="form.email" type="email" autocomplete="email" required />
          </label>
          <label>
            <span>Company</span>
            <input v-model="form.company" type="text" required />
          </label>

          <div class="panel-actions">
            <button type="button" class="ghost" @click="emit('close')">Cancel</button>
            <button type="submit" class="primary">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: rgba(6, 8, 14, 0.6);
  backdrop-filter: blur(6px);
}

.panel {
  width: 100%;
  max-width: 440px;
  padding: 1.6rem;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.close {
  border: 0;
  background: var(--surface-2);
  color: var(--text-muted);
  width: 34px;
  height: 34px;
  border-radius: 10px;
  font-size: 0.9rem;
}

.panel-sub {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0.4rem 0 1.3rem;
}

form {
  display: grid;
  gap: 1rem;
}

label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
}

input {
  font-family: inherit;
  font-size: 0.95rem;
  padding: 0.7rem 0.85rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  transition: border-color 0.2s var(--ease);
}

input:focus {
  border-color: var(--brand);
}

.panel-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  margin-top: 0.6rem;
}

.panel-actions button {
  padding: 0.65rem 1.3rem;
  border-radius: var(--radius-sm);
  font-weight: 700;
  border: 1px solid var(--border);
}

.ghost {
  background: transparent;
  color: var(--text-muted);
}

.primary {
  border: 0;
  color: var(--brand-contrast);
  background: var(--brand);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s var(--ease);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
