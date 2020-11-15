import axios from "axios";

import { environment } from "../config";

let baseUrl = process.env.baseUrl;
export const accountService = {
    createUser,
    loginUser
};
const headers = {
    "Content-Type": "application/json",
};

function createUser(userDetails) {
    console.log(
        "enters here>>>",
        baseUrl,
        environment.api.services.accounts.signup
    );
    return axios.post(
        baseUrl + environment.api.services.accounts.signup,
        userDetails
    );
}

function loginUser(userDetails) {
    return axios
        .post(baseUrl + environment.api.services.accounts.login, userDetails, headers)
        .then(res => {
            localStorage.setItem("token", res.token);
        });
}