<script setup lang="ts">
import { cuxd_control_ids, DeviceClass, extract_device_class, extract_device_classes, fetch_current_state, garage_control_ids, heating_control_ids, shutter_control_ids, switch_control_ids, type Debmatic } from './debmatic_api'
import { onMounted, ref, shallowRef, toRaw, watch } from 'vue';

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

watch(debmatic_state, (state) => {
    extract_state(state)
})

onMounted(async () => { debmatic_state.value = await fetch_current_state() })

</script>

<template>
    <div @click="fetch_current_state()">Reload</div>
    <div>Shutter
        <div v-for="shutter_device in shutter_devices">
            <div>{{ shutter_device }}</div>
        </div>
    </div>
    <div>PSM
        <div v-for="switch_device in switch_devices">
            <div>{{ switch_device }}</div>
        </div>
    </div>
    <div>CUXD
        <div v-for="cuxd_device in cuxd_devices">
            <div>{{ cuxd_device }}</div>
        </div>
    </div>
    <div>Heating
        <div v-for="heating_device in heating_devices">
            <div>{{ heating_device }}</div>
        </div>
    </div>
    <div>Garage
        <div v-for="garage_device in garage_devices">
            <div>{{ garage_device }}</div>
        </div>
    </div>
</template>
