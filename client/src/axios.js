import axios from "axios";

function getConfig() {
    const config = { headers: {"Content-Type":"application/json"} };

    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        config["baseURL"] = "http://localhost:8000";
    } else {
        config["baseURL"] = "https://apex-jumga.herokuapp.com";
    }

    return config;
}

export const jumga = axios.create(getConfig());

export const flutterwave = axios.create({baseURL: "https://api.flutterwave.com/v3", headers: {Authorization: "FLWPUBK_TEST-5c51665ef164bbdade0aa2ba50c9e8b2-X"}});
