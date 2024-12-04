const brain = require("brain.js");
const { createAnswers } = require("./helpers/createAnswers.js");
const { getSkeleton } = require("./helpers/util.js");

class NetSetNew {

    constructor(n) {
        this.table = {};
        this.withData = 0;
        this.noData = 0;
    }

    train(data) {
        data.forEach((point) => {
            const inputStr = point.input.join("-");
            if (!this.table[inputStr]) {
                this.table[inputStr] = {
                    up: 0,
                    down: 0,
                    diffs: [],
                    right: 0,
                    wrong: 0
                }
            }
            const answer = point.output[0];
            if (!point.equal) {
                if (answer > 0.5) {
                    this.table[inputStr].up += 1;
                } else {
                    this.table[inputStr].down += 1;
                }
                this.table[inputStr].diffs.push(point.answerDiff);
            }
        });
    }

    retrain(data) {
        this.table = {};
        this.train(data);
    }

    run(data, answer = false) {
        const str = data.join("-");
        if (this.table[str]) {
            this.withData += 1;
            // if (this.table[str].up > this.table[str].down && this.table[str].up > 1) {
            if (this.table[str].up > this.table[str].down) {
            
                // if (answer !== false) {
                //     if (answer === 1) {
                //         this.table[str].right += 1;
                //     } else {
                //         this.table[str].wrong += 1;
                //     }
                // }
                // let howSure = this.table[str].up - this.table[str].down;
                // let howSure = 1000;
                // if (this.table[str].down > 0) {
                //     howSure = 1.0 * this.table[str].up / this.table[str].down;
                // }
                let howSure = -1.0 * this.table[str].down;
                return [1, howSure];
            } else if (this.table[str].up < this.table[str].down) {
                // if (answer !== false) {
                //     if (answer === 0) {
                //         this.table[str].right += 1;
                //     } else {
                //         this.table[str].wrong += 1;
                //     }
                // }
                return [0];
            } else {
                // if (answer !== false) {
                //     if (answer === 0.5) {
                //         this.table[str].right += 1;
                //     } else {
                //         this.table[str].wrong += 1;
                //     }
                // }
                return [0.5];
            }
        }
        this.noData += 1;
        // return [0];
        return [1, -999];
        // return [Math.random()];
    }

    print(printTable = false) {
        console.log("with data: " + this.withData);
        console.log("no data: " + this.noData);
        // if (printTable) {
        //     // console.log(this.table);
        //     const dataRatios = [];
        //     const rightRatios = [];
        //     Object.keys(this.table).forEach((key) => {
        //         const entry = this.table[key];
        //         if ((entry.up + entry.down > 1) && (entry.right + entry.wrong > 1)) {
        //             // dataRatios.push((entry.up + entry.down) * Math.max(entry.up, entry.down) / Math.min(entry.up, entry.down));
        //             dataRatios.push(Math.max(entry.up, entry.down) / Math.min(entry.up, entry.down));
        //             // dataRatios.push(entry.up + entry.down);
        //             rightRatios.push(entry.right / (entry.right + entry.wrong));
        //         }
        //     });
        //     dataRatios.forEach((n) => {
        //         console.log(n);
        //     });
        //     console.log("right below");
        //     rightRatios.forEach((n) => {
        //         console.log(n);
        //     });
        // }
    }
}

class NetSet {
    constructor(n) {
        this.nets = [];
        for (let i = 0; i < n; i++) {
            this.nets.push(new brain.NeuralNetwork());
        }
    }
    train(data) {
        const dataToUse = [];
        let used = 0;
        let thrownOut = 0;
        data.forEach((dataPiece) => {
            // if (!dataPiece.equal) {
                dataToUse.push(dataPiece);
            //     used += 1;
            // } else {
            //     thrownOut += 1;
            // }
        });
        this.nets.forEach((net) => {
            // net.train(data);
            net.train(dataToUse);
        });
    }
    retrain(data) {
        const n = this.nets.length;
        this.nets = [];
        for (let i = 0; i < n; i++) {
            this.nets.push(new brain.NeuralNetwork());
        }
        this.train(data);
    }
    run(data) {
        let sum = 0;
        this.nets.forEach((net) =>{
            sum += net.run(data)[0];
        });
        // console.log(data);
        return [1.0 * sum / this.nets.length];
    }
    serialize() {
        return JSON.stringify(this.nets.map((net) => {
            return net.toFunction().toString();
        }));
    }

    print() {
        console.log("nothing to report");
    }
}

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
    nov27
} = require("./rawDataMinutely.js");

// params
// -------
const lookBack = 3;
const trainStart = 0;
const trainEnd = 50;
const testStart = 75;
const testEnd = 4000;
const numNets = 1;
const retrainInterval = 1;
const buyThreshold = 0.5;
const sellShortThreshold = 0.2;
const useSimpleNet = true;
const spreadFraction = 0.0001;
const tradeFrequency = 25;
// -------

// main
const combined = {
    COST: [],
    AMZN: [],
    GBTC: [],
    QQQ: [],
    RIVN: [],
    LUV: [],
    ABNB: [],
    F: []
}

Object.keys(combined).forEach((sym) => {
    combined[sym].push(...nov11[sym]);
    combined[sym].push(...nov12[sym]);
    combined[sym].push(...nov13[sym]);
    combined[sym].push(...nov14[sym]);
    combined[sym].push(...nov15[sym]);
    combined[sym].push(...nov18[sym]);
    combined[sym].push(...nov22[sym]);
    combined[sym].push(...nov25[sym]);
    combined[sym].push(...nov26[sym]);
    combined[sym].push(...nov27[sym]);
});

// Object.keys(combined).forEach((sym) => {
//     nov15[sym].forEach((val, i) => {
//         if (i % 1 === 0) {
//             combined[sym].push(val);
//         }
//     });
// });


const dataToUse = nov27;
// const dataToUse = getSkeleton(nov14, 4, true);
// const dataToUse = combined;




// const syms = Object.keys(dataToUse);
const syms = [
    "COST",
    "AMZN",
    "GBTC",
    "QQQ",
    "RIVN",
    "LUV",
    "ABNB",
    "F",
    // "UPRO",
    // "TQQQ"
];

const dataLists = {};

syms.forEach((sym) => {
    
    dataLists[sym] = [];
    dataToUse[sym].forEach((snapshot) => {
        
        dataLists[sym].push({
            time: snapshot.time,
            price: Number.parseFloat(snapshot.price),
            vol: Number.parseFloat(snapshot.vol),
            open: Number.parseFloat(snapshot.open),
            high: Number.parseFloat(snapshot.high),
            low: Number.parseFloat(snapshot.low)
        });
        
    });
    dataLists[sym].sort((a, b) => {
        if (a.time > b.time) {
            return 1;
        } else {
            return -1;
        }
    });
    let lastPrice = 0;
    let lastOpen = 0;
    let lastHigh = 0;
    let lastLow = 0;
    dataLists[sym].forEach((snapshot) => {
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
    // dataLists[sym].forEach((snapshot) => {
    //     console.log(snapshot);
    // });
});
// console.log(dataLists["AMZN"]);

// throw("lkmsdf");


// TEMP - graph vol/price
// dataLists["AMZN"].forEach((snapshot) => {
//     console.log(snapshot.price);
// });
// console.log("&&&&&&&");
// dataLists["COST"].forEach((snapshot) => {
//     console.log(snapshot.vol);
// });
// END TEMP


const priceLists = {};
const answerLists = {};
syms.forEach((sym) => {
    // answerLists[sym] = createAnswerList(dataLists[sym], lookBack);


    answerLists[sym] = createAnswers(dataLists[sym], {
        lookBack: lookBack,
        normalizeFactor: 1.5,
        normalizeOutput: false,
        useForAnswer: "price",
        lookAhead: tradeFrequency,
        price: {
            // useDiff: true,
            // normalizeDiff: true,
            // useActual: true,
            // normalizeActual: true,
            // minimizeActual: true,
            useDir: true,
        },
        vol: {
            // useDiff: true,
            // normalizeDiff: true,
            // useActual: true,
            // normalizeActual: true,
            // minimizeActual: true,
            useDir: true
        },
        // open: {
        //     // useDiff: true,
        //     // normalizeDiff: true,
        //     // useActual: true,
        //     // normalizeActual: true,
        //     // minimizeActual: true,
        //     useDir: true
        // },
        // high: {
        //     // useDiff: true,
        //     // normalizeDiff: true,
        //     // useActual: true,
        //     // normalizeActual: true,
        //     // minimizeActual: true,
        //     useDir: true
        // },
        // low: {
        //     // useDiff: true,
        //     // normalizeDiff: true,
        //     // useActual: true,
        //     // normalizeActual: true,
        //     // minimizeActual: true,
        //     useDir: true
        // }
    }, true);

    

    // answerLists[sym] = createCombinedAnswerList(dataLists[sym], dataLists, syms, 2);
    priceLists[sym] = createTestPricesList(dataLists[sym], lookBack);
});

// console.log(answerLists["ABNB"].slice(2, 9));

const nets = {};
const testAnswerLists = {};
const testPriceLists = {};
syms.forEach((sym) => {
    // nets[sym] = new brain.NeuralNetwork();
    nets[sym] = createNetSet(numNets);
    const trainingData = answerLists[sym].slice(trainStart, trainEnd);
    console.log(`training ${sym} with ${trainingData.length} points...`);
    nets[sym].train(trainingData);
    testAnswerLists[sym] = answerLists[sym].slice(testStart, testEnd);
    testPriceLists[sym] = priceLists[sym].slice(testStart, testEnd);
});

// const testAnswerListSets = [testAnswerLists];
// const testPriceListSets = [testPriceLists];
// [
//     [590, 770],
//     [980, 1160],
//     [1370, 1550],
//     [1760, 1940]
// ].forEach((pair) => {
//     const newTestAnswerLists = {};
//     const newTestPriceLists = {};
//     syms.forEach((sym) => {
//         newTestAnswerLists[sym] = answerLists[sym].slice(pair[0], pair[1]);
//         newTestPriceLists[sym] = priceLists[sym].slice(pair[0], pair[1]);
//     });
//     testAnswerListSets.push(newTestAnswerLists);
//     testPriceListSets.push(newTestPriceLists);
// });


// runTestsStatic(syms, nets, testAnswerLists, testPriceLists);
const endAmts = [];

// for (let i = 0; i < testAnswerListSets.length; i++) {
//     const testAnswers = testAnswerListSets[i];
//     const priceLists = testPriceListSets[i];
//     runTestsDynamic(syms, nets, testAnswers, priceLists);
// }

// runTestsDynamic(syms, nets, testAnswers, priceLists);

runTestsDynamic(syms, nets, testAnswerLists, testPriceLists);

console.log(endAmts);

// console.log(nets["AMZN"].nets[0].toFunction().toString());


// functions below
function createNetSet(n = 5) {
    if (useSimpleNet) {
        return new NetSetNew(n);
    } else {
        return new NetSet(n);
    }
}

function runTestsDynamic(syms, nets, testAnswerLists, testPriceLists) {

    const keepAmts = [];
    const keepValues = {};
    const aiAmts = [];
    const heldStocks = [];

    console.log("If you start with $100:");
    syms.forEach((sym) => {
        const startPrice = testPriceLists[sym][0];
        const endPrice = testPriceLists[sym][testPriceLists[sym].length - 1];
        const allRatio = 1.0 * endPrice / startPrice;
        const endMoney = 100 * allRatio;
        console.log(`keep ${sym} end with: ${formatMoney(endMoney)}`);
        

        keepValues[sym] = [100.0 / syms.length];

    });
    
    // running test here
    let amt = 100;
    let own = -1; // will be idx in syms of stock owned, -1 means none

    let correct = 0;
    let wrong = 0;
    let ownTurns = 0;
    let cashTurns = 0;
    const ownChart = {};
    const rightWrongs = {};
    syms.forEach((sym) => {
        rightWrongs[sym] = {
            right: 0,
            wrong: 0
        }
    });
    let highCorrect = 0;
    let highWrong = 0;
    let lowCorrect = 0;
    let lowWrong = 0;
    let equal = 0;
    const high = buyThreshold;
    const low = sellShortThreshold;

    // start with regular training data
    const dynamicTrainingData = {};
    syms.forEach((sym) => {
        dynamicTrainingData[sym] = answerLists[sym].slice(trainStart, trainEnd);
    });

    const predictions = {}
    for (let i = 0; i < 1.0; i += 0.05) {
        predictions[i] = {
            up: 0,
            down: 0
        }
    }

    for (let i = 0; i < testAnswerLists[syms[0]].length; i++) {
        heldStocks.push(own);
        if (own > -1) {
            const lastPrice = testPriceLists[syms[own]][i - 1];
            const thisPrice = testPriceLists[syms[own]][i];
            const ratio = 1.0 * thisPrice / lastPrice;
            amt *= ratio;
            // amt *= (1.0 - spreadFraction);
        }

        aiAmts.push(amt);

        let amtSum = 0;
        syms.forEach((sym) => {
            if (i > 0) {
                const oldValue = keepValues[sym][keepValues[sym].length - 1];
                const ratio = testPriceLists[sym][i] / testPriceLists[sym][i - 1];
                const newValue = oldValue * ratio;
                keepValues[sym].push(newValue);
                amtSum += newValue;
            } else {
                amtSum += amt / syms.length;
            }
        });

        keepAmts.push(amtSum);

        if (i % tradeFrequency === 0) {
            own = -1; // will be overwritten if good option to own is found
        }

        let bestFound = buyThreshold; // only overwrite if better than 0.5 found
        if (useSimpleNet) {
            bestFound = -1000;
            // bestFound = 999;
            // bestFound = 0;
        }
        
        syms.forEach((sym, idx) => {
            const inputToUse = testAnswerLists[sym][i];
            // console.log(testAnswerLists[sym].length);
            const totalPrediction = nets[sym].run(inputToUse.input, inputToUse.output[0]);
            const prediction = totalPrediction[0];
            
            // console.log(prediction);
            
            
            const nums = Object.keys(predictions);
            const realAnswer = inputToUse.output[0];
            for (let i = 0; i < nums.length; i++) {
                if (prediction < Number.parseFloat(nums[i]) + 0.1) {
                    if (Math.round(realAnswer) === 1) {
                        predictions[nums[i]].up += 1;
                    } else {
                        predictions[nums[i]].down += 1;
                    }
                    break;
                }
            }
            


            // console.log(prediction);
            if (inputToUse.equal) {
                equal += 1;
            }
            if (!inputToUse.equal && Math.round(prediction) === Math.round(inputToUse.output[0])) {
                correct += 1;
                rightWrongs[sym].right += 1;
                if (prediction > high) {
                    highCorrect += 1;
                }
                if (prediction < low) {
                    lowCorrect += 1;
                }
            } else if (!inputToUse.equal) {
                wrong += 1;
                rightWrongs[sym].wrong += 1;
                if (prediction > high) {
                    highWrong += 1;
                }
                if (prediction < low) {
                    lowWrong += 1;
                }
            }

            if (i % tradeFrequency === 0) {
                // own = -1; // will be overwritten if good option to own is found
                // let bestFound = buyThreshold; // only overwrite if better than 0.5 found
                // if (useSimpleNet) {
                //     bestFound = -1000;
                // }
                if (useSimpleNet) {

                    if (prediction === 1) {
                        const howSure = totalPrediction[1];
                        if (howSure > bestFound) {
                            bestFound = howSure;
                            own = idx;
                        }
                    }
                } else {
                    if (prediction > bestFound) {
                        bestFound = prediction;
                        own = idx;
                    }
                }
            }
        });
        


        // retrain nets here!!!!!!!
        syms.forEach((sym) => {
            dynamicTrainingData[sym].push(testAnswerLists[sym][i]);
            if (i % retrainInterval === 0 && i > 0) {
                if (sym === syms[0]) {
                }
                // nets[sym] = new brain.NeuralNetwork();
                // nets[sym] = createNetSet(numNets);
                let trainingData = dynamicTrainingData[sym];
                trainingData = trainingData.slice(0, trainingData.length - tradeFrequency + 1);
                // const dataLength = trainEnd - trainStart;
                // if (trainingData.length > dataLength) {
                //     trainingData = trainingData.slice(trainingData.length - dataLength, trainingData.length);
                // }
                // const trainingData = dynamicTrainingData[sym].slice(dynamicTrainingData[sym].length - (trainEnd - trainStart), dynamicTrainingData[sym].length);
                console.log("retraining at " + i + " with " + trainingData.length + " points");
                // const trainingData = dynamicTrainingData[sym];
                nets[sym].retrain(trainingData);
            }
        });
        // end retraining

        if (own === -1) {
            cashTurns += 1;
        } else {
            ownTurns += 1;
        }
        if (ownChart[own]) {
            ownChart[own] += 1;
        } else {
            ownChart[own] = 1;
        }
    }

    let trades = 0;
    let lastStock = heldStocks[0];
    for (let i = 1; i < heldStocks.length; i++) {
        const thisStock = heldStocks[i];
        if (thisStock !== lastStock) {
            if (thisStock > -1) {
                trades += 1;
            }
            if (lastStock > -1) {
                trades += 1;
            }
        }
        lastStock = thisStock;
    }

    console.log("trades: " + trades + ", " + amt + " -> " + (amt * Math.pow((1 - spreadFraction), trades)));
    console.log(`Average ending amt: ${formatMoney(keepAmts[keepAmts.length - 1])}`);
    endAmts.push(amt);
    console.log("--------------------------");
    console.log(`Ending amt with ai: ${formatMoney(amt)}`);
    console.log("--------------------------");
    console.log("correct: " + correct);
    console.log("wrong: " + wrong);
    console.log("equal: " + equal);
    console.log("ownTurns: " + ownTurns);
    console.log("cashTurns: " + cashTurns);
    console.log("highCorrect: " + highCorrect);
    console.log("highWrong: " + highWrong);
    console.log("lowCorrect: " + lowCorrect);
    console.log("lowWrong: " + lowWrong);
    console.log(rightWrongs);
    console.log(ownChart);
    // syms.forEach((sym) => {
    //     console.log(sym + ":");
    //     nets[sym].print();
    // });
    // aiAmts.forEach((n, i) => {
    //     if (i % 1 === 0) {
    //         console.log(n);
    //     }
    // });
    // console.log("&&&&&&&&&&&");
    // keepAmts.forEach((n, i) => {
    //     if (i % 1 === 0) {
    //         console.log(n);
    //     }
    // });
    // predictions.forEach((n) => {
    //     console.log(n);
    // });
    // console.log(predictions);

    console.log("guess ratio: " + 1.0 * correct / wrong);
    syms.forEach((sym) => {
        nets[sym].print(true);
    });
}

function runTestsSellShort(syms, nets, testAnswerLists, testPriceLists) {

    const keepAmts = [];
    const keepValues = {};
    const aiAmts = [];
    const ratios = [];

    console.log("If you start with $100:");
    syms.forEach((sym) => {
        const startPrice = testPriceLists[sym][0];
        const endPrice = testPriceLists[sym][testPriceLists[sym].length - 1];
        const allRatio = 1.0 * endPrice / startPrice;
        const endMoney = 100 * allRatio;
        console.log(`keep ${sym} end with: ${formatMoney(endMoney)}`);
        

        keepValues[sym] = [100.0 / syms.length];

    });
    
    // running test here
    let amt = 100;
    let own = -1; // will be idx in syms of stock owned, -1 means none

    let correct = 0;
    let wrong = 0;
    let ownTurns = 0;
    let cashTurns = 0;
    const ownChart = {};
    let highCorrect = 0;
    let highWrong = 0;
    let lowCorrect = 0;
    let lowWrong = 0;
    const high = buyThreshold;
    const low = sellShortThreshold;

    // start with regular training data
    const dynamicTrainingData = {};
    syms.forEach((sym) => {
        dynamicTrainingData[sym] = answerLists[sym].slice(trainStart, trainEnd);
    });

    const predictions = {}
    for (let i = 0; i < 1.0; i += 0.05) {
        predictions[i] = {
            up: 0,
            down: 0
        }
    }

    for (let i = 0; i < testAnswerLists[syms[0]].length; i++) {
        if (own > -1) {
            const lastPrice = testPriceLists[syms[own]][i - 1];
            const thisPrice = testPriceLists[syms[own]][i];
            const ratio = 1.0 * thisPrice / lastPrice;
            amt /= ratio;
            ratios.push(ratio);
        }

        aiAmts.push(amt);

        let amtSum = 0;
        syms.forEach((sym) => {
            if (i > 0) {
                const oldValue = keepValues[sym][keepValues[sym].length - 1];
                const ratio = testPriceLists[sym][i] / testPriceLists[sym][i - 1];
                const newValue = oldValue * ratio;
                keepValues[sym].push(newValue);
                amtSum += newValue;
            }
        });

        keepAmts.push(amtSum);

        own = -1; // will be overwritten if good option to own is found
        let lowestFound = sellShortThreshold; // only overwrite if lower than threshold
        syms.forEach((sym, idx) => {
            const inputToUse = testAnswerLists[sym][i];
            // console.log(testAnswerLists[sym].length);
            const prediction = nets[sym].run(inputToUse.input)[0];
            
            
            const nums = Object.keys(predictions);
            const realAnswer = inputToUse.output[0];
            for (let i = 0; i < nums.length; i++) {
                if (prediction < Number.parseFloat(nums[i]) + 0.1) {
                    if (realAnswer === 1) {
                        predictions[nums[i]].up += 1;
                    } else {
                        predictions[nums[i]].down += 1;
                    }
                    break;
                }
            }
            


            // console.log(prediction);
            if (!inputToUse.equal && Math.round(prediction) === inputToUse.output[0]) {
                correct += 1;
                if (prediction > high) {
                    highCorrect += 1;
                }
                if (prediction < low) {
                    lowCorrect += 1;
                }
            } else if (!inputToUse.equal) {
                wrong += 1;
                if (prediction > high) {
                    highWrong += 1;
                }
                if (prediction < low) {
                    lowWrong += 1;
                }
            }
            if (prediction < lowestFound) {
                bestFound = prediction;
                own = idx;
            }
        });

        // retrain nets here!!!!!!!
        syms.forEach((sym) => {
            dynamicTrainingData[sym].push(testAnswerLists[sym][i]);
            if (i % retrainInterval === 0 && i > 0) {
                if (sym === syms[0]) {
                    console.log("retraining at " + i);
                }
                // nets[sym] = new brain.NeuralNetwork();
                nets[sym] = createNetSet(numNets);
                const trainingData = dynamicTrainingData[sym].slice(dynamicTrainingData[sym].length - (trainEnd - trainStart), dynamicTrainingData[sym].length);
                // const trainingData = dynamicTrainingData[sym];
                nets[sym].train(trainingData);
            }
        });
        // end retraining

        if (own === -1) {
            cashTurns += 1;
        } else {
            ownTurns += 1;
        }
        if (ownChart[own]) {
            ownChart[own] += 1;
        } else {
            ownChart[own] = 1;
        }
    }

    console.log(`Average ending amt: ${formatMoney(keepAmts[keepAmts.length - 1])}`);
    endAmts.push(amt);
    console.log("--------------------------");
    console.log(`Ending amt with ai: ${formatMoney(amt)}`);
    console.log("--------------------------");
    console.log("correct: " + correct);
    console.log("wrong: " + wrong);
    console.log("ownTurns: " + ownTurns);
    console.log("cashTurns: " + cashTurns);
    console.log("highCorrect: " + highCorrect);
    console.log("highWrong: " + highWrong);
    console.log("lowCorrect: " + lowCorrect);
    console.log("lowWrong: " + lowWrong);
    console.log(ownChart);
    // aiAmts.forEach((n) => {
    //     console.log(n);
    // });
    // console.log("&&&&&&&&&&&");
    // keepAmts.forEach((n) => {
    //     console.log(n);
    // });
    // ratios.forEach((n) => {
    //     console.log(n);
    // });
    // predictions.forEach((n) => {
    //     console.log(n);
    // });
    // console.log(predictions);

}

function createTestPricesList(dataList, lookBack) {
    const prices = [];
    for (let i = lookBack; i < dataList.length - 1; i++) {
        prices.push(dataList[i].price);
    }
    return prices;
}


function formatMoney(n) {
    let bigger = 100.0 * n;
    let round = Math.round(bigger);
    let backToSmall = round / 100.0;
    return `$${backToSmall}`;
}