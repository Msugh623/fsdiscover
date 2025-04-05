import React, { useLayoutEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const Admin = () => {
    // const navigate = useNavigate()
    useLayoutEffect(() => {
        // !localStorage.access && navigate(-1, { replace: true })
    }, [])

    return (
        <>
            <Outlet />
        </>
    )
}

export default Admin