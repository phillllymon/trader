const {
    NetSet,
    TallyNetSet
} = require("./helpers/netSet.js");
const { fillInBlanksMinutely } = require("./helpers/fillInBlanks.js");
const { createAnswers } = require("./helpers/createAnswers.js");
const { createPriceList } = require("./helpers/createPriceList.js");
const { formatMoney } = require("./helpers/util.js");
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
    dec6
} = require("./rawDataMinutelyCont.js");

// new days!!! (low spread)
const { dec4new } = require("./dec4new");
const { dec5new } = require("./dec5new");
const { dec6new } = require("./dec6new");

const daysToUse = [
    // [nov11, "Nov11"],
    // [nov12, "Nov12"],
    // [nov13, "Nov13"],
    // [nov14, "Nov14"],
    // [nov15, "Nov15"],
    // [nov18, "Nov18"],
    // [nov22, "Nov22"],   // first day with open, high, low
    // [nov25, "Nov25"],
    // [nov26, "Nov26"],
    // [nov27, "Nov27"],
    // [dec2, "dec2"],
    // [dec3, "dec3"],  
    // [dec6, "dec6"],  
    [dec4new, "dec4"],      // first day with low spread stocks
    [dec5new, "dec5new"],
    [dec6new, "dec6new"],
];

// TEMP - preprogram table
const table = {};
const tables = {
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
    GLD: {},
    IWM: {},
    TSLA: {},
    XLY: {},
    DIS: {}
};
// END TEMP

const results = [];
daysToUse.forEach((dayPair) => {
    results.push(runDay(dayPair[0]));
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


function runDay(dayToUse) {
    // ----- params -----
    const stocksToUse = [
        // [dayToUse.COST, "COST"],    // 0.0007
        // [dayToUse.AMZN, "AMZN"],    // 0.00005
        // [dayToUse.GBTC, "GBTC"],    // 0.0001
        // [dayToUse.QQQ, "QQQ"],      // 0.00004
        // [dayToUse.RIVN, "RIVN"],    // 0.0009
        // [dayToUse.LUV, "LUV"],      // 0.0003
        // [dayToUse.ABNB, "ABNB"],    // 0.0004
        // [dayToUse.F, "F"],          // 0.0009
        // [dayToUse.UPRO, "UPRO"],
        // [dayToUse.TQQQ, "TQQQ"],

        // ----------------- new stocks (low spread)
        [dayToUse.QQQ, "QQQ"],      // 0.000019
        [dayToUse.SPY, "SPY"],      // 0.000032
        [dayToUse.GLD, "GLD"],      // 0.00004
        [dayToUse.AAPL, "AAPL"],    // 0.000041
        [dayToUse.IWM, "IWM"],      // 0.000041
        [dayToUse.AMZN, "AMZN"],    // 0.00005
        [dayToUse.TSLA, "TSLA"],    // 0.000056
        [dayToUse.XLY, "XLY"],      // 0.000068
        [dayToUse.DIS, "DIS"]       // 0.00009
    ];
    const testLength = 380;
    const dataCollapse = 5;
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
    const minIncrease = 0.0000;  // 0 means any increase
    const minDir = 1.0;         // 1 means any increase
    const minDirDir = 1.5;        // 1 means any increase
    const buyTopNum = 1;
    const keepTrainLength = false;
    const defaultTrainingParams = {
        lookBack: 2,
        numsToUse: {
            "price": ["dir"],
            "vol": ["dirDir"],
            // "open": ["dirDir"],
            // "high": ["actual"],
            // "high": ["dir"],
            // "high": ["dirDir"],
            // "low": ["actual"],
            // "low": ["dir"],
            // "low": ["dirDir"]
        },
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
        dataToUse[sym] = fillInBlanksMinutely(rawData, dataCollapse);
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



