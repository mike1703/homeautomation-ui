<script setup lang="ts">
import HomematicDevices from './components/HomematicDevices.vue';
</script>

<template>
  <v-app>
    <v-app-bar title="Homeautomation"></v-app-bar>
    <v-main>
      <v-container>
        <HomematicDevices />
      </v-container>
    </v-main>
  </v-app>
</template>
