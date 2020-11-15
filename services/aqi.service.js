import axios from "axios";

import { environment } from "../config";

let baseUrl = process.env.baseUrl

export const aqiService = {
    postData,
};

function authFunc() {
    return auth = {
        headers: {
            Authorization: "Bearer " +
                JSON.parse(localStorage.getItem("token"))
        }
    }
}

function postData(data) {
    return axios.post(
        baseUrl +
        environment.api.services.aqi.uploadData, data, authFunc()
    );
}