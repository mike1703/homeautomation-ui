<script setup lang="ts">
import { cuxd_control_ids, DeviceClass, extract_device_class, extract_device_classes, fetch_current_state, garage_control_ids, heating_control_ids, shutter_control_ids, switch_control_ids, type Debmatic } from './debmatic_api'
import { onMounted, ref, shallowRef, watch } from 'vue';

import CuxdDevice from './CuxdDevice.vue';
import GarageDevice from './GarageDevice.vue';
import HeatingDevice from './HeatingDevice.vue';
import ShutterDevice from './ShutterDevice.vue';
import SwitchDevice from './SwitchDevice.vue';

let debmatic_state = shallowRef({} as Debmatic)

let shutter_devices = ref()
let cuxd_devices = ref()
let heating_devices = ref()
let garage_devices = ref()
let switch_devices = ref()

/** extract all devices from the given state */
function extract_state(state: Debmatic) {
    shutter_devices.value = shutter_control_ids(extract_device_classes(state, [DeviceClass.BROLL, DeviceClass.FROLL]));
    cuxd_devices.value = cuxd_control_ids(extract_device_class(state, DeviceClass.CUXD))
    garage_devices.value = garage_control_ids(extract_device_class(state, DeviceClass.GARAGE_DOOR))
    heating_devices.value = heating_control_ids(extract_device_classes(state, [DeviceClass.BWTH, DeviceClass.STHD]))
    switch_devices.value = switch_control_ids(extract_device_class(state, DeviceClass.PSM))
}

const panels = ref([
    { name: 'Shutter', component: ShutterDevice, devices: shutter_devices },
    { name: 'Switch', component: SwitchDevice, devices: switch_devices },
    { name: 'Cuxd', component: CuxdDevice, devices: cuxd_devices },
    { name: 'Heating', component: HeatingDevice, devices: heating_devices },
    { name: 'Garage', component: GarageDevice, devices: garage_devices }
])

watch(debmatic_state, (state) => {
    extract_state(state)
})

onMounted(async () => { debmatic_state.value = await fetch_current_state() })

</script>

<template>
    <v-btn @click="fetch_current_state()">Reload</v-btn>
    <v-expansion-panels variant="accordion" v-for="panel in panels">
        <v-expansion-panel :title="panel.name">
            <v-expansion-panel-text v-for="device in panel.devices">
                <component :is="panel.component" :device="device" />
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
