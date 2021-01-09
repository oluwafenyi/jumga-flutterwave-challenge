
const getSortedBankList = (data) => {
    const banks = data.data.map(bank => {
        return {
            code: bank.code,
            name: bank.name,
        }
    });
    banks.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        return 0;
    })
    return banks
}

const modules = { getSortedBankList }
export default modules;
