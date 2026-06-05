import { styled } from '@mui/material'
import type { FC } from 'react'

function hsl (deg: number): string {
    return `hsl(${deg}deg 100% 50%`
}
export type ColorIndicationRange = {
    optimal?: number
    higest?: number
    lowest?: number
    below?: number
    above?: number
    reverse?: boolean
}

const Indicator = styled('span')({
    margin: '0 0.5em 0.1666em 0',
    verticalAlign: 'middle',
    display: 'inline-block',
    height: '0.333em',
    width: '0.333em'
})

function chooseColor (instant: number, { lowest, below, optimal, above, higest, reverse }: ColorIndicationRange): string {
    if (optimal !== undefined) {
        if (instant > optimal && higest !== undefined) {
            return instant > higest ? hsl(reverse ? 240 : 0) : hsl(120 - (instant - optimal) / (higest - optimal) * (reverse ? -120 : 120))

        } else if (instant < optimal && lowest !== undefined) {
            return instant < lowest ? hsl(reverse ? 0 : 240) : hsl(120 + (optimal - instant) / (optimal - lowest) * (reverse ? -120 : 120))

        } else {
            return hsl(120)
        }

    } else if (below !== undefined) {
        return instant < below ? hsl(120) : hsl(reverse ? 240 : 0)

    } else if (above !== undefined) {
        return instant > above ? hsl(120) : hsl(reverse ? 0 : 240)

    } else {
        return 'inherit'
    }
}

export const ColorIndicator: FC<{ instant: number; range: ColorIndicationRange }> = ({ instant, range }) => {
    if (range.optimal === undefined && range.below === undefined && range.above === undefined) {
        return <span></span>

    } else {
        return <Indicator style={{ backgroundColor: chooseColor(instant, range) }} />
    }
}
