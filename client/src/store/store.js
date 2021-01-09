
import { makeAutoObservable } from "mobx";

class JumgaState {
    access_token = "";

    constructor() {
        makeAutoObservable(this);
    }

    setAccessToken(access_token) {
        this.access_token = access_token;
    }

    isAuthenticated() {
        return this.access_token !== "";
    }
}

export const jumgaState = new JumgaState();
