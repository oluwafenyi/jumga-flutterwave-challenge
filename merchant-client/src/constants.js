
function getMerchantLink() {
    switch (process.env.NODE_ENV) {
        case "development":
            return "http://localhost:8080";
        case "production":
            return "";
        default:
            return "";
    }
}

export const merchantLink = getMerchantLink();

export const clientLink = "http://localhost:3000";

export const countryCodes = {
    Nigeria: "NG",
    Ghana: "GH",
    Kenya: "KE",
};

export const productCategories = [
    {
        "name": "Electronics",
        "slug": "electronics"
    },
    {
        "name": "Fashion",
        "slug": "fashion"
    },
    {
        "name": "Food Stuff",
        "slug": "foodstuff"
    },
    {
        "name": "Cosmetics",
        "slug": "cosmetics"
    },
    {
        "name": "Sports & Fitness",
        "slug": "fitfam"
    }
]
