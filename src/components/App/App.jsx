import React, { Component } from 'react'
import { Layout } from 'antd'

import Header from '../Header'
import MovieContent from '../MovieContent'
import Footer from '../Footer'
import './App.css'

// console.log(MovieService)

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <Layout className="layoutStyle">
        <Header />
        <MovieContent />
        <Footer />
      </Layout>
    )
  }
}
