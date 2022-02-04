import axios from 'axios';
import {parseCookies} from 'nookies';


const cookie = parseCookies();


export const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        Authorization: `Bearer ${cookie['nextauth.token']}`
    }
});