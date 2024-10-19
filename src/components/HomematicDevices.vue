<script setup lang="ts">
import type { CuxdDeviceControl, GarageDeviceControl, HeatingDeviceControl, SwitchDeviceControl, Debmatic, ShutterDeviceControl } from './debmatic_api';
import {
  cuxd_control_ids,
  DeviceClass,
  extract_device_class,
  extract_device_classes,
  fetch_current_state,
  garage_control_ids,
  heating_control_ids,
  shutter_control_ids,
  switch_control_ids,
} from './debmatic_api';
import { onMounted, ref, shallowRef, watch } from 'vue';

import CuxdDevice from './CuxdDevice.vue';
import GarageDevice from './GarageDevice.vue';
import HeatingDevice from './HeatingDevice.vue';
import ShutterDevice from './ShutterDevice.vue';
import SwitchDevice from './SwitchDevice.vue';

import { mdiWindowShutter, mdiGarage, mdiFire, mdiPowerSocketDe } from '@mdi/js';

let debmatic_state = shallowRef<Debmatic>();

let shutter_devices = shallowRef<ShutterDeviceControl[]>();
let cuxd_devices = shallowRef<CuxdDeviceControl[]>();
let heating_devices = shallowRef<HeatingDeviceControl[]>();
let garage_devices = shallowRef<GarageDeviceControl[]>();
let switch_devices = shallowRef<SwitchDeviceControl[]>();

/** extract all devices from the given state */
function extract_state(state: Debmatic) {
  shutter_devices.value = shutter_control_ids(extract_device_classes(state, [DeviceClass.BROLL, DeviceClass.FROLL]));
  cuxd_devices.value = cuxd_control_ids(extract_device_class(state, DeviceClass.CUXD));
  garage_devices.value = garage_control_ids(extract_device_class(state, DeviceClass.GARAGE_DOOR));
  heating_devices.value = heating_control_ids(extract_device_classes(state, [DeviceClass.BWTH, DeviceClass.STHD]));
  switch_devices.value = switch_control_ids(extract_device_class(state, DeviceClass.PSM));
}

const panels = ref([
  {
    name: 'Shutter',
    component: ShutterDevice,
    devices: shutter_devices,
    icon: mdiWindowShutter,
  },
  {
    name: 'Switch',
    component: SwitchDevice,
    devices: switch_devices,
    icon: mdiPowerSocketDe,
  },
  {
    name: 'Cuxd',
    component: CuxdDevice,
    devices: cuxd_devices,
    icon: mdiPowerSocketDe,
  },
  {
    name: 'Heating',
    component: HeatingDevice,
    devices: heating_devices,
    icon: mdiFire,
  },
  {
    name: 'Garage',
    component: GarageDevice,
    devices: garage_devices,
    icon: mdiGarage,
  },
]);

watch(debmatic_state, (state) => {
  if (state != undefined) {
    extract_state(state);
  }
});

onMounted(async () => {
  debmatic_state.value = await fetch_current_state();
});
</script>

<template>
  <v-btn @click="fetch_current_state()">Reload</v-btn>
  <v-expansion-panels variant="accordion" v-for="panel in panels">
    <v-expansion-panel :title="panel.name">
      <!-- <v-icon :icon="panel.icon" /> -->
      <v-expansion-panel-text v-for="device in panel.devices">
        <component :is="panel.component" :device="device" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
