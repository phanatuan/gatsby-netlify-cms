import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

class HomePage extends React.Component {
  render() {
    return (
      <Layout>
        <SEO title="Home" />
        <h1>This is a Home Page</h1>
      </Layout>
    )
  }
}

export default HomePage