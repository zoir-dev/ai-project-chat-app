import axios from "axios";

export const http=axios.create({
    baseURL:'https://cf9a-195-158-20-242.ngrok-free.app/api/',
    headers:{
        'ngrok-skip-browser-warning': 'true'
    }
})