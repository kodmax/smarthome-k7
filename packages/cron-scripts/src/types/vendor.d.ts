declare module 'js-knx' {
  type DatapointValue = {
    value: any
  }

  type Datapoint = {
    read(): Promise<DatapointValue>
    write(value: any): Promise<void>
  }

  type KnxConnection = {
    getDatapoint(config: { address: string; DataType: any }): Datapoint
    disconnect(): Promise<void>
  }

  export const DPT_ActiveEnergy: any
  export const DPT_Date: any
  export const DPT_DateTime: any
  export const DPT_State: any
  export const DPT_Time: any
  export const DPT_Value_AirQuality: any
  export const DPT_Value_Humidity: any
  export const DPT_Value_Temp: any
  export const KnxLink: {
    connect(host: string, options?: { maxRetry?: number }): Promise<KnxConnection>
  }
}

declare module 'sony-bravia-ip-control' {
  export class IpControl {
    constructor(ip: string, secret: string)
    getPowerStatus(): Promise<{ status: string }>
    getCurrentExternalInputsStatus(): Promise<Array<{ status: string; uri: string }>>
    getPlayingContentInfo(): Promise<{ uri: string }>
    setPowerStatus(status: string): Promise<void>
  }
}
