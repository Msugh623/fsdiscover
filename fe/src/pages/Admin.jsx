import { useState } from 'react'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Admin = ({children,sudo}) => {
    const navigate = useNavigate()
    const loc = useLocation()
    const [show,setShow]=useState(false)

    useEffect(() => {
        if (sudo) {
            if (!localStorage.access) {
                localStorage.go = location.pathname
                toast('Remote input requires administrator access')
                navigate("/login", { replace: true });
            } else {
                setShow(true)
            }
        } else {
            setShow(true)
        }
    }, [loc])

    return (
        <>
            {show && <Outlet />}
            {show&& children}
        </>
    )
}

export default Admin