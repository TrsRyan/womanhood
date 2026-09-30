import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import Root, { HydrateFallback } from './Root.jsx'
import './index.css'
import App from './App.jsx'

// One document for the whole site: pages swap in place instead of
// reloading. Created once, outside React, as React Router requires.
// Archive is split into its own file, fetched only when it is visited.
const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    HydrateFallback,
    children: [
      { index: true, Component: App },
      {
        path: 'archive',
        lazy: async () => ({ Component: (await import('./Archive.jsx')).default }),
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
