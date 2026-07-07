<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import ProfilePanel from './components/ProfilePanel.vue'
import { currentUser, type UserProfile } from './data/dashboard'

// Simulated authenticated session.
const authenticated = ref(true)
const user = ref<UserProfile>({ ...currentUser })
const profileOpen = ref(false)

function saveProfile(updated: UserProfile) {
  user.value = updated
  profileOpen.value = false
}
</script>

<template>
  <AppHeader
    :authenticated="authenticated"
    @open-profile="profileOpen = true"
    @sign-in="authenticated = true"
  />

  <RouterView />

  <ProfilePanel
    :open="profileOpen"
    :user="user"
    @close="profileOpen = false"
    @save="saveProfile"
  />
</template>

<style scoped></style>
