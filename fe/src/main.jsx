import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
const App = lazy(() => import('./App.jsx'))
import 'react-lazy-load-image-component/src/effects/opacity.css'
import './css/bootstrap.css'
import './css/toastify.css'
import './css/index.css'
import Loader from './components/Loader'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <App />
    </Suspense>
  </React.StrictMode>
)
