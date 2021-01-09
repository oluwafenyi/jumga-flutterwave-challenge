
function getClientLink() {
    switch (process.env.NODE_ENV) {
        case "development":
            return "http://localhost:3000";
        case "production":
            return "";
        default:
            return "";
    }
}

export const clientLink = getClientLink();
