import axios from 'axios';
const url="https://bodegaapi.herokuapp.com/api/v1/";
export const userService = {
    login(username:String, password:String) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return axios.post(url+"rest-auth/login/", requestOptions)
        .then(handleResponse)
        .then(user => {
            if (user.token) {
                localStorage.setItem('user', JSON.stringify(user));
            }
            return user;
        });
    },
};



function logout() {
    localStorage.removeItem('user');
}

function register(user:String) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    //return fetch(`${config.apiUrl}/users/register`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: "authHeader()"
    };

    //return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getById(id:String) {
    const requestOptions = {
        method: 'GET',
        headers: "authHeader()"
    };

    //return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response:any) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}