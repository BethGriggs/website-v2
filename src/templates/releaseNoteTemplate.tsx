import { graphql } from 'gatsby'
import React from 'react'

import Layout from '../components/Layout'
import Seo from '../components/Seo'

export default function Template ({ data, pageContext }) {
  const { allReleaseNotes } = data // data.allReleaseNotes holds our data
  const releaseNotes = allReleaseNotes.edges
  return (
    <Layout>
      <Seo title={`Release Notes - ${pageContext.version}`} />
      <section className='py-5 container'>
        <div className='row py-lg-5'>
          <div className='col-lg-8 col-md-8 mx-auto'>
          <h1 className='fw-light'>{`Release Notes - ${pageContext.version}`}</h1>
        </div>
        <div className="p-5 text-center">
          <table className='table text-start table-sm table-striped align-middle table-hover'>
            <thead className='table-dark'>
              <tr>
                <th scope='col'>Issue</th>
                <th scope='col'>Component</th>
                <th scope='col'>Priority</th>
                <th scope='col'>Title</th>
              </tr>
            </thead>
            <tbody>
              {releaseNotes.map(
                (issue, i): string | JSX.Element =>
                  issue && (
                    <tr>
                      <td><a target='_blank' rel='noopener noreferrer' href={issue.node.link}>{issue.node.id}</a></td>
                      {
                        issue.node.component.length ? issue.node.component.map((component) =>
                        (<td> {component.name}/{issue.node.subcomponent} </td>)) : '/'
                      }
                      <td>{issue.node.priority}</td>
                      <td>{issue.node.title}</td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($version: String!, $language: String!) {
    allReleaseNotes(filter: {version: {eq: $version}}, sort: {fields: id}) {
      edges {
        node {
          id
          title
          link
          priority
          component {
            name
          }
          subcomponent
        }
      }
    }
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
