/*
params: {
    lookBack: 10,
    useForPrice: "close"
}
*/

function createPriceList(unsortedDataList, params) {
    
    const dataList = unsortedDataList.map((ele) => {
        const eleToReturn = {};
        Object.keys(ele).forEach((key) => {
            eleToReturn[key] = ele[key];
        });
        return eleToReturn;
    });

    if (params.sortByTime) {
        dataList.sort((a, b) => {
            const aDate = new Date(a.time);
            const bDate = new Date(b.time);
            if (aDate.getTime() > bDate.getTime()) {
                return 1;
            } else {
                return -1;
            }
        });
    } else {
        dataList.sort((a, b) => {
            const aDate = new Date(a.date);
            const bDate = new Date(b.date);
            if (aDate.getTime() > bDate.getTime()) {
                return 1;
            } else {
                return -1;
            }
        });
    }
    
    const prices = [];
    for (let i = params.lookBack; i < dataList.length - 0; i++) {
        // console.log(params.useForAnswer);
        prices.push({price: dataList[i][params.useForAnswer], date: dataList[i].date});
    }
    return prices;
}

function createPriceListMulti(unsortedDataList, paramsArr) {
    const params = paramsArr[0];
    
    const dataList = unsortedDataList.map((ele) => {
        const eleToReturn = {};
        Object.keys(ele).forEach((key) => {
            eleToReturn[key] = ele[key];
        });
        return eleToReturn;
    });

    if (params.sortByTime) {
        dataList.sort((a, b) => {
            const aDate = new Date(a.time);
            const bDate = new Date(b.time);
            if (aDate.getTime() > bDate.getTime()) {
                return 1;
            } else {
                return -1;
            }
        });
    } else {
        dataList.sort((a, b) => {
            const aDate = new Date(a.date);
            const bDate = new Date(b.date);
            if (aDate.getTime() > bDate.getTime()) {
                return 1;
            } else {
                return -1;
            }
        });
    }
    
    const prices = [];
    for (let i = params.lookBack; i < dataList.length - 0; i++) {
        // console.log(params.useForAnswer);
        prices.push({price: dataList[i][params.useForAnswer], date: dataList[i].date});
    }
    return prices;
}

module.exports = { createPriceList, createPriceListMulti };