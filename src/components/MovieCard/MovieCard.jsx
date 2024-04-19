import React, { Component } from 'react'
import { Typography, Rate, Flex, Tag } from 'antd'

import './MovieCard.css'
import img from '../../assets/images/Ellipse.png'

const { Title, Paragraph } = Typography

export default class MovieCard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { movie } = this.props
    const { title, overview, imageUrl, formattedDate } = movie

    return (
      <article className="movie-card">
        <figure className="border movie-image-container">
          <img className="movie-image" src={imageUrl} alt="Постер фильма" />
        </figure>
        <section className="border movie-details">
          <div className="movie-details-header">
            <Title
              level={5}
              style={{ fontSize: title.length > 50 ? 13 : 16, marginBottom: title.length > 50 ? '0.3rem' : '0.5rem' }}
            >
              {title}
            </Title>
            <div>
              <img src={img} alt="" />
            </div>
          </div>
          <Paragraph
            style={{ fontSize: '12px', color: '#827e7e', marginBottom: title.length > 50 ? '0.3rem' : '1rem' }}
          >
            {formattedDate}
          </Paragraph>
          <Flex wrap="wrap">
            <Tag className="genre-label">Action</Tag>
            <Tag className="genre-label">Drama</Tag>
          </Flex>
        </section>
        <section className="border movie-description">
          <Paragraph className="description-text">{overview}</Paragraph>
        </section>
        <div className="movie-rating">
          <Rate allowHalf defaultValue={2.5} count={10} />
        </div>
      </article>
    )
  }
}
