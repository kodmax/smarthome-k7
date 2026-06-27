import {
  DPT_ActiveEnergy,
  DPT_Alarm,
  DPT_HVACMode,
  DPT_Value_AirQuality,
  DPT_Value_Humidity,
  DPT_Value_Power,
  DPT_Value_Temp,
  DPT_State,
} from 'js-knx'

export const knxSchema = {
  home: {
    airQuality: {
      co2: {
        reading: { address: '2/3/3', DataType: DPT_Value_AirQuality },
        alert: { address: '2/5/1', DataType: DPT_Alarm },
      },
      humidity: {
        reading: { address: '2/3/5', DataType: DPT_Value_Humidity },
      },
    },
    energy: {
      consumption: {
        meterTotalReading: { address: '5/2/3', DataType: DPT_ActiveEnergy },
        meter: { address: '5/2/2', DataType: DPT_ActiveEnergy },
      },
      powerDraw: { address: '5/0/1', DataType: DPT_Value_Power },
    },
    heating: {
      bathroom: {
        waterHeating: { address: '2/7/7', DataType: DPT_State },
        floorHeating: { address: '2/7/10', DataType: DPT_State },
        hvacMode: { address: '2/1/4', DataType: DPT_HVACMode },
      },
      bedroom: {
        waterHeating: { address: '2/7/5', DataType: DPT_State },
        hvacMode: { address: '2/2/4', DataType: DPT_HVACMode },
      },
      livingRoom: {
        waterHeating: { address: '2/7/1', DataType: DPT_State },
        hvacMode: { address: '2/0/4', DataType: DPT_HVACMode },
      },
    },
    temp: {
      bathroom: {
        reading: { address: '2/3/8', DataType: DPT_Value_Temp },
        setpoint: { address: '2/1/0', DataType: DPT_Value_Temp },
      },
      bathroomFloor: {
        reading: { address: '2/3/1', DataType: DPT_Value_Temp },
      },
      bedroom: {
        reading: { address: '2/3/9', DataType: DPT_Value_Temp },
        setpoint: { address: '2/2/0', DataType: DPT_Value_Temp },
      },
      livingRoom: {
        reading: { address: '2/3/11', DataType: DPT_Value_Temp },
        setpoint: { address: '2/0/0', DataType: DPT_Value_Temp },
      },
    },
  },
}
