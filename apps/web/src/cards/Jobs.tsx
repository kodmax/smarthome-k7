import styled from '@emotion/styled'
import { type FC } from 'react'
import ApolloCard, { ZoomContext } from '../apollo-card/ApolloCard'
import { useUpdate } from '@repo/feed-client'
import banner from './card-banners/job.jpg'
import LinkOpen from './components/LinkOpen'
import TablePlaceholder from './components/TablePlaceholder'

type Job = {
  skills: Array<{ name: string; level: number }>
  advert_url: string
  salary: {
    currency?: 'pln' | 'usd' | 'eur'
    from?: number
    to?: number

    plnFrom: number
    plnTo: number
  }
  title: string
  id: string

  company_logo_url?: string
  company_name: string
}

const Logo = styled('img')({
  height: '0.5em',
})

const Company = styled('td')({
  width: '3em',
  textAlign: 'center',
})

const Open = styled('td')({
  padding: '0 1em 0.25em',
  verticalAlign: 'middle',
  boxSizing: 'border-box',
  width: '3em',
})

const JobTitle = styled('td')({
  textOverflow: 'ellipsis',
})

const Salary = styled('td')({
  width: '6em',
})

const SkillsList = styled('ul')({
  display: 'inline-block',
  padding: 0,
  margin: '0 1rem',
})

const Skill = styled('li')<{ level: number }>(({ level }) => ({
  display: 'inline-block',
  backgroundColor: '#f0f0f0',
  color: `rgba(0, 0, 0, ${Number(Math.pow(level / 5, 2)).toFixed(2)})`,
  fontSize: '0.3em',
  padding: '2px',
  margin: '0 2px',
  verticalAlign: 'middle',
}))

const Jobs: FC<Record<string, never>> = () => {
  const [jobs, updatedAt] = useUpdate<{ list: Job[] }>('jobs')

  return (
    <ApolloCard cardId='jobs' banner={banner} updatedAt={updatedAt} height={6}>
      <ZoomContext.Consumer>
        {zoom =>
          !jobs ? (
            <TablePlaceholder rows={6} graph={true} value={true} />
          ) : (
            <>
              <table
                className='apollo-data-table'
                style={zoom.active ? { fontSize: '0.5em' } : { tableLayout: 'fixed', width: '100%' }}
              >
                <tbody>
                  {jobs.list.map(job => (
                    <tr key={job.id}>
                      <Company>
                        {' '}
                        {job.company_logo_url ? <Logo src={job.company_logo_url} /> : job.company_name}{' '}
                      </Company>
                      {!zoom.active ? null : (
                        <Open>
                          {' '}
                          <LinkOpen href={job.advert_url} />{' '}
                        </Open>
                      )}
                      <JobTitle>
                        {job.title}
                        {zoom.active ? (
                          <SkillsList>
                            {job.skills
                              .filter(skill => skill.level > 1)
                              .sort((a, b) => b.level - a.level)
                              .slice(0, 5)
                              .map(skill => (
                                <Skill key={skill.name} level={skill.level}>
                                  {skill.name}
                                </Skill>
                              ))}
                          </SkillsList>
                        ) : null}
                      </JobTitle>
                      <Salary>
                        {' '}
                        {Math.round(job.salary.plnFrom / 1000)}k — {Math.round(job.salary.plnTo / 1000)}k{' '}
                      </Salary>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )
        }
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}

export default Jobs
