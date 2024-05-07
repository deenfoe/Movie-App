import React, { Component } from 'react'
import { Layout, Input, Tabs } from 'antd'
import debounce from 'lodash.debounce'

import './MovieHeader.css'

export default class MovieHeader extends Component {
  tabItems = [
    { key: '1', label: 'Search' },
    { key: '2', label: 'Rated' },
  ]

  constructor(props) {
    super(props)
    this.state = {
      localSearchQuery: props.searchQuery,
    }
    this.debounceInputSearch = debounce(this.inputSearch, 500)
  }

  inputSearch = (value) => {
    const { onSearch } = this.props
    onSearch(value)
  }

  handleInputChange = (e) => {
    const { value } = e.target
    this.setState({ localSearchQuery: value })
    this.debounceInputSearch(value)
  }

  handleTabChange = (key) => {
    const { onTabChange } = this.props
    onTabChange(key)
  }

  render() {
    const { Header } = Layout
    const { headerCurrentTab } = this.props
    const { localSearchQuery } = this.state
    return (
      <Header className="header">
        <Tabs
          destroyInactiveTabPane
          defaultActiveKey="1"
          centered
          items={this.tabItems}
          onChange={this.handleTabChange}
        />
        {headerCurrentTab === '1' && (
          <Input placeholder="Поиск" onChange={this.handleInputChange} value={localSearchQuery} />
        )}
      </Header>
    )
  }
}
