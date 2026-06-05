import { Skill } from "."

const unwantedCompanies = [
    'FINN', 'Kalepa', 'ClickUp', 'Daytrip', 'Cavendish Professionals', 'HAYS Poland', 'DevsData LLC',
    'Evolution', 'L2BEAT', 'RemoDevs', 'Playbook', 'Guesty', 'ICEO', 'Codi', 'Ramp', 'Blackbird',
    'Sensor', 'Physitrack', 'Gibbs', 'Maxio', 'Focal', 'Yard', 'Adverity', 'Ntiative', 'Wildland',
    'Devire', 'Winged IT', 'Link Group', 'DCX'
]

export const noUnwantedCompanies: (company_name: string) => boolean = company_name =>
    unwantedCompanies.some(name => company_name.startsWith(name))

const unwantedSkills = [
    /^vue/i,
    /^angular/i,
    /^\.net/i,
    /^python/i,
    /^java$|^java /i,
    /^ruby/i,
    /^react native$/i,
    /^c#.*/i,
    /^kotlin/i,
    /^next\.js/i,
    /^gatsby/i,
    /^jquery/i,
    /^adobe/i,
    /^kuber/i,
    /^azure/i,
    /^google/i,
    /^golang/i,
    /^grails/i,
    /^elixir/i
]

export const noUwantedSkills: (skills: Skill[]) => boolean = skills => {
    return !skills.some(skill =>
        skill.level >= 2 && unwantedSkills.some(unwanted => unwanted.test(skill.name))
    )
}