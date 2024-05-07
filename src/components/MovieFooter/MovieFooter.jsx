import React from 'react'
import { Layout, Pagination } from 'antd'

import './MovieFooter.css'

export default function MovieFooter({ onPageChange, currentPage, totalResults }) {
  const { Footer } = Layout
  if (totalResults === 0) {
    return null // Если результатов нет, не отображаем Footer
  }
  return (
    <Footer className="footer">
      <Pagination
        current={currentPage}
        total={totalResults}
        onChange={onPageChange}
        pageSize={20}
        showSizeChanger={false}
        showLessItems
        hideOnSinglePage
      />
    </Footer>
  )
}
