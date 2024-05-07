import React from 'react'
import { Layout } from 'antd'

import MovieList from '../MovieList/MovieList'

import './MovieContent.css'

export default function MovieContent({
  searchQuery,
  currentPage,
  onTotalResults,
  guestSessionId,
  headerCurrentTab,
  movieRatings,
  updateMovieRating,
}) {
  const { Content } = Layout
  return (
    <Content className="content">
      <MovieList
        searchQuery={searchQuery}
        currentPage={currentPage}
        onTotalResults={onTotalResults}
        guestSessionId={guestSessionId}
        headerCurrentTab={headerCurrentTab}
        movieRatings={movieRatings}
        updateMovieRating={updateMovieRating}
      />
    </Content>
  )
}
