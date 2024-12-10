const {
    NetSet,
    TallyNetSet
} = require("./helpers/netSet.js");
const { fillInBlanksMinutely } = require("./helpers/fillInBlanks.js");
const { createAnswers } = require("./helpers/createAnswers.js");
const { createPriceList } = require("./helpers/createPriceList.js");
const { formatMoney, getPerms } = require("./helpers/util.js");
const { runMulti } = require("./helpers/runMulti.js");
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
    dec9
} = require("./rawDataMinutelyCont.js");

// new days!!! (low spread)
const { dec4new } = require("./dec4new");
const { dec5new } = require("./dec5new");
const { dec6new } = require("./dec6new");

const { formatData } = require("./dataFromAlpaca.js");

const daysToUse = [
    [nov11, "Nov11"],
    [nov12, "Nov12"],
    [nov13, "Nov13"],
    [nov14, "Nov14"],
    [nov15, "Nov15"],
    [nov18, "Nov18"],
    [nov22, "Nov22"],   // first day with open, high, low
    [nov25, "Nov25"],
    [nov26, "Nov26"],
    [nov27, "Nov27"],
    [dec2, "dec2"],
    [dec3, "dec3"],  
    [dec6, "dec6"],
    [dec9, "dec9"],  
    // [dec4new, "dec4new"],      // first day with low spread stocks
    // [dec5new, "dec5new"],
    // [dec6new, "dec6new"],
    // [formatData("nov18"), "nov18", 1],
    // [formatData("nov19"), "nov19", 1],
    // [formatData("nov20"), "nov20", 1],
    // [formatData("nov21"), "nov21", 1],
    // [formatData("nov22"), "nov22", 1],
    // [formatData("nov25"), "nov25", 1],
    // [formatData("nov26"), "nov26", 1],
    // [formatData("nov27"), "nov27", 1],
    // [formatData("dec2"), "dec2", 1],
    // [formatData("dec3"), "dec3", 1],
    // [dec4new, "dec4"],
    // [dec5new, "dec5"],
    // [dec6new, "dec6"],
];




// share table
const table = {};
let tables = {
    COST: {},
    AMZN: {},
    GBTC: {},
    QQQ: {},
    RIVN: {},
    LUV: {},
    ABNB: {},
    F: {},

    AAPL: {},
    IWM: {},
    QQQ: {},
    SPY: {},
    // AMZN: {}, already above
    GLD: {},
    TSLA: {},
    XLY: {},
    DIS: {}
};

const perms = getPerms(5, [
    [],
    ["dir"],
    ["dirDir"],
    ["dir", "dirDir"]
]);
console.log(perms[831]);

const overallTest = false;
if (overallTest) {

// OVERALL TEST -----------------------------------
const overallResults = [];
perms.forEach((perm, permIdx) => {
    console.log("checking config " + permIdx + " / " + perms.length);
    for (let n = 1; n < 5; n++) {
        const constructParams = {
            lookBack: n,
            numsToUse: {
                "price": perm[0],
                "vol": perm[1],
                "open": perm[2],
                "high": perm[3],
                "low": perm[4]
            },
            normalizeOutput: false,
            startTraining: 0,
            normalizeFactor: 1.5
        }
        const theseResults = [];
        tables = {
            COST: {},
            AMZN: {},
            GBTC: {},
            QQQ: {},
            RIVN: {},
            LUV: {},
            ABNB: {},
            F: {},
        
            AAPL: {},
            IWM: {},
            QQQ: {},
            SPY: {},
            // AMZN: {}, already above
            GLD: {},
            TSLA: {},
            XLY: {},
            DIS: {}
        };
        daysToUse.forEach((dayPair) => {
            let length = 0;
            Object.keys(constructParams.numsToUse).forEach((key) => {
                length += constructParams.numsToUse[key].length;
            });
            if (length > 0) {
                theseResults.push(runDay(dayPair[0], dayPair[2], constructParams));
            }
        });
        let ave = 0;
        let noSpreadAve = 0;
        theseResults.forEach((result) => {
            ave += result[1];
            noSpreadAve += result[0];
        });
        ave /= theseResults.length;
        noSpreadAve /= theseResults.length;
        if (ave > 100.2) {
            console.log(ave);
        }
        overallResults.push([`${n}-${permIdx}`, ave, noSpreadAve]);
    }
});
let noSpread = 0;
let highest = 0;
let code = "";
overallResults.forEach((resultPair) => {
    if (resultPair[1] > highest) {
        highest = resultPair[1];
        noSpread = resultPair[2];
        code = resultPair[0];
    }
});
console.log("DONE!");
console.log("----------------------------");
console.log("highest ave: " + formatMoney(highest));
console.log("no spread: " + formatMoney(noSpread));
console.log("highest code: " + code);
console.log("----------------------------");
// OVERALL TEST ^---------------------------------^

} else {

// main ------------- main
const results = [];
daysToUse.forEach((dayPair) => {
    results.push(runDay(dayPair[0], dayPair[2]));
});
let ave = 0;
let realAve = 0;
results.forEach((result, i) => {
    ave += result[0];
    realAve += result[1];
    console.log(`${daysToUse[i][1]}: ${formatMoney(result[0])} -> ${formatMoney(result[1])} (keep: ${formatMoney(result[2])})`);
});
console.log("--------------------------------");
console.log(`AVE: ${formatMoney(ave / results.length)} -> ${formatMoney(realAve / results.length)}`);
console.log("--------------------------------");
// -------- end main --------

}

function runDay(dayToUse, collapseN, useParams) {
    // ----- params -----
    const stocksToUse = [
        [dayToUse.COST, "COST"],    // 0.0007
        [dayToUse.AMZN, "AMZN"],    // 0.00005
        [dayToUse.GBTC, "GBTC"],    // 0.0001
        [dayToUse.QQQ, "QQQ"],      // 0.00004
        [dayToUse.RIVN, "RIVN"],    // 0.0009
        [dayToUse.LUV, "LUV"],      // 0.0003
        [dayToUse.ABNB, "ABNB"],    // 0.0004
        [dayToUse.F, "F"],          // 0.0009
        // [dayToUse.UPRO, "UPRO"],
        // [dayToUse.TQQQ, "TQQQ"],

        // ----------------- new stocks (low spread)
        // [dayToUse.QQQ, "QQQ"],      // 0.000019
        // [dayToUse.SPY, "SPY"],      // 0.000032
        // [dayToUse.GLD, "GLD"],      // 0.00004
        // [dayToUse.AAPL, "AAPL"],    // 0.000041
        // [dayToUse.IWM, "IWM"],      // 0.000041
        // [dayToUse.AMZN, "AMZN"],    // 0.00005
        // [dayToUse.TSLA, "TSLA"],    // 0.000056
        // [dayToUse.XLY, "XLY"],      // 0.000068
        // [dayToUse.DIS, "DIS"]       // 0.00009
    ];
    const testLength = 380;
    const dataCollapse = 1;
    const testSegFromEnd = 1;
    const numNets = 1;
    const retrainInterval = 1;
    const tradeInterval = 1;
    const buyThreshold = 0.5;
    const answersWithSpread = false;
    const useSimpleNet = true;
    const greaterFactor = 1;
    const useForAnswer = "price";
    const useFewestNegatives = false;
    const bestFoundStart = 1;
    const minIncrease = 0.00;  // 0 means any increase
    const minDir = 1;         // 1 means any increase
    const minDirDir = 40;        // 1 means any increase
    const buyTopNum = 1;
    const keepTrainLength = false;
    const defaultTrainingParams = overallTest ? useParams : {
        // ------ good with collapse 5
        lookBack: 2,
        numsToUse: {
            "price": ["dir"],
            "vol": ["dirDir"],
        },
        // lookBack: 3,
        // numsToUse: {
        //     "price": ["dir", "dirDir"],
        //     "vol": [],
        //     "open": ["dir", "dirDir"],
        //     "high": ["dir", "dirDir"],
        //     "low": ["dir", "dirDir"]
        // },
        normalizeOutput: false,
        startTraining: 0,
        normalizeFactor: 1.5
    };
    const trainingParams = {
        // COST: {
        //     lookBack: 3,
        //     numsToUse: {
        //         // "close": ["dir"],
        //         // "vol": ["dir"],
        //         // "open": ["dir"],
        //         // "high": ["dir"],
        //         // "low": ["dir"],
        //     },
        //     normalizeOutput: false,
        //     startTraining: 0,
        //     normalizeFactor: 1.5
        // },
        // AMZN: {
        //     lookBack: 3,
        //     numsToUse: {
        //         "close": ["dir"],
        //         "vol": ["dir"],
        //         // "open": ["dir"],
        //         // "high": ["dir"],
        //         // "low": ["dir"],
        //     },
        //     normalizeOutput: false,
        //     startTraining: 4000,
        //     normalizeFactor: 1.5
        // }
    };
    // --- end params ---

    const syms = stocksToUse.map((pair) => {
        return pair[1];
    });
    const dataToUse = {};
    syms.forEach((sym, i) => {
        const rawData = stocksToUse[i][0];
        // rawData.sort((a, b) => {
        //     const aDate = new Date(a.time);
        //     const bDate = new Date(b.time);
        //     if (aDate.getTime() > bDate.getTime()) {
        //         return 1;
        //     } else {
        //         return -1;
        //     }
        // });
        dataToUse[sym] = fillInBlanksMinutely(rawData, collapseN ? collapseN : dataCollapse);
        
    });

    // console.log(dataToUse["COST"].slice(0, 4));
    // throw("fit");

    const priceLists = {};
    const answerLists = {};
    syms.forEach((sym) => {
        let answerParams = defaultTrainingParams;
        if (trainingParams[sym]) {
            answerParams = trainingParams[sym];
        }
        const paramsToUse = {
            lookBack: answerParams.lookBack,
            normalizeFactor: answerParams.normalizeFactor,
            normalizeOutput: answerParams.normalizeOutput,
            useForAnswer: useForAnswer,
            answersWithSpread: answersWithSpread,
            sym: sym,
            sortByTime: true
        };
        ["price", "vol", "open", "high", "low"].forEach((numType) => {
            if (answerParams.numsToUse[numType]) {
                paramsToUse[numType] = {
                    useDiff: answerParams.numsToUse[numType].includes("diff"),
                    normalizeDiff: answerParams.numsToUse[numType].includes("normalizeDiff"),
                    useActual: answerParams.numsToUse[numType].includes("actual"),
                    normalizeActual: answerParams.numsToUse[numType].includes("normalizeActual"),
                    minimizeActual: answerParams.numsToUse[numType].includes("minimizeActual"),
                    useDir: answerParams.numsToUse[numType].includes("dir"),
                    useDirDir: answerParams.numsToUse[numType].includes("dirDir"),
                }
            }
        });
        answerLists[sym] = createAnswers(dataToUse[sym], paramsToUse, true, minIncrease, minDir, minDirDir);
        priceLists[sym] = createPriceList(dataToUse[sym], paramsToUse);
    });

    
    // console.log(priceLists["AMZN"].slice(priceLists["AMZN"].length - 5, priceLists["AMZN"].length));
    // console.log(answerLists["AMZN"].slice(answerLists["AMZN"].length - 5, answerLists["AMZN"].length));
    // console.log(answerLists["COST"].slice(answerLists["COST"].length - 5, answerLists["COST"].length));
    // throw("fit");

    const trainingLists = {};
    const testAnswerLists = {};
    const testPriceLists = {};
    const nets = {};

    syms.forEach((sym) => {
        let symParams = defaultTrainingParams;
        if (trainingParams[sym]) {
            symParams = trainingParams[sym];
        }
        const answerList = answerLists[sym];
        const startTraining = symParams.startTraining;
        const testLengthToUse = Math.floor(testLength / dataCollapse);
        const endTraining = answerList.length - (testLengthToUse * testSegFromEnd);
        trainingLists[sym] = answerList.slice(startTraining, endTraining);
        // nets[sym] = useSimpleNet ? new TallyNetSet(numNets, greaterFactor, {}, useFewestNegatives) : new NetSet(numNets);
        // nets[sym] = useSimpleNet ? new TallyNetSet(numNets, greaterFactor, table, useFewestNegatives) : new NetSet(numNets);
        nets[sym] = useSimpleNet ? new TallyNetSet(numNets, greaterFactor, tables[sym], useFewestNegatives) : new NetSet(numNets);
        
        // nets[sym].train(trainingLists[sym]);

        testAnswerLists[sym] = answerLists[sym].slice(endTraining, answerList.length - (testLengthToUse * (testSegFromEnd - 1)));
        testPriceLists[sym] = priceLists[sym].slice(endTraining, answerList.length - (testLengthToUse * (testSegFromEnd - 1)));
    });

    syms.forEach((sym) => {
        nets[sym].train(trainingLists[sym]);
    });

    // console.log(testPriceLists["AMZN"].length);
    // throw("fit");

    return runMulti(testAnswerLists, testPriceLists, trainingLists, nets, {
        retrainInterval: retrainInterval,
        buyThreshold: buyThreshold,
        useSimpleNet: useSimpleNet,
        tradeInterval: tradeInterval,
        bestFoundStart: bestFoundStart,
        buyTopNum: buyTopNum,
        keepTrainLength: keepTrainLength,
        useFewestNegatives: useFewestNegatives
    });
}



