import { KnxLink } from 'js-knx'

export type KnxConnection = Awaited<ReturnType<typeof KnxLink.connect>>
