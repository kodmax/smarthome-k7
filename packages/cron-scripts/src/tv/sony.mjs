#!/usr/bin/node
import { IpControl } from "sony-bravia-ip-control";
import { requireEnv } from "#config/env"

const test = async (sony) => {
    const power = await sony.getPowerStatus()

    if (power.status === "active") {
        const inputs = await sony.getCurrentExternalInputsStatus()
        const content = await sony.getPlayingContentInfo()
    
        const input = inputs.find(input => input.uri === content.uri)
        
        if (input.status === "false") {
            console.log("Turning off Sony TV because no signal detected")
            await sony.setPowerStatus("standby")
        }
    }
}

test(new IpControl(requireEnv("SONY_TV_IP"), requireEnv("SONY_TV_SECRET")))
