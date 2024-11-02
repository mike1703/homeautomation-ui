<script setup lang="ts">
import type { CuxdDeviceControl, GarageDeviceControl, HeatingDeviceControl, SwitchDeviceControl, ShutterDeviceControl, Device } from './debmatic_api';
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
import { onMounted, ref, shallowRef } from 'vue';

import CuxdDevice from './CuxdDevice.vue';
import GarageDevice from './GarageDevice.vue';
import HeatingDevice from './HeatingDevice.vue';
import ShutterDevice from './ShutterDevice.vue';
import SwitchDevice from './SwitchDevice.vue';

import { mdiWindowShutter, mdiGarage, mdiFire, mdiPowerSocketDe } from '@mdi/js';

let all_devices = shallowRef<Device[]>();

let shutter_devices = ref<ShutterDeviceControl[]>();
let cuxd_devices = ref<CuxdDeviceControl[]>();
let heating_devices = ref<HeatingDeviceControl[]>();
let garage_devices = ref<GarageDeviceControl[]>();
let switch_devices = ref<SwitchDeviceControl[]>();

/** extract all devices from the given state */
function extract_state(all_devices: Device[]) {
  shutter_devices.value = shutter_control_ids(extract_device_classes(all_devices, [DeviceClass.BROLL, DeviceClass.FROLL]));
  cuxd_devices.value = cuxd_control_ids(extract_device_class(all_devices, DeviceClass.CUXD));
  garage_devices.value = garage_control_ids(extract_device_class(all_devices, DeviceClass.GARAGE_DOOR));
  heating_devices.value = heating_control_ids(extract_device_classes(all_devices, [DeviceClass.BWTH, DeviceClass.STHD]));
  switch_devices.value = switch_control_ids(extract_device_class(all_devices, DeviceClass.PSM));
}

async function refresh() {
  const debmatic_state = await fetch_current_state();
  if (debmatic_state) {
    all_devices.value = debmatic_state.stateList.device;
    extract_state(all_devices.value);
  }
}

onMounted(async () => { refresh() });
</script>

<template>
  <v-btn @click="refresh">Reload</v-btn>
  <v-expansion-panels variant="accordion">
    <v-expansion-panel title="Shutter">
      <!-- <v-icon icon="mdiWindowShutter" /> -->
      <v-expansion-panel-text>
        <template v-for="device in shutter_devices">
          <ShutterDevice :device="device" />
        </template>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel title="Switch">
      <!-- <v-icon icon="mdiPowerSocketDe" /> -->
      <v-expansion-panel-text>
        <template v-for="device in switch_devices">
          <SwitchDevice :device="device" />
        </template>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel title="Cuxd">
      <!-- <v-icon icon="mdiPowerSocketDe" /> -->
      <v-expansion-panel-text>
        <template v-for="device in cuxd_devices">
          <CuxdDevice :device="device" />
        </template>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel title="Heating">
      <!-- <v-icon icon="mdiFire" /> -->
      <v-expansion-panel-text>
        <template v-for="device in heating_devices">
          <HeatingDevice :device="device" />
        </template>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel title="Garage">
      <!-- <v-icon icon="mdiGarage" /> -->
      <v-expansion-panel-text>
        <template v-for="device in garage_devices">
          <GarageDevice :device="device" />
        </template>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
