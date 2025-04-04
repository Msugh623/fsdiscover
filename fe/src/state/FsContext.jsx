import { useContext, createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../axios/api";
import { toast } from "react-toastify";

const context = createContext()

const FsContext = ({ children }) => {
    const location=useLocation()
    const [locPath, setLocPath] = useState(location.pathname.replace('/fsexplorer', 'fs'))
    const [locChildren, setLocChildren] = useState([])
    const [isFetching, setIsFetching] = useState(false)

    async function getFs() {
        setIsFetching(true)
        try {
            const res = await api.get('/fs' + locPath)
            setLocChildren(res.data)
        }
        catch (err) {
            toast.error(`ERROR: ${err}`)
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        setLocPath(location.pathname.replace('/fsexplorer', 'fs'))
    }, [location])

    return <context.Provider value={{
        locChildren,
        locPath,
        getFs,
        isFetching,
        setIsFetching,
    }}>
        {children}
    </context.Provider>
}

export default FsContext
export const useFsContext = () => useContext(context)