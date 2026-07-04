declare module 'sony-bravia-ip-control' {
  export class IpControl {
    constructor(ip: string, secret: string)
    getPowerStatus(): Promise<{ status: string }>
    getCurrentExternalInputsStatus(): Promise<Array<{ status: string; uri: string }>>
    getPlayingContentInfo(): Promise<{ uri: string }>
    setPowerStatus(status: string): Promise<void>
  }
}
