<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { currentUser } from '../data/dashboard'

defineProps<{ authenticated: boolean }>()
const emit = defineEmits<{ (e: 'open-profile'): void; (e: 'sign-in'): void }>()

const { theme, setTheme } = useTheme()
</script>

<template>
  <header class="app-header">
    <div class="brand">
      <span class="mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26">
          <path d="M4 13l6-6v4h8l-6 6v-4z" fill="currentColor" />
        </svg>
      </span>
      <span class="brand-name">Fastforward</span>
    </div>

    <div class="actions">
      <div class="theme-toggle" role="group" aria-label="Colour theme">
        <button
          type="button"
          :class="{ active: theme === 'light' }"
          :aria-pressed="theme === 'light'"
          @click="setTheme('light')"
        >
          <span aria-hidden="true">☀</span> Light
        </button>
        <button
          type="button"
          :class="{ active: theme === 'dark' }"
          :aria-pressed="theme === 'dark'"
          @click="setTheme('dark')"
        >
          <span aria-hidden="true">☾</span> Dark
        </button>
      </div>

      <button v-if="authenticated" type="button" class="profile-btn" @click="emit('open-profile')">
        <span class="avatar" aria-hidden="true">{{ currentUser.initials }}</span>
        <span class="profile-meta">
          <span class="profile-name">{{ currentUser.name }}</span>
          <span class="profile-role">{{ currentUser.role }}</span>
        </span>
      </button>
      <button v-else type="button" class="signin-btn" @click="emit('sign-in')">Sign in</button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.4rem 0 1.6rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: var(--brand-contrast);
  background: linear-gradient(135deg, var(--brand-orange), var(--brand-magenta));
  box-shadow: 0 8px 20px -8px var(--brand-orange);
}

.brand-name {
  font-weight: 800;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.theme-toggle {
  display: inline-flex;
  padding: 4px;
  gap: 2px;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1px solid var(--border);
}

.theme-toggle button {
  border: 0;
  background: transparent;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.82rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  transition: all 0.25s var(--ease);
}

.theme-toggle button.active {
  background: var(--brand);
  color: var(--brand-contrast);
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.35rem 0.9rem 0.35rem 0.4rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  transition:
    transform 0.25s var(--ease),
    border-color 0.25s var(--ease),
    box-shadow 0.25s var(--ease);
}

.profile-btn:hover {
  transform: translateY(-2px);
  border-color: var(--brand);
  box-shadow: var(--shadow-elevated);
}

.avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-weight: 800;
  font-size: 0.85rem;
  color: #fff;
  background: linear-gradient(135deg, var(--brand-purple), var(--brand-blue));
}

.profile-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}

.profile-name {
  font-weight: 700;
  font-size: 0.85rem;
}

.profile-role {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.signin-btn {
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  border: 0;
  font-weight: 700;
  color: var(--brand-contrast);
  background: var(--brand);
}

@media (max-width: 560px) {
  .profile-meta {
    display: none;
  }
}
</style>
