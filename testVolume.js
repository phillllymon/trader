const brain = require("brain.js");

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
    run(data) {
        let sum = 0;
        this.nets.forEach((net) =>{
            sum += net.run(data)[0];
        });
        return [1.0 * sum / this.nets.length];
    }
    serialize() {
        return JSON.stringify(this.nets.map((net) => {
            return net.toFunction().toString();
        }));
    }
}

const {
    nov11,
    nov12,
    nov13,
    nov14,
    nov15
} = require("./rawDataMinutely.js");

// params
// -------
const lookBack = 5;
const trainStart = 150;
const trainEnd = 200;
const testStart = 200;
const testEnd = 4000;
const numNets = 5;
const retrainInterval = 2000;
const buyThreshold = 0.5;
const sellShortThreshold = 0.2;
const useRealPrice = false;
const useRealVol = false;
const useVolDiff = false;
const usePriceDiff = false;
const usePriceDir = true;
const useVolDir = true;
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
});

// Object.keys(combined).forEach((sym) => {
//     nov15[sym].forEach((val, i) => {
//         if (i % 1 === 0) {
//             combined[sym].push(val);
//         }
//     });
// });


// const dataToUse = nov11;
const dataToUse = combined;




const syms = Object.keys(dataToUse);

const dataLists = {};

syms.forEach((sym) => {
    let lastPrice = 0;
    dataLists[sym] = [];
    dataToUse[sym].forEach((snapshot) => {
        let price = Number.parseFloat(snapshot.price);
        let vol = Number.parseFloat(snapshot.vol);
        if (Number.isNaN(price)) {
            price = lastPrice;
            vol = 0;
        }
        dataLists[sym].push({
            time: snapshot.time,
            price: price,
            vol: vol
        });
        lastPrice = price;
    });
    dataLists[sym].sort((a, b) => {
        if (a.time > b.time) {
            return 1;
        } else {
            return -1;
        }
    });
    // dataLists[sym].forEach((snapshot) => {
    //     console.log(snapshot);
    // });
});


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
    answerLists[sym] = createAnswerList(dataLists[sym], lookBack);
    // answerLists[sym] = createCombinedAnswerList(dataLists[sym], dataLists, syms, 2);
    priceLists[sym] = createTestPricesList(dataLists[sym], lookBack);
});

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


// runTestsStatic(syms, nets, testAnswerLists, testPriceLists);
const endAmts = [];

runTestsDynamic(syms, nets, testAnswerLists, testPriceLists);
// runTestsSellShort(syms, nets, testAnswerLists, testPriceLists);

console.log(endAmts);

// console.log(nets["AMZN"].nets[0].toFunction().toString());


// functions below
function createNetSet(n = 5) {
    return new NetSet(n);
    // const nets = [];
    // for (let i = 0; i < n; i++) {
    //     nets.push(new brain.NeuralNetwork());
    // }
    // return {
    //     train: (data) => {
    //         const dataToUse = [];
    //         let used = 0;
    //         let thrownOut = 0;
    //         data.forEach((dataPiece) => {
    //             if (!dataPiece.equal) {
    //                 dataToUse.push(dataPiece);
    //                 used += 1;
    //             } else {
    //                 thrownOut += 1;
    //             }
    //         });
    //         // console.log("using " + used);
    //         // console.log("throwing " + thrownOut);
    //         nets.forEach((net) => {
    //             // net.train(data);
    //             net.train(dataToUse);
    //         });
    //     },
    //     run: (data) => {
    //         let sum = 0;
    //         nets.forEach((net) =>{
    //             sum += net.run(data)[0];
    //         });
    //         return [1.0 * sum / nets.length];
    //     }
    // }
}

function runTestsDynamic(syms, nets, testAnswerLists, testPriceLists) {

    const keepAmts = [];
    const keepValues = {};
    const aiAmts = [];

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
            amt *= ratio;
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
        let bestFound = buyThreshold; // only overwrite if better than 0.5 found
        syms.forEach((sym, idx) => {
            const inputToUse = testAnswerLists[sym][i];
            // console.log(testAnswerLists[sym].length);
            const prediction = nets[sym].run(inputToUse.input)[0];
            
            
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
            if (prediction > bestFound) {
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
    console.log(rightWrongs);
    console.log(ownChart);
    // aiAmts.forEach((n) => {
    //     console.log(n);
    // });
    // console.log("&&&&&&&&&&&");
    // keepAmts.forEach((n) => {
    //     console.log(n);
    // });
    // predictions.forEach((n) => {
    //     console.log(n);
    // });
    // console.log(predictions);
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

function createCombinedAnswerList(dataList, dataLists, syms, lookBack = 1) {
    const answers = [];
    for (let i = lookBack; i < dataList.length - 1; i++) {
        const arr = [];
        syms.forEach((sym) => {
            const thisDataList = dataLists[sym];
            for (let j = i - lookBack; j < i; j++) {
                if (usePriceDir) {
                    if (thisDataList[j + 1].price > thisDataList[j].price) {
                        arr.push(1);
                    } else {
                        arr.push(0);
                    }
                }
            }
            for (let j = i - lookBack; j < i; j++) {
                if (useVolDir) {
                    if (thisDataList[j + 1].vol > thisDataList[j].vol) {
                        arr.push(1);
                    } else {
                        arr.push(0);
                    }
                }
            }
        });
        const ans = dataList[i + 1].price > dataList[i].price ? 1 : 0;
        answers.push({ input: arr, output: [ans] });
    }
    return answers;
}

function createAnswerList(dataList, lookBack) {
    const answers = [];
    let min = 1000000;
    let max = -1000000;
    let minVol = -10000000000;
    let maxVol = 10000000000;
    
    for (let i = lookBack; i < dataList.length - 1; i++) {
        if (dataList[i + 1].price - dataList[i].price < min) {
            min = dataList[i + 1].price - dataList[i].price;
        }
        if (dataList[i + 1].price - dataList[i].price > max) {
            max = dataList[i + 1].price - dataList[i].price;
        }
        if (dataList[i + 1].vol - dataList[i].vol < minVol) {
            minVol = dataList[i + 1].vol - dataList[i].vol;
        }
        if (dataList[i + 1].vol - dataList[i].vol > maxVol) {
            maxVol = dataList[i + 1].vol - dataList[i].vol;
        }
    }
    const fractions = [];
    for (let i = lookBack; i < dataList.length - 1; i++) {
        const arr = [];
        for (let j = i - lookBack; j < i; j++) {
            if (usePriceDir) {
                if (dataList[j + 1].price > dataList[j].price) {
                    arr.push(1);
                } else {
                    arr.push(0);
                }
            }
        }
        for (let j = i - lookBack; j < i; j++) {
            if (useVolDir) {
                if (dataList[j + 1].vol > dataList[j].vol) {
                    arr.push(1);
                } else {
                    arr.push(0);
                }
            }
        }
        for (let j = i - lookBack; j < i; j++) {
            if (usePriceDiff) {
                arr.push(dataList[j + 1].price - dataList[j].price);
            }
        }
        for (let j = i - lookBack; j < i; j++) {
            if (useVolDiff) {
                arr.push(dataList[j + 1].vol - dataList[j].vol);
                // const thisDiff = dataList[j + 1].vol - dataList[j].vol;
                // let fraction = 0.5 + Math.min((1.0 * thisDiff / maxVol / 1.5), 0.5);
                // if (thisDiff < 0) {
                //     fraction = 0.5 - Math.min((1.0 * thisDiff / minVol / 1.5), 0.5);
                // }
                // arr.push(fraction);
            }
        }
        for (let j = i - lookBack; j < i; j++) {
            if (useRealPrice) {
                arr.push(dataList[j + 1].price);
            }
        }
        for (let j = i - lookBack; j < i; j++) {
            if (useRealVol) {
                arr.push(dataList[j + 1].vol);
            }
        }
        const ans = dataList[i + 1].price > dataList[i].price ? 1 : 0;

        // let ans = 0.5;
        // if (dataList[i + 1].price > dataList[i].price) {
        //     ans = 1;
        // }
        // if (dataList[i + 1].price < dataList[i].price) {
        //     ans = 0;
        // }

        const thisDiff = dataList[i + 1].price - dataList[i].price;
        // let fraction = 0.5 + (1.0 * thisDiff / max / 2);
        // if (thisDiff < 0) {
        //     fraction = 0.5 - (1.0 * thisDiff / min / 2);
        // }

        let fraction = 0.5 + Math.min((1.0 * thisDiff / max / 1.5), 0.5);
        if (thisDiff < 0) {
            fraction = 0.5 - Math.min((1.0 * thisDiff / min / 1.5), 0.5);
        }


        
        fractions.push(fraction);

        // answers.push({ input: arr, output: [ans], equal: dataList[i + 1].price === dataList[i].price });
        answers.push({ input: arr, output: [fraction], equal: dataList[i + 1].price === dataList[i].price, time: dataList[i].time });

    }
    let sum = 0;
    fractions.forEach((n) => {
        sum += n;
        // console.log(n);
    });
    // console.log("ave fraction: " + sum / fractions.length);
    return answers;
}


function formatMoney(n) {
    let bigger = 100.0 * n;
    let round = Math.round(bigger);
    let backToSmall = round / 100.0;
    return `$${backToSmall}`;
}