
import { makeAutoObservable } from "mobx";
import { autoSave } from "./auto-store";
import { toast } from 'react-toastify';

class JumgaState {
    access_token = "";
    userData = {
        name: "",
        address: "",
        email: "",
        mobile: "",
        country: ""
    }

    constructor() {
        makeAutoObservable(this);
        autoSave(this, "jumgaState")
    }

    setAccessToken(access_token) {
        this.access_token = access_token;
    }

    setUserData(data) {
        this.userData = data;
    }

    clearAccessToken() {
        this.access_token = "";
        this.userData = {
            name: "",
            address: "",
            email: "",
            mobile: "",
            country: ""
        }
    }

    isAuthenticated() {
        return this.access_token !== "";
    }
}

class ToastNotification {
    status = "";
    message = "";
    notified = true;
    location = "";

    constructor() {
        makeAutoObservable(this);
        autoSave(this, "notification");
    }

    setValues({ status, message, location }) {
        this.notified = false;
        this.status = status;
        this.message = message;
        this.location = location;
    }

    display() {
        this.notified = true;
        switch (this.status) {
            case "success":
                return toast.success(this.message);
            case "failed":
                return toast.error(this.message);
            default:
                return toast(this.message);
        }
    }

    displayed() {
        return this.notified;
    }

}

export const jumgaState = new JumgaState();
export const  notification = new ToastNotification();
