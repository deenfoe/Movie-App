import { Layout } from 'antd'

import MovieList from '../MovieList/MovieList'

import './MovieContent.css'

export default function MovieContent() {
  const { Content } = Layout
  return (
    <Content className="content">
      <MovieList />
    </Content>
  )
}
