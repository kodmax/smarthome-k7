#!/usr/bin/node
import { DPT_Reset, DPT_Trigger, KnxLink, DPT_ActiveEnergy } from 'js-knx'
import mariadb from "mariadb"
import { dbConfig } from "#config/db"
import { requireEnv } from "#config/env"

KnxLink.connect(requireEnv("KNX_HOST"), { maxRetry: 5 }).then(async knx => {
        // this script is executed everyday at 24:00
    try {
        const db = await mariadb.createConnection(dbConfig())
        const lastReading = await db.query('select date, total_reading from daily_energy_readings order by date desc limit 1')
        if (lastReading.length < 1) {
            throw new Error('Missing yesterdays entry')
        }

        const total = await knx.getDatapoint({ address: "5/2/3", DataType: DPT_ActiveEnergy }).read()
        const consumption = total.value - lastReading [0].total_reading

        await db.query('insert into daily_energy_readings (date, total_reading, daily_consumption) values (?, ?, ?)', [
            new Date(new Date().getTime() - new Date().getTimezoneOffset()*60000 -3600_000).toISOString().substring(0, 10),
            total.value,
            consumption
        ])
    
    } finally {
        await knx.disconnect()
    }
    
    process.exit(0)    
})
