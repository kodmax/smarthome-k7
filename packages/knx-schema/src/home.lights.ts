import { DPT_State, DPT_Switch } from 'js-knx'

export type LightStatusDpt = 'switch' | 'state'

export type HomeLightCircuit = {
  id: string
  room: string
  set: { address: string; DataType: typeof DPT_Switch }
  status: { address: string; DataType: typeof DPT_State | typeof DPT_Switch }
  statusDpt: LightStatusDpt
}

const setGa = (address: string): HomeLightCircuit['set'] => ({
  address,
  DataType: DPT_Switch,
})

const statusGa = (address: string, statusDpt: LightStatusDpt): HomeLightCircuit['status'] => ({
  address,
  DataType: statusDpt === 'switch' ? DPT_Switch : DPT_State,
})

export const homeLights: HomeLightCircuit[] = [
  {
    id: 'dining_room_led_a',
    room: 'dining_room',
    set: setGa('14/2/1'),
    status: statusGa('14/2/2', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'dining_room_led_b',
    room: 'dining_room',
    set: setGa('14/2/6'),
    status: statusGa('14/2/7', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'dining_room_ceiling_lamp',
    room: 'dining_room',
    set: setGa('14/2/11'),
    status: statusGa('14/2/12', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'kitchen_led_a',
    room: 'kitchen',
    set: setGa('14/3/6'),
    status: statusGa('14/3/7', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'kitchen_led_b',
    room: 'kitchen',
    set: setGa('14/3/8'),
    status: statusGa('14/3/9', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'kitchen_lamp',
    room: 'kitchen',
    set: setGa('14/3/10'),
    status: statusGa('14/3/11', 'switch'),
    statusDpt: 'switch',
  },
  {
    id: 'bathroom_over_mirror_led',
    room: 'bathroom',
    set: setGa('14/4/2'),
    status: statusGa('14/4/3', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'bathroom_geberit_led',
    room: 'bathroom',
    set: setGa('14/4/8'),
    status: statusGa('14/4/7', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'bathroom_shower_led',
    room: 'bathroom',
    set: setGa('14/4/9'),
    status: statusGa('14/4/10', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'bathroom_mirror',
    room: 'bathroom',
    set: setGa('14/4/1'),
    status: statusGa('14/4/4', 'switch'),
    statusDpt: 'switch',
  },
  {
    id: 'hallway_entrance_led',
    room: 'hallway',
    set: setGa('14/5/2'),
    status: statusGa('14/5/3', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'hallway_window_led',
    room: 'hallway',
    set: setGa('14/5/4'),
    status: statusGa('14/5/5', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'hallway_bedroom_led',
    room: 'hallway',
    set: setGa('14/5/9'),
    status: statusGa('14/5/10', 'switch'),
    statusDpt: 'switch',
  },
  {
    id: 'hallway_storage_led',
    room: 'hallway',
    set: setGa('14/5/14'),
    status: statusGa('14/5/15', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'living_room_led_tv',
    room: 'living_room',
    set: setGa('14/6/9'),
    status: statusGa('14/6/10', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'living_room_led_sofa',
    room: 'living_room',
    set: setGa('14/6/11'),
    status: statusGa('14/6/12', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'living_room_ceiling_lamp_tv',
    room: 'living_room',
    set: setGa('14/6/13'),
    status: statusGa('14/6/14', 'switch'),
    statusDpt: 'switch',
  },
  {
    id: 'bedroom_bed_led',
    room: 'bedroom',
    set: setGa('14/7/3'),
    status: statusGa('14/7/4', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'bedroom_balcony_led',
    room: 'bedroom',
    set: setGa('14/7/5'),
    status: statusGa('14/7/6', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'bedroom_wardrobe_led',
    room: 'bedroom',
    set: setGa('14/7/8'),
    status: statusGa('14/7/9', 'state'),
    statusDpt: 'state',
  },
  {
    id: 'bedroom_ceiling',
    room: 'bedroom',
    set: setGa('14/7/15'),
    status: statusGa('14/7/16', 'switch'),
    statusDpt: 'switch',
  },
]

export const homeLightsById = Object.fromEntries(homeLights.map(circuit => [circuit.id, circuit])) as Record<
  string,
  HomeLightCircuit
>
