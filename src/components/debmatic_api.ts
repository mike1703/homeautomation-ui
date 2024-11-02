import axios from 'axios';
import { toRaw } from 'vue';
import xml2js from 'xml2js';

// created with https://jsonformatter.org/xml-to-typescript
export interface Debmatic {
  stateList: StateList;
}

interface StateList {
  device: Device[];
}

export interface Device {
  channel: ChannelElement[];
  name: string;
  ise_id: string;
  unreach?: string;
  config_pending?: string;
}

interface ChannelElement {
  name: string;
  ise_id: string;
  index: string;
  visible: string;
  operate: string;
  datapoint?: DatapointElement[];
}

interface DatapointElement {
  name: string;
  type: string;
  ise_id: string;
  value: string;
  valuetype: string;
  valueunit: Valueunit;
  timestamp: string;
  operations: string;
}

enum Valueunit {
  C = '°C',
  Empty = '',
  Hz = 'Hz',
  MA = 'mA',
  RF = '% rF',
  The100 = '100%',
  V = 'V',
  Valueunit = '%',
  W = 'W',
  Wh = 'Wh',
}

/** get the debmatic server from meta tag "debmatic_server", if not available use the current origin */
function get_debmatic_server_from_meta() {
  const element = document.head.querySelector('[name~=debmatic_server][content]');
  if (element instanceof HTMLMetaElement) {
    const debmatic_server = element.content;
    return `${debmatic_server}/config/xmlapi`;
  }
  return `${window.location.origin}/config/xmlapi`;
}

const debmatic_xmlapi = get_debmatic_server_from_meta();

export function fetch_current_state() {
  let host = `${debmatic_xmlapi}/statelist.cgi`;
  return axios
    .get(host)
    .then((axios_result) => {
      var parser = new xml2js.Parser({
        mergeAttrs: true,
        explicitArray: false,
      });
      return parser.parseStringPromise(axios_result.data);
    })
    .then((parsed) => {
      const debmatic: Debmatic = parsed;
      console.log(debmatic);
      return debmatic;
    });
}

export enum DeviceClass {
  BWTH = 'BWTH',
  STHD = 'STHD',
  PSM = 'PSM',
  FROLL = 'FROLL',
  BROLL = 'BROLL',
  CUXD = 'HM-LC-Sw1-Pl',
  GARAGE_DOOR = 'MOD-HO',
}

/** set the new state in the debmatic api */
export function set_new_state(control_id: number, new_value: any) {
  const url = `${debmatic_xmlapi}/statechange.cgi?ise_id=${control_id}&new_value=${new_value}`;
  console.log('device_control: ', url);
  return axios.get(url).then((axios_result) => {
    console.log(axios_result.data);
  });
}

/** returns boolean wether the `device_class` is in the `device_name` */
function is_device_class(device_name: string, device_class: DeviceClass) {
  let result = device_name.includes(device_class);
  return result;
}

/** extract a list of devices matching the `device_class` */
export function extract_device_class(all_devices: Device[], device_class: DeviceClass) {
  let filtered_devices = all_devices.filter((device) => is_device_class(device.name, device_class));
  return filtered_devices;
}

/** extract a list of devices matching one of the classes in the `device_classes */
export function extract_device_classes(all_devices: Device[], device_classes: DeviceClass[]) {
  return device_classes.flatMap((device_class) => extract_device_class(all_devices, device_class));
}

/** extract the name of the device (split of the device class that my devices have as prefix) */
function extract_device_name(device: Device) {
  // split of the _class part and return the rest
  const [_class, ...device_name] = device.name.split(' ');
  return device_name.join(' ');
}

/** parse a string as bool */
function parseBool(value: string) {
  if (value == 'true') {
    return true;
  } else if (value == 'false') {
    return false;
  } else {
    return undefined;
  }
}

/** has this object a name field */
function has_name(object: any) {
  return object.name != undefined;
}

export interface SwitchDeviceControl {
  name: string;
  id: number;
  value: boolean;
}

/** get ise_ids for the switch controls  */
export function switch_control_ids(switch_devices: Device[]) {
  const device_controls = switch_devices
    .map((device) => {
      const name = extract_device_name(device);
      const state_datapoint = device.channel.at(3)?.datapoint?.find((datapoint) => datapoint.type == 'STATE');
      const state_id = state_datapoint?.ise_id;
      const value = state_datapoint?.value;
      if (state_id == undefined || value == undefined) {
        return {};
      }
      return {
        name: name,
        id: parseInt(state_id),
        value: parseBool(value),
      } as SwitchDeviceControl;
    })
    .filter(has_name) as SwitchDeviceControl[];
  return device_controls;
}

export interface ShutterDeviceControl {
  name: string;
  stop_id: number;
  control_id: number;
  value: number;
}
/** get ise_ids for the shutter controls */
export function shutter_control_ids(shutter_devices: Device[]) {
  const device_controls = shutter_devices
    .map((device) => {
      const name = extract_device_name(device);
      const stop_datapoint = device.channel.at(4)?.datapoint?.find((datapoint) => datapoint.type == 'STOP');
      const level_datapoint = device.channel.at(4)?.datapoint?.find((datapoint) => datapoint.type == 'LEVEL');
      const stop_id = stop_datapoint?.ise_id;
      const control_id = device.channel.at(4)?.ise_id;
      const value = level_datapoint?.value;
      if (stop_id == undefined || control_id == undefined || value == undefined) {
        return {};
      }
      return {
        name: name,
        stop_id: parseInt(stop_id),
        control_id: parseInt(control_id),
        value: parseFloat(value),
      };
    })
    .filter(has_name) as ShutterDeviceControl[];
  return device_controls;
}

export interface GarageDeviceControl {
  name: string;
  door_command_id: number;
  value: number;
  command_value: number;
}

/** get ise_ids for the garage door */
export function garage_control_ids(garage_devices: Device[]) {
  const device_controls = garage_devices
    .map((device) => {
      const name = extract_device_name(device);
      const door_receiver_channel = device.channel.at(1);
      const door_command_datapoint = door_receiver_channel?.datapoint?.find(
        (datapoint) => datapoint.type == 'DOOR_COMMAND',
      );
      const door_command_id = door_command_datapoint?.ise_id;
      const door_command_value = door_command_datapoint?.value;
      const door_state_value = door_receiver_channel?.datapoint?.find(
        (datapoint) => datapoint.type == 'DOOR_STATE',
      )?.value;
      if (door_command_id == undefined || door_state_value == undefined || door_command_value == undefined) {
        return {};
      }
      return {
        name: name,
        door_command_id: parseInt(door_command_id),
        value: parseFloat(door_state_value),
        command_value: parseFloat(door_command_value),
      };
    })
    .filter(has_name) as GarageDeviceControl[];
  return device_controls;
}

export interface CuxdDeviceControl {
  name: string;
  control_id: number;
  value: boolean;
}

/** get ise_ids for the cuxd controls */
export function cuxd_control_ids(cuxd_devices: Device[]) {
  // this is different to the other devices as the actual devices are not in the device but channels
  const device_controls = cuxd_devices.flatMap((cuxd_device) => {
    // these are not channels but actual devices in each channel
    return (
      cuxd_device.channel
        .map((channel) => {
          const name = channel.name;
          const control_datapoint = channel.datapoint?.find((datapoint) => datapoint.type == 'STATE');
          const control_id = control_datapoint?.ise_id;
          const value = control_datapoint?.value;
          if (control_id == undefined || value == undefined) {
            return {};
          }
          return {
            name: name,
            control_id: parseInt(control_id),
            value: parseBool(value),
          };
        })
        // only return devices that are defined
        .filter(has_name) as CuxdDeviceControl[]
    );
  });
  return device_controls;
}

export interface HeatingDeviceControl {
  name: string;
  control_id: number;
  temperature_value: number;
  set_point_value: number;
}

/** get ise_ids for the heating devices */
export function heating_control_ids(heating_devices: Device[]) {
  const device_controls = heating_devices
    .map((device) => {
      const name = extract_device_name(device);
      const control_channel = device.channel.at(1);
      const set_point_datapoint = control_channel?.datapoint?.find(
        (datapoint) => datapoint.type == 'SET_POINT_TEMPERATURE',
      );
      const temperature_value = control_channel?.datapoint?.find(
        (datapoint) => datapoint.type == 'ACTUAL_TEMPERATURE',
      )?.value;
      const set_point_value = set_point_datapoint?.value;
      const control_id = set_point_datapoint?.ise_id;
      if (control_id == undefined || temperature_value == undefined || set_point_value == undefined) {
        return {};
      }
      return {
        name: name,
        control_id: parseInt(control_id),
        temperature_value: parseFloat(temperature_value),
        set_point_value: parseFloat(set_point_value),
      };
    })
    .filter(has_name) as HeatingDeviceControl[];
  return device_controls;
}
