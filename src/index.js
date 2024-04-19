import React from 'react'
import ReactDOM from 'react-dom/client'
// import { Alert } from 'antd'
// import { Offline, Online } from 'react-detect-offline'

import App from './components/App'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
//   <>
//     <Online>
//       <App className="app" />
//     </Online>
//     <Offline>
//       <div className="offline">
//         <Alert type="error" message={`Отсутствует соединение с интернетом`} showIcon />
//       </div>
//     </Offline>
//   </>
// )
