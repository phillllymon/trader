const {
    NetSet,
    TallyNetSet,
    TallyNetGroup
} = require("./helpers/netSet.js");
const { fillInBlanks } = require("./helpers/fillInBlanks.js");
const { createAnswers, createAnswersMulti } = require("./helpers/createAnswers.js");
const { createPriceList, createPriceListMulti } = require("./helpers/createPriceList.js");
const { runMulti } = require("./helpers/runMulti.js");
const {
    COSTdaily,  // 9668     0.0007
    AMZNdaily,  // 6923     0.00005 
    GBTCdaily,  // 2398     0.0001 
    QQQdaily,   // 6466     0.00004
    RIVNdaily,  // 759      0.0009
    LUVdaily,   // 11315    0.0003
    ABNBdaily,  // 990      0.0004
    Fdaily,     // 13229    0.0009
    METAdaily,  // 3154     0.0001
    JBLUdaily   // 5699     0.002     
} = require("./rawData.js");
const {
    GOOGdaily,  // 5106     0.0001
    KOdaily,    // 15837    0.0002
    UPROdaily,  // 3885     0.0001
    TQQQdaily,  // 3726     0.0001
    GLDdaily,   // 5042     0.00004
    TSLAdaily,  // 3631     0.0002
    AAPLdaily,  // 11084    0.00008
    MSFTdaily,  // 9758     0.0001
    BAdaily,    // 15837    0.0002
    BYRNdaily,  // 4586     0.006
    NFLXdaily,  // 5670     0.0008
    DISdaily    // 1258     0.00009
} = require("./rawDataCont.js");

// ----- params -----
const stocksToUse = [
    [COSTdaily, "COST"], 
    [AMZNdaily, "AMZN"],
    [GBTCdaily, "GBTC"],
    [QQQdaily, "QQQ"],
    [RIVNdaily, "RIVN"],
    [LUVdaily, "LUV"],
    [ABNBdaily, "ABNB"],
    [Fdaily, "F"],
    [METAdaily, "META"],
    [JBLUdaily, "JBLU"],
    [GOOGdaily, "GOOG"],
    [KOdaily, "KO"],
    [UPROdaily, "UPRO"],
    [TQQQdaily, "TQQQ"],
    [GLDdaily, "GLD"],
    [TSLAdaily, "TSLA"],
    [AAPLdaily, "AAPL"],
    [MSFTdaily, "MSFT"],
    [BAdaily, "BA"],
    [BYRNdaily, "BYRN"],
    [NFLXdaily, "NFLX"],
    [DISdaily, "DIS"]
];
const testLength = 60;
const testSegFromEnd = 1;
const numNets = 1;
const retrainInterval = 1;
const maxTrainLength = 500; // set to false to not use this at all
const keepTrainLength = true;
const tradeInterval = 1;
const buyThreshold = 0.5;
const bestFoundStart = 0;
const useFewestNegatives = false;
const upFactor = 1;
const buyTopNum = 2;
const useSimpleNet = true;
const spreadFraction = 0.0002;
const useForAnswer = "close";
// const multiTrainingParams = false;
const multiTrainingParams = [
    {
        // --- make sure these are in first set
        useForAnswer: "close",
        normalizeOutput: false,
        sortByTime: false,
        // --- ^first set^ ---
        lookBack: 4,
        numsToUse: {
            "vol": ["dir"],
            "high": ["dir"]
        },
        normalizeOutput: false,
        startTraining: 0,
        normalizeFactor: 1.5
    },
    {
        // --- make sure these are in first set
        useForAnswer: "close",
        normalizeOutput: false,
        sortByTime: false,
        // --- ^first set^ ---
        lookBack: 4,
        numsToUse: {
            "close": ["dir"],
            "vol": ["dirDir"],
        },
        normalizeOutput: false,
        startTraining: 0,
        normalizeFactor: 1.5
    },
    {
        // --- make sure these are in first set
        useForAnswer: "close",
        normalizeOutput: false,
        sortByTime: false,
        // --- ^first set^ ---
        lookBack: 4,
        numsToUse: {
            "close": ["dir"],
        },
        normalizeOutput: false,
        startTraining: 0,
        normalizeFactor: 1.5
    },
    {
        // --- make sure these are in first set
        useForAnswer: "close",
        normalizeOutput: false,
        sortByTime: false,
        // --- ^first set^ ---
        lookBack: 4,
        numsToUse: {
            "close": ["dir"],
            "vol": ["dir"],
            "vol": ["dirDir"],
        },
        normalizeOutput: false,
        startTraining: 0,
        normalizeFactor: 1.5
    },
];
const defaultTrainingParams = {
    lookBack: 4,
    numsToUse: {
        "close": ["dir"],
        "vol": ["dir"],
        "vol": ["dirDir"],
        // "open": ["dir"],
        // "high": ["dir"],
        // "low": ["dir"]
    },
    normalizeOutput: false,
    startTraining: 0,
    normalizeFactor: 1.5,
    sortByTime: false
};
const trainingParams = {
    // COST: {
    //     startTraining: 8000
    // },
    // AMZN: {
    //     startTraining: 5000
    // },
    // GBTC: {
    //     startTraining: 1000
    // },
    // QQQ: {
    //     startTraining: 5000
    // },
    // RIVN: {
    //     startTraining: 0
    // },
    // LUV: {
    //     startTraining: 8000
    // },
    // ABNB: {
    //     startTraining: 0
    // },
    // F: {
    //     startTraining: 11000
    // },
    // META: {
    //     startTraining: 1500
    // },
    // JBLU: {
    //     startTraining: 3000
    // },
    // GOOG: {
    //     startTraining: 3000
    // },
    // KO: {
    //     startTraining: 13000
    // },
    // UPRO: {
    //     startTraining: 2000
    // },
    // TQQQ: {
    //     startTraining: 1500
    // },
    // GLD: {
    //     startTraining: 3000
    // }
};
// --- end params ---

const syms = stocksToUse.map((pair) => {
    return pair[1];
});
const dataToUse = {};
syms.forEach((sym, i) => {
    const rawData = stocksToUse[i][0];
    rawData.sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        if (aDate.getTime() > bDate.getTime()) {
            return 1;
        } else {
            return -1;
        }
    });
    dataToUse[sym] = fillInBlanks(rawData);
});

const priceLists = {};
const answerLists = {};
syms.forEach((sym) => {
    const answerParams = defaultTrainingParams;
    if (trainingParams[sym]) {
        Object.keys(trainingParams[sym]).forEach((key) => {
            answerParams[key] = trainingParams[sym][key];
        });
    }
    let paramsToUse = {
        lookBack: answerParams.lookBack,
        normalizeFactor: answerParams.normalizeFactor,
        normalizeOutput: answerParams.normalizeOutput,
        useForAnswer: useForAnswer
    };
    if (multiTrainingParams) {
        paramsToUse = multiTrainingParams;
    }
    if (multiTrainingParams) {
        multiTrainingParams.forEach((paramSet) => {
            ["close", "vol", "open", "high", "low"].forEach((numType) => {
                if (paramSet.numsToUse[numType]) {
                    paramSet[numType] = {
                        useDiff: paramSet.numsToUse[numType].includes("diff"),
                        normalizeDiff: paramSet.numsToUse[numType].includes("normalizeDiff"),
                        useActual: paramSet.numsToUse[numType].includes("actual"),
                        normalizeActual: paramSet.numsToUse[numType].includes("normalizeActual"),
                        minimizeActual: paramSet.numsToUse[numType].includes("minimizeActual"),
                        useDir: paramSet.numsToUse[numType].includes("dir"),
                        useDirDir: paramSet.numsToUse[numType].includes("dirDir")
                    }
                }
            });
        });
    } else {
        ["close", "vol", "open", "high", "low"].forEach((numType) => {
            if (answerParams.numsToUse[numType]) {
                paramsToUse[numType] = {
                    useDiff: answerParams.numsToUse[numType].includes("diff"),
                    normalizeDiff: answerParams.numsToUse[numType].includes("normalizeDiff"),
                    useActual: answerParams.numsToUse[numType].includes("actual"),
                    normalizeActual: answerParams.numsToUse[numType].includes("normalizeActual"),
                    minimizeActual: answerParams.numsToUse[numType].includes("minimizeActual"),
                    useDir: answerParams.numsToUse[numType].includes("dir"),
                    useDirDir: answerParams.numsToUse[numType].includes("dirDir")
                }
            }
        });
    }
    if (multiTrainingParams) {
        answerLists[sym] = createAnswersMulti(dataToUse[sym], paramsToUse, false);
        priceLists[sym] = createPriceListMulti(dataToUse[sym], paramsToUse);
    } else {
        answerLists[sym] = createAnswers(dataToUse[sym], paramsToUse, false);
        priceLists[sym] = createPriceList(dataToUse[sym], paramsToUse);
    }
});



// let n = 0;
// dataToUse["COST"].forEach((entry) => {
//     if (!entry.date) {
//         n += 1;
//     }
// });
// console.log(n);
// throw("fit");


// console.log(answerListsArr);

// const answerLists = combineAnswerLists(answerListsArr);

// console.log(answerLists);

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
    const endTraining = answerList.length - (testLength * testSegFromEnd);
    trainingLists[sym] = answerList.slice(startTraining, endTraining);
    if (maxTrainLength && trainingLists[sym].length > maxTrainLength) {
        trainingLists[sym] = trainingLists[sym].slice(trainingLists[sym].length - maxTrainLength, trainingLists[sym].length);
    }
    nets[sym] = new NetSet(numNets);
    if (useSimpleNet) {
        nets[sym] = new TallyNetSet(numNets, upFactor, {}, useFewestNegatives);
    }
    if (multiTrainingParams) {
        nets[sym] = new TallyNetGroup(multiTrainingParams.length, upFactor, {}, useFewestNegatives);
    }
    nets[sym].train(trainingLists[sym]);

    testAnswerLists[sym] = answerLists[sym].slice(endTraining, answerList.length - (testLength * (testSegFromEnd - 1)));
    testPriceLists[sym] = priceLists[sym].slice(endTraining, answerList.length - (testLength * (testSegFromEnd - 1)));
});

syms.forEach((sym) => {
    console.log(sym);
    console.log(testPriceLists[sym].slice(26, 30));
});

// console.log(testAnswerLists["AMZN"].slice(50, 55));
// throw("fit");

runMulti(testAnswerLists, testPriceLists, trainingLists, nets, {
    retrainInterval: retrainInterval,
    buyThreshold: buyThreshold,
    spreadFraction: spreadFraction,
    useSimpleNet: useSimpleNet,
    tradeInterval: tradeInterval,
    bestFoundStart: bestFoundStart,
    buyTopNum: buyTopNum,
    keepTrainLength: keepTrainLength,
    useFewestNegatives: useFewestNegatives
});
