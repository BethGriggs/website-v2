const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const createMultilingualRedirects = require('./i18n-redirects');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Create Asciidoc pages.
  const asciidocTemplate = path.resolve('./src/templates/asciidocTemplate.tsx')

  const asciidocResults = await graphql(`
    {
      allAsciidoc {
        edges {
          node {
            id
            fields {
              slug
            }
            parent {
              ... on File {
                relativePath
                absolutePath
              }
            }
          }
        }
      }
    }
  `)

  asciidocResults.data.allAsciidoc.edges.forEach(({ node }) => {
    const articleNodes = asciidocResults.data.allAsciidoc.edges
    createMultilingualRedirects(actions, articleNodes, node)
    // Create page for each asciidoc file
    createPage({
      path: node.fields.slug,
      component: asciidocTemplate,
      context: {
        id: node.id
      }
    })
  })

  const releaseNoteTemplate = path.resolve('./src/templates/releaseNoteTemplate.tsx')

  const releaseNoteResults = await graphql(`
    {
      allReleaseNotes {
        group(field: version) {
          distinct(field: version)
        }
      }
    }
  `)

  releaseNoteResults.data.allReleaseNotes.group.forEach(({ distinct }) => {
    // Create page for each release note version
    createPage({
      path: `/release-notes/${distinct.toString()}`,
      component: releaseNoteTemplate,
      context: {
        version: distinct.toString()
      }
    })
  })
}

exports.onCreateNode = async ({ node, actions, getNode, loadNodeContent }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'Asciidoc') {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: 'slug',
      node,
      value
    })
  }
}

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions;
  // List of versions to get release notes for
  const versions = ['openjdk8u342', '11.0.16', '17.0.4', '18.0.2']
  const baseUrl = 'https://bugs.openjdk.org/rest/api/latest';
  for (let version of versions) {
    const url = `${baseUrl}/search?jql=project=JDK AND fixVersion=${version}&maxResults=1000`;
    axios.get(url).then(res => {
      // map into these results and create nodes
      res.data.issues.map((issue) => {
        // Create your node object
        const releaseNoteNode = {
          // Required fields
          id: issue.key,
          parent: `__SOURCE__`,
          internal: {
            type: `ReleaseNotes`, // name of the graphQL query --> allReleaseNotes {}
            // contentDigest will be added just after
            // but it is required
          },
          children: [],
          version: issue.fields.fixVersions[0].name.replace('openjdk', ''), // remove openjdk prefix from 8u

          // Other fields that you want to query with graphQl
          title: issue.fields.summary,
          priority: issue.fields.priority.id,
          component: issue.fields.components,
          subcomponent: `${issue.fields.components[0].name}${issue.fields.customfield_10008?.name ? "/" + issue.fields.customfield_10008?.name : ''}`,
          link: `https://bugs.openjdk.org/browse/${issue.key}`,
          // etc... 
        }

        // Get content digest of node. (Required field)
        const contentDigest = crypto
          .createHash(`md5`)
          .update(JSON.stringify(releaseNoteNode))
          .digest(`hex`);
        // add it to userNode
        releaseNoteNode.internal.contentDigest = contentDigest;

        // Create node with the gatsby createNode() API
        createNode(releaseNoteNode);
      });
    }
  )};

  return;
}