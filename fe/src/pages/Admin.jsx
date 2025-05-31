import { useState } from 'react'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const Admin = ({sudo}) => {
    const navigate = useNavigate()
    const loc = useLocation()
    const [show,setShow]=useState(false)

    useEffect(() => {
        if (sudo) {
            if (!localStorage.access) {
                navigate("/", { replace: true });
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
        </>
    )
}

export default Admin