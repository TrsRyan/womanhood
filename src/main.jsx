import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import Root from './Root.jsx'
import './index.css'
import App from './App.jsx'
import Archive from './Archive.jsx'

// One document for the whole site: pages swap in place instead of
// reloading. Created once, outside React, as React Router requires.
const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: App },
      { path: 'archive', Component: Archive },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
