import React, { Component } from 'react'
import { Layout } from 'antd'

import MovieHeader from '../MovieHeader'
import MovieContent from '../MovieContent'
import MovieFooter from '../MovieFooter'
import movieService from '../../services/MovieService'

import './App.css'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchQuery: '',
      currentPage: 1,
      headerCurrentTab: '1',
      movieRatings: {},
      totalResults: 0,
      guestSessionId: null,
    }
  }

  componentDidMount() {
    this.createGuestSession()
  }

  createGuestSession = async () => {
    let { guestSessionId } = this.state
    if (!guestSessionId) {
      guestSessionId = await movieService.createGuestSession()
      this.setState({ guestSessionId })
    }
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page })
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 })
  }

  handleTotalResults = (total) => {
    this.setState({ totalResults: total })
  }

  handleTabChange = (tabKey) => {
    const headerCurrentTab = tabKey
    this.setState({ headerCurrentTab })
  }

  updateMovieRating = (movieId, rating) => {
    this.setState((prevState) => ({
      movieRatings: {
        ...prevState.movieRatings,
        [movieId]: rating,
      },
    }))
  }

  render() {
    const { searchQuery, currentPage, totalResults, guestSessionId, headerCurrentTab, movieRatings } = this.state
    return (
      <Layout className="layoutStyle">
        <MovieHeader
          onSearch={this.handleSearch}
          searchQuery={searchQuery}
          onTabChange={this.handleTabChange}
          headerCurrentTab={headerCurrentTab}
        />
        <MovieContent
          searchQuery={searchQuery}
          currentPage={currentPage}
          onTotalResults={this.handleTotalResults}
          guestSessionId={guestSessionId}
          headerCurrentTab={headerCurrentTab}
          movieRatings={movieRatings}
          updateMovieRating={this.updateMovieRating}
        />
        <MovieFooter onPageChange={this.handlePageChange} currentPage={currentPage} totalResults={totalResults} />
      </Layout>
    )
  }
}
