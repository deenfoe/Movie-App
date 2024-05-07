import React, { Component } from 'react'
import { Typography, Rate, Flex, Tag, Alert } from 'antd'

import './MovieCard.css'
import MovieService from '../../services/MovieService'

const { Title, Paragraph } = Typography

export default class MovieCard extends Component {
  movieService = new MovieService()

  constructor(props) {
    super(props)
    this.state = {
      error: null,
    }
  }

  getGenreNames(genreIds, genres) {
    return genreIds
      .map((genreId) => {
        const genre = genres.find((g) => g.id === genreId)
        return genre ? genre.name : null
      })
      .filter(Boolean)
  }

  handleRatingChange = async (value) => {
    const { movie, guestSessionId, updateMovieRating } = this.props

    if (!guestSessionId) {
      return
    }
    try {
      await this.movieService.rateMovie(guestSessionId, movie.id, value)
      updateMovieRating(movie.id, value)
    } catch (error) {
      this.setState({ error: 'Ошибка при отправке рейтинга. Пожалуйста, попробуйте позже.' })
    }
  }

  render() {
    const { movie, userRating, genres } = this.props
    const { title, overview, imageUrl, formattedDate, voteAverage, genreIds } = movie
    const { error } = this.state

    let rateColor = ''
    if (voteAverage <= 3) rateColor = '#E90000'
    if (voteAverage > 3 && voteAverage <= 5) rateColor = '#E97E00'
    if (voteAverage > 5 && voteAverage <= 7) rateColor = '#E9D100'
    if (voteAverage > 7) rateColor = '#66E900'

    const genreNames = this.getGenreNames(genreIds, genres)

    if (genreNames.length === 0) {
      genreNames.push('No genres')
    }

    return (
      <article className="movie-card">
        <figure className="movie-image-container">
          <img className="movie-image" src={imageUrl} alt="Постер фильма" />
        </figure>
        <section className="movie-details">
          <div className="movie-details-header">
            <Title
              level={5}
              style={{ fontSize: title.length > 50 ? 13 : 16, marginBottom: title.length > 50 ? '0.3rem' : '0.5rem' }}
            >
              {title}
            </Title>
            <div
              className="movie-details-rating"
              style={{
                border: `2px solid ${rateColor}`,
              }}
            >
              {voteAverage}
            </div>
          </div>
          <Paragraph
            style={{ fontSize: '12px', color: '#827e7e', marginBottom: title.length > 50 ? '0.3rem' : '1rem' }}
          >
            {formattedDate}
          </Paragraph>
          <Flex wrap="wrap" gap="tiny">
            {genreNames.map((name) => (
              <Tag className="genre-label" key={name}>
                {name}
              </Tag>
            ))}
          </Flex>
        </section>
        <section className="movie-description">
          <Paragraph className="description-text">{overview}</Paragraph>
        </section>
        <div className="movie-rating">
          {!error ? (
            <Rate allowHalf defaultValue={userRating || 0} count={10} onChange={this.handleRatingChange} />
          ) : (
            <Alert type="error" message={error} showIcon />
          )}
        </div>
      </article>
    )
  }
}
