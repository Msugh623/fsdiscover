import { useEffect, useState } from "react";

const Delay = ({ delay, children, inline }) => {
    const [arch, setArch] = useState(delay == 0 ? true : false)

    useEffect(() => {
        setTimeout(() => {
            setArch(true)
        }, delay || 700);
    }, [])

    return arch ? children : <div className={inline ? 'd-inline' : ''} style={{ opacity: 0 }}>
        {children}
    </div>
}

export default Delay