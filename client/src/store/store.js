
import { makeAutoObservable } from "mobx";
import { autoSave } from "./auto-store";

class JumgaState {
    access_token = "";

    constructor() {
        makeAutoObservable(this);
        autoSave(this, "jumgaState")
    }

    setAccessToken(access_token) {
        this.access_token = access_token;
    }

    clearAccessToken() {
        this.access_token = "";
    }

    isAuthenticated() {
        return this.access_token !== "";
    }
}

export const jumgaState = new JumgaState();
