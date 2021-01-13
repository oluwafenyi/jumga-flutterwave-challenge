
function getMerchantLink() {
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:8080";
    }
    return "https://jumga-merchant.netlify.app"
}

function getClientLink() {
    if (process.env.NODE_ENV === "development") {
        return "http://localhost:3000"
    }
    return "https://jumga-client.netlify.app"
}

export const merchantLink = getMerchantLink();

export const clientLink = getClientLink();

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
