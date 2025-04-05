import { useContext, createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../axios/api";
import { toast } from "react-toastify";

const context = createContext()

const FsContext = ({ children }) => {
    const location=useLocation()
    const [locPath, setLocPath] = useState('')
    const [locChildren, setLocChildren] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [isHidden, setIsHidden] = useState(false)

    async function getFs(path=locPath) {
        setIsFetching(true)
        try {
            const res = await api.get('/fs' + path)
            // console.log(res.data)
            setLocChildren(res.data)
        }
        catch (err) {
            toast.error(`ERROR: ${err}`)
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        const path = location.pathname.replace('/fsexplorer', '')
        setLocChildren([])
        setLocPath(path)
        getFs(path)
    }, [location])

    return <context.Provider value={{
        locChildren,
        locPath,
        getFs,
        isFetching,
        setIsFetching,
        isHidden,
        setIsHidden
    }}>
        {children}
    </context.Provider>
}

export default FsContext
export const useFsContext = () => useContext(context)