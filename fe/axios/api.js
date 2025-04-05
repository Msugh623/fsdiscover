import axios from "axios";

// Run "npm start" in main directory to get host origin for use in development

export default axios.create({
    baseURL: location.origin.includes('5173') ?  'http://192.168.217.131:3000' : location.origin
})

export const remoteApi = axios.create({
    baseURL: 'https://sprintet.onrender.com'
})
