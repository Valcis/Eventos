import { createBrowserRouter } from 'react-router-dom'
import EventsListPage from '../features/events/pages/EventsListPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <EventsListPage />,
    },
])
