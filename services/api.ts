import axios, {Axios, AxiosError} from 'axios';
import Router from 'next/router';
import {destroyCookie, parseCookies, setCookie} from 'nookies';


let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue = [];
export const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}`
    }
});

export function signOut(){
    destroyCookie(undefined, 'nextauth.token');
    destroyCookie(undefined, 'nextauth.refreshToken');
    Router.push('/');
}

api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (error.response.status === 401) {
            if(error.response.data?.code === 'token.expired') {
                cookies = parseCookies()

                const { 'nextauth.refreshToken': refreshToken } = cookies;
                const originalConfig = error.config;

               if(!isRefreshing) {
                   isRefreshing = true;
                api.post('/refresh', { refreshToken }).then(response => {
                    const { token } = response.data;

                    setCookie(undefined, "nextauth.token", token, {
                        maxAge: 30 * 24 * 60 * 60, // 30 days
                          path: "/",
                    })
                    setCookie(undefined, "nextauth.refreshToken", response.data.refreshToken, {
                      maxAge: 30 * 24 * 60 * 60, // 30 days
                      path: "/",
                  })

                  api.defaults.headers['Authorization'] = `Bearer ${token}`;
                  failedRequestsQueue.forEach(req => req.onSuccess(token));
                failedRequestsQueue = [];
                }).catch( err => {
                    failedRequestsQueue.forEach(req => req.onFailure(err));
                    failedRequestsQueue = [];
                 })
                .finally(() => {
                    isRefreshing = false;
                })
               }

                return new Promise((resolve,reject) => { 
                    failedRequestsQueue.push({
                        onSuccess: (token: string) => {
                            originalConfig.headers['Authorization'] = `Bearer ${token}`;
                            resolve(api(originalConfig));
                        },
                        onFailure: (err: AxiosError) => {
                            reject(err)
                        },
                    })
                });
            


            } else {
                signOut();
                
            }
        }
        return Promise.reject(error);
    })