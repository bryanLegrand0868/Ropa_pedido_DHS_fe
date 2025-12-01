import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

export const MainLayout = () => {
    return (
        <>
            <Outlet />
            <Toaster position="top-center" reverseOrder={false} />
        </>
    )
}
