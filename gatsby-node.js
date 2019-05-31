const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const productPost = path.resolve(`./src/templates/product-template.js`)

  const resolveProduct = await graphql(`
    {
      allFile(filter: { sourceInstanceName: { eq: "product" } }) {
        edges {
          node {
            childMarkdownRemark {
              frontmatter {
                description
                product_image
                product_price
                title
                date
              }
              fields {
                slug
                }
            }
          }
        }
      }
    }
  `)

  if (resolveProduct.errors) {
    throw resolveProduct.errors
  }

  const products = resolveProduct.data.allFile.edges
  products.forEach(product => {
    createPage({
      path: `product${product.node.childMarkdownRemark.fields.slug}`,
      component: productPost,
      context: {
        slug: product.node.childMarkdownRemark.fields.slug,
      },
    })
  })

  return await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    return null
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
