import { autorun, set, toJS } from "mobx";

export function autoSave(_this, name) {
    const storedJSON = localStorage.getItem(name);
    if (storedJSON) {
        set(_this, JSON.parse(storedJSON));
    }
    autorun(() => {
        const value = toJS(_this);
        localStorage.setItem(name, JSON.stringify(value));
    });
}
