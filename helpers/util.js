function formatMoney(n) {
    let bigger = 100.0 * n;
    let round = Math.round(bigger);
    let backToSmall = round / 100.0;
    return `$${backToSmall}`;
}

function getSkeleton(arrs, n, smash = false) {
    const answer = {};
    Object.keys(arrs).forEach((key) => {
        if (smash) {
            const arr = arrs[key];
            arr.reverse();
            let lastPrice = 0;
            let lastOpen = 0;
            let lastHigh = 0;
            let lastLow = 0;
            arr.forEach((snapshot) => {
                let price = Number.parseFloat(snapshot.price);
                let vol = Number.parseFloat(snapshot.vol);
                let open = Number.parseFloat(snapshot.open);
                let high = Number.parseFloat(snapshot.high);
                let low = Number.parseFloat(snapshot.low);
                if (Number.isNaN(vol)) {
                    snapshot.vol = 0;
                }
                if (Number.isNaN(price)) {
                    snapshot.price = lastPrice;
                }
                if (Number.isNaN(open)) {
                    snapshot.open = lastOpen;
                }
                if (Number.isNaN(high)) {
                    snapshot.high = lastHigh;
                }
                if (Number.isNaN(low)) {
                    snapshot.low = lastLow;
                }
                lastPrice = snapshot.price;
                lastOpen = snapshot.open;
                lastHigh = snapshot.high;
                lastLow = snapshot.low;
            });
            const newArr = [];
            let open = false;
            let first = true;
            let highs = [];
            let lows = [];
            let vol = 0;
            for (let i = 0; i < arr.length; i++) {
                const thisEle = arr[i];
                if (first) {
                    open = thisEle.open;
                    first = false;
                }
                highs.push(thisEle.high);
                lows.push(thisEle.low);
                vol += thisEle.vol;
                if ((i + 1) % n === 0) {
                    newArr.push({
                        time: thisEle.time,
                        price: thisEle.price,
                        high: Math.max(...highs),
                        low: Math.min(...lows),
                        vol: vol
                    });
                    first = true;
                    highs = [];
                    lows = [];
                    vol = 0;
                }
            }
            answer[key] = newArr;
        } else {
            const newArr = [];
            const arr = arrs[key];
            for (let i = 0; i < arr.length; i++) {
                if (i % n === 0) {
                    newArr.push(arr[i]);
                }
            }
            answer[key] = newArr;
        }
    });
    return answer;
}

module.exports = {
    formatMoney,
    getSkeleton
};