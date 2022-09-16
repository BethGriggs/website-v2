import { graphql } from 'gatsby'
import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import Layout from '../components/Layout'
import Seo from '../components/Seo'

const { SearchBar } = Search;

export default function Template ({ data, pageContext }) {
  const { allReleaseNotes } = data // data.allReleaseNotes holds our data
  const releaseNotes = allReleaseNotes.edges

  const columns = [{
    dataField: 'node.link',
    text: 'Issue',
    formatter: (cell, row) => (
      <a href={row.node.link}>{row.node.id}</a>
    ),
    sort: true
  }, {
    dataField: 'node.subcomponent',
    text: 'Component',
    sort: true
  }, {
    dataField: 'node.priority',
    text: 'Priority',
    sort: true
  }, {
    dataField: 'node.title',
    text: 'Title'
  }];

  return (
    <Layout>
      <Seo title={`Release Notes - ${pageContext.version}`} />
      <section className='py-5 container-xxl'>
        <h1 className='fw-light text-center'>{`Release Notes - ${pageContext.version}`}</h1>
   
        <ToolkitProvider
          keyField='node.id'
          data={ releaseNotes }
          columns={ columns }
          search
        >
          {
            props => (
              <>
                <div className="p-5">
                  <SearchBar className="" { ...props.searchProps } />
                  <BootstrapTable striped hover bodyClasses="text-nowrap" pagination={ paginationFactory() } { ...props.baseProps } />
                </div>
              </>
            )
          }
        </ToolkitProvider>
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
