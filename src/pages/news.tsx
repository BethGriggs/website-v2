import React, { MutableRefObject, useRef } from 'react';
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import { graphql } from 'gatsby'
import moment from 'moment';

import Layout from '../components/Layout'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import { fetchNewsItems, useOnScreen } from '../hooks';

const NewsPage = (): JSX.Element => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isVisible = useOnScreen(ref as MutableRefObject<Element>, true);
  const [news, events] = fetchNewsItems(isVisible);

  return (
    <Layout>
      <PageHeader title='News & Events' subtitle='Follow the latest updates from the Eclipse Adoptium Project' />
      <section className='text-center container-flex'>
        <div className='row py-lg-5 w-75 m-auto'>
          <div ref={ref} className='row pt-5'>
            <div className='col-md-5 text-start'>
              <h2>News</h2>
              {news && news.map(
                (item, i) =>
                  item && (
                    <div key={item.id}>
                      <h5><a target='_blank' rel='noreferrer' href={item.link}>{item.title}</a></h5>
                      <p className='m-0 fw-bold'>{moment(item.date).format('D MMMM YYYY')}</p>
                      <p className='text-muted lh-sm'>{item.body}</p>
                    </div>
                  )
              )}
            </div>
            <div className='col-md-1' />
            <div className='col-md-6'>
              <h2>Upcoming Events</h2>
              <Timeline position='alternate'>
                {events && events.map(
                  (item, i) =>
                    item && (
                      <TimelineItem key={item.id}>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: '12px', px: 2 }}>
                          <p className='text-muted lh-1'>{moment(item.date).format('D MMMM YYYY')}</p>
                          <h6 className='fw-bold'>
                            <a target='_blank' rel='noreferrer' href={item.infoLink}>{item.title}</a>
                          </h6>
                          <p className='fw-light lh-1'
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 5,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {item.description}
                          </p>
                        </TimelineContent>
                      </TimelineItem>
                    )
                )}
              </Timeline>
              <a href="https://events.eclipse.org/" target='_blank' rel='noreferrer' className='px-2'>View all</a>
              |
              <a href="https://newsroom.eclipse.org/node/add/events" target='_blank' rel='noreferrer' className='px-2'>Submit an event</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NewsPage

export const Head = () => (
  <Seo title='News & Events' />
)

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
