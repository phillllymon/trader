const { fillInBlanksMinutely } = require("./helpers/fillInBlanks.js");
const { formatMoney } = require("./helpers/util.js");
const {
    nov11,
    nov12,
    nov13,
    nov14,
    nov15,
    nov18,
    nov22,
    nov25,
    nov26,
    nov27,
    dec2
} = require("./rawDataMinutely.js");
const {
    dec3,
    dec6,
    dec9,
    dec10
} = require("./rawDataMinutelyCont.js");

const daysToUse = [
    nov11,
    nov12,
    nov13,
    nov14,
    nov15,
    nov18,
    nov22,
    nov25,
    nov26,
    nov27,
    dec2,
    dec3,
    dec6,
    dec9,
    dec10
];

const sellReasons = {
    tooLow: 0,
    tooHigh: 0,
    tooLong: 0,
    dayEnd: 0
}

const tables = {
    "COST": {},
    "AMZN": {},
    "GBTC": {},
    "QQQ": {},
    "RIVN": {},
    "LUV": {},
    "ABNB": {},
    "F": {}
};

const bounds = {
    minutesToSell: {
        low: 40,
        high: 60,
        incr: 10
    },
    highSellPrice: {
        low: 1.02,
        high: 1.1,
        incr: 0.01
    },
    lowSellPrice: {
        low: 0.99,
        high: 1,
        incr: 0.002
    },
    volDirIncrease: {
        low: 5.2,
        high: 5.2,
        incr: 0.2
    },
    priceIncrease: {
        low: 0.0028,
        high: 0.0028,
        incr: 0.0001
    }
};

const runBigTest = false;

if (runBigTest) {
    let results = [];
    for (let minutesToSell = bounds.minutesToSell.low; minutesToSell < bounds.minutesToSell.high + bounds.minutesToSell.incr; minutesToSell += bounds.minutesToSell.incr) {
        console.log("working with " + minutesToSell + " minutes (" + bounds.minutesToSell.low + " -> " + bounds.minutesToSell.high + ")");
        for (let highSellPrice = bounds.highSellPrice.low; highSellPrice < bounds.highSellPrice.high + bounds.highSellPrice.incr; highSellPrice += bounds.highSellPrice.incr) {
            for (let lowSellPrice = bounds.lowSellPrice.low; lowSellPrice < bounds.lowSellPrice.high + bounds.lowSellPrice.incr; lowSellPrice += bounds.lowSellPrice.incr) {
                for (let volDirIncrease = bounds.volDirIncrease.low; volDirIncrease < bounds.volDirIncrease.high + bounds.volDirIncrease.incr; volDirIncrease += bounds.volDirIncrease.incr) {
                    for (let priceIncrease = bounds.priceIncrease.low; priceIncrease < bounds.priceIncrease.high + bounds.priceIncrease.incr; priceIncrease += bounds.priceIncrease.incr) {
                        let sum = 0;
                        daysToUse.forEach((day) => {
                            sum += runDay(day, {
                                minutesToSell,
                                highSellPrice,
                                lowSellPrice,
                                volDirIncrease,
                                priceIncrease
                            });
                        });
                        results.push([
                            [minutesToSell, highSellPrice, lowSellPrice, volDirIncrease, priceIncrease],
                            sum / daysToUse.length
                        ]);
                    }
                }
            }
        }
    }

    let highests = [[[], 0], [[], 0], [[], 0], [[], 0], [[], 0]];
    results.forEach((resultPair) => {
        if (resultPair[1] > highests[highests.length - 1][1]) {
            highests.push(resultPair);
            highests.sort((a, b) => {
                if (a[1] > b[1]) {
                    return 1;
                } else {
                    return -1;
                }
            });
            highests.shift();
        }
    });
    console.log("----------------------");
    console.log(highests);
    console.log("----------------------");
} else {
    const paramsToUse = {
        // ------- these params give 1.14%
        // minutesToSell: 60,
        // highSellPrice: 1.07,
        // lowSellPrice: 0.995,
        // volDirIncrease: 5.2,
        // priceIncrease: 0.0028
        minutesToSell: 60,
        highSellPrice: 1.07,
        lowSellPrice: 0.990,
        volDirIncrease: 5.2,
        priceIncrease: 0.0028
    };
    let sum = 0;
    daysToUse.forEach((day) => {
        const thisAmt = runDay(day, paramsToUse);
        console.log(formatMoney(thisAmt));
        sum += thisAmt;
    });
    console.log("----------------------------");
    console.log("ave: " + formatMoney(sum / daysToUse.length));
    console.log("----------------------------");
    console.log(sellReasons);
}

function runDay(dayToUse, params) {

    const minutesToSell = params ? params.minutesToSell : 60;
    const highSellPrice = params ? params.highSellPrice : 1.035;
    const lowSellPrice = params ? params.lowSellPrice : 0.995;
    const volDirIncrease = params ? params.volDirIncrease : 10;
    const priceIncrease = params ? params.priceIncrease : 0.00305;

    // const syms = Object.keys(dayToUse);
    const syms = [
        "COST",
        "AMZN",
        "GBTC",
        "QQQ",
        "RIVN",
        "LUV",
        "ABNB",
        "F"
    ];
    const buyOrNot = {};
    const lastCodes = {};
    syms.forEach((sym) => {
        buyOrNot[sym] = false;
        dayToUse[sym] = fillInBlanksMinutely(dayToUse[sym]);
        lastCodes[sym] = {
            up: 0,
            down: 0
        };
    });

    // const aveSpread = 0.000;
    const aveSpread = 0.000424;

    let amt = 100;
    let own = false;
    let minutesSinceBuy = 0;
    let buyPrice = 0;

    const lookBack = 3;
    
    for (let i = lookBack; i < dayToUse[syms[0]].length - 1; i++) {

        if (own) {
            const lastPrice = dayToUse[own][i - 1].price;
            const thisPrice = dayToUse[own][i].price;
            amt *= (1.0 * thisPrice / lastPrice);
            minutesSinceBuy += 1;
        }

        syms.forEach((sym) => {
            const thisVol = dayToUse[sym][i].vol;
            const prevVol = dayToUse[sym][i - 1].vol;

            const thisPrice = dayToUse[sym][i].price;
            const prevPrice = dayToUse[sym][i - 1].price;

            const priceDir = thisPrice - prevPrice > 0 ? 1 : 0;

            const increase = (dayToUse[sym][i].price - dayToUse[sym][i - 1].price);
            const percentIncrease = 1.0 * increase / dayToUse[sym][i].price;
            const volDirA = dayToUse[sym][i].vol - dayToUse[sym][i - 1].vol > 0 ? 1 : 0;
            const volDirPercent = 1.0 * (thisVol - prevVol) / prevVol;
            const volDirB = dayToUse[sym][i - 1].vol - dayToUse[sym][i - 2].vol > 0 ? 1 : 0;
            const volDirC = dayToUse[sym][i - 2].vol - dayToUse[sym][i - 3].vol > 0 ? 1 : 0;
            const volDirDir = volDirA > volDirB ? 1 : 0;
            const volDirDirIncrease = 1.0 * (volDirA - volDirB) / volDirA;

            // ------ table stuff
            if (tables[sym][lastCodes[sym]]) {
                if (increase > 0) {
                    tables[sym][lastCodes[sym]].up += 1;
                } else {
                    tables[sym][lastCodes[sym]].down += 1;
                }
            }
            
            const code = [priceDir, volDirA, volDirB, volDirC, volDirDir].map(ele => ele.toString()).join("-");
            if (!tables[sym][code]) {
                tables[sym][code] = {
                    up: 0,
                    down: 0
                }
            }
            
            let predictUp = false;
            if (tables[sym][code].up > tables[sym][code].down) {
                predictUp = true;
                predictUp = 1000;
                if (tables[sym][code].down > 0) {
                    predictUp = tables[sym][code].up > tables[sym][code].down
                }
            }
            lastCodes[sym] = code;
            // ------ end table stuff

            if (volDirPercent > volDirIncrease) {
                if (percentIncrease > priceIncrease) {
                        buyOrNot[sym] = volDirPercent;
                } else {
                    buyOrNot[sym] = "hold";
                }
            } else {
                buyOrNot[sym] = "hold";
            }
            if (
                (own === sym && minutesSinceBuy > minutesToSell) ||
                (own === sym && dayToUse[own][i].price > highSellPrice * buyPrice) ||
                (own === sym && dayToUse[own][i].price < lowSellPrice * buyPrice)
                ) {

                if (own === sym && minutesSinceBuy > minutesToSell) {
                    sellReasons.tooLong += 1;
                }
                if (own === sym && dayToUse[own][i].price > highSellPrice * buyPrice) {
                    sellReasons.tooHigh += 1;
                }
                if (own === sym && dayToUse[own][i].price < lowSellPrice * buyPrice) {
                    sellReasons.tooLow += 1;
                }

                buyOrNot[sym] = false;
            }
        });

        // sell if we should
        if (own && !buyOrNot[own]) {
            own = false;
            minutesSinceBuy = 0;
            buyPrice = 0;
            if (!buyOrNot[own]) {
                amt = amt * (1 - aveSpread);
            }
        }

        if (!own) {
            //deterimine what to buy
            let bestFound = 0;
            let symToBuy = false;
            syms.forEach((sym) => {
                if (buyOrNot[sym] && buyOrNot[sym] !== "hold" && buyOrNot[sym] > bestFound) {
                    bestFound = buyOrNot[sym];
                    symToBuy = sym;
                }
            });
            if (symToBuy) {
                // console.log(symToBuy, i);
                own = symToBuy;
                amt = amt * (1 - aveSpread);
                minutesSinceBuy = 0;
                buyPrice = dayToUse[own][i].price;
            }
        }
    }
    if (own) {
        sellReasons.dayEnd += 1;
    }
    return amt;
}
