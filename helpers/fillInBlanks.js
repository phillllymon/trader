function fillInBlanks(dataArr, collapseN = 1) {
    const answer = [];
    let lastClose = Number.parseFloat(dataArr[0].close);
    let lastOpen = Number.parseFloat(dataArr[0].open);
    let lastHigh = Number.parseFloat(dataArr[0].high);
    let lastLow = Number.parseFloat(dataArr[0].low);
    answer.push({
        date: dataArr[0].date,
        close: lastClose,
        vol: Number.parseFloat(dataArr[0].vol),
        open: lastOpen,
        high: lastHigh,
        low: lastLow
    });
    for (let i = 1; i < dataArr.length; i++) {
        const newEntry = {
            date: dataArr[i].date,
            vol: Number.parseFloat(dataArr[i].vol),
            close: Number.parseFloat(dataArr[i].close),
            open: Number.parseFloat(dataArr[i].open),
            high: Number.parseFloat(dataArr[i].high),
            low: Number.parseFloat(dataArr[i].low)
        };
        if (Number.isNaN(newEntry.vol)) {
            newEntry.vol = 0;
        }
        if (Number.isNaN(newEntry.close)) {
            newEntry.close = lastClose;
        }
        if (Number.isNaN(newEntry.open)) {
            newEntry.open = lastOpen;
        }
        if (Number.isNaN(newEntry.high)) {
            newEntry.high = lastHigh;
        }
        if (Number.isNaN(newEntry.low)) {
            newEntry.low = lastLow;
        }
        lastClose = newEntry.close;
        lastOpen = newEntry.open;
        lastHigh = newEntry.high;
        lastLow = newEntry.low;
        answer.push(newEntry);
    }
    // return answer;
    return collapse(answer, collapseN, true);
};

function fillInBlanksMinutely(dataArr, collapseN = 1) {
    dataArr.sort((a, b) => {
        if (a.time > b.time) {
            return 1;
        } else {
            return -1;
        }
    });

    const answer = [];
    let lastPrice = Number.parseFloat(dataArr[0].price);
    let lastOpen = Number.parseFloat(dataArr[0].open);
    let lastHigh = Number.parseFloat(dataArr[0].high);
    let lastLow = Number.parseFloat(dataArr[0].low);
    answer.push({
        time: dataArr[0].time,
        price: lastPrice,
        vol: Number.parseFloat(dataArr[0].vol),
        open: lastOpen,
        high: lastHigh,
        low: lastLow
    });
    for (let i = 1; i < dataArr.length; i++) {
        const newEntry = {
            time: dataArr[i].time,
            vol: Number.parseFloat(dataArr[i].vol),
            price: Number.parseFloat(dataArr[i].price),
            open: Number.parseFloat(dataArr[i].open),
            high: Number.parseFloat(dataArr[i].high),
            low: Number.parseFloat(dataArr[i].low)
        };
        if (Number.isNaN(newEntry.vol)) {
            newEntry.vol = 0;
        }
        if (Number.isNaN(newEntry.price)) {
            newEntry.price = lastPrice;
        }
        if (Number.isNaN(newEntry.open)) {
            newEntry.open = lastOpen;
        }
        if (Number.isNaN(newEntry.high)) {
            newEntry.high = lastHigh;
        }
        if (Number.isNaN(newEntry.low)) {
            newEntry.low = lastLow;
        }
        lastPrice = newEntry.price;
        lastOpen = newEntry.open;
        lastHigh = newEntry.high;
        lastLow = newEntry.low;
        answer.push(newEntry);
    }
    // return answer;
    return collapse(answer, collapseN);
}

function collapse(arr, n, useClose = false) {
    // return arr;
    const answer = [];
    
    let numSegments = arr.length / n;
    for (let i = 0; i < numSegments; i++) {
        const startIdx = i * n;
        const theseEles = [];
        for (let j = 0; j < n; j++) {
            if (arr[startIdx + j]) {
                theseEles.push(arr[startIdx + j]);
            }
        }

        let close;
        let date;
        let price;
        let time;
        const open = theseEles[0].open;
        if (useClose) {
            close = theseEles[theseEles.length - 1].close;
            date = theseEles[theseEles.length - 1].date;
        } else {
            price = theseEles[theseEles.length - 1].price;
            time = theseEles[theseEles.length - 1].time;
        }
        const high = Math.max(...theseEles.map(ele => ele.high));
        const low = Math.min(...theseEles.map(ele => ele.low));
        let vol = 0;
        theseEles.forEach((ele) => {
            vol += ele.vol;
        });
        if (useClose) {
            answer.push({
                date: date,
                close: close,
                vol: vol,
                open: open,
                high: high,
                low: low
            });
        } else {

            answer.push({
                time: time,
                price: price,
                vol: vol,
                open: open,
                high: high,
                low: low
            });
        }

    }
    
    return answer;
}

module.exports = { fillInBlanks, fillInBlanksMinutely };