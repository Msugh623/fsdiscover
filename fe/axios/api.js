import axios from "axios";

export default axios.create({
    baseURL: location.origin.includes('517') ?  'https://sprintet.onrender.com' : location.origin
})

export const remoteApi = axios.create({
    baseURL: 'https://sprintet.onrender.com'
})
