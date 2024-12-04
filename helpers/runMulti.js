const { formatMoney } = require("./util.js");

function runMulti(testAnswerLists, testPriceLists, trainingLists, nets, params) {
    const retrainInterval = params.retrainInterval;
    const buyThreshold = params.buyThreshold;
    const spreadFraction = params.spreadFraction;
    const useSimpleNet = params.useSimpleNet;
    const tradeInterval = params.tradeInterval;
    const buyTop = params.buyTopNum;
    const useFewestNegatives = params.useFewestNegatives;
    
    const syms = Object.keys(testAnswerLists);

    const keepAmts = [];
    const keepValues = {};
    const aiAmts = [];
    const heldStocks = [];

    console.log("If you start with $100:");
    syms.forEach((sym) => {
        const startPrice = testPriceLists[sym][0];
        const endPrice = testPriceLists[sym][testPriceLists[sym].length - 1];
        const ratio = 1.0 * endPrice.price / startPrice.price;
        const endMoney = 100 * ratio;
        console.log(`keep ${sym} end with: ${formatMoney(endMoney)}`);
        keepValues[sym] = [100.0 / syms.length];
    });

    let amt = 100;
    let amts = [];
    let own = [];
    for (let i = 0; i < buyTop; i++) {
        own.push(-1);
        amts.push(100.0 / buyTop);
    }
    
    let correct = 0;
    let wrong = 0;
    
    let ups = 0;
    let downs = 0;

    let correctUp = 0;
    let wrongUp = 0;

    let usedUpRight = 0;
    let usedUpWrong = 0;

    const stockData = {};
    syms.forEach((sym) => {
        stockData[sym] = {
            up: 0,
            down: 0
        }
    });

    for (let i = 0; i < testAnswerLists[syms[0]].length; i++) {
        heldStocks.push(own.map(ele => ele));
        own.forEach((stockIdx, j) => {
            if (stockIdx > -1) {
                const lastPrice = testPriceLists[syms[stockIdx]][i - 1].price;
                const thisPrice = testPriceLists[syms[stockIdx]][i].price;
                const ratio = 1.0 * thisPrice / lastPrice;
                amts[j] *= ratio;

                if (ratio > 1) {
                    stockData[syms[stockIdx]].up += 1;
                } else {
                    stockData[syms[stockIdx]].down += 1;
                }
            }
        });

        let totalAmt = 0;
        amts.forEach((n) => {
            totalAmt += n;
        });
        aiAmts.push(totalAmt);
        amt = totalAmt;

        let amtSum = 0;
        syms.forEach((sym) => {
            if (i > 0) {
                const oldValue = keepValues[sym][keepValues[sym].length - 1];
                const ratio = testPriceLists[sym][i].price / testPriceLists[sym][i - 1].price;
                const newValue = oldValue * ratio;
                keepValues[sym].push(newValue);
                amtSum += newValue;
            } else {
                amtSum += amt / syms.length;
            }
        });
        keepAmts.push(amtSum);

        let thisRight = false;

        if (i % tradeInterval === 0) {
            for (let j = 0; j < own.length; j++) {
                own[j] = -1;
                let bestFound = buyThreshold;
                if (useSimpleNet) {
                    if (useFewestNegatives) {
                        bestFound = -100000;
                    } else {
                        bestFound = params.bestFoundStart === undefined ? 1 : params.bestFoundStart;
                    }
                }
                syms.forEach((sym, idx) => {
                    const inputToUse = testAnswerLists[sym][i];
                    const totalPrediction = nets[sym].run(inputToUse.input, inputToUse.answerDiff);
                    const prediction = totalPrediction[0];
        
                    if (Math.round(prediction) === Math.round(inputToUse.output[0])) {
                        correct += 1;
                        if (Math.round(prediction) === 1) {
                            correctUp += 1;
                        }
                    } else {
                        wrong += 1;
                        if (Math.round(prediction) === 1) {
                            wrongUp += 1;
                        }
                    }

                    if (Math.round(inputToUse.output[0]) === 1) {
                        ups += 1;
                    } else {
                        downs += 1;
                    }
        
                    if (useSimpleNet) {
                        if (prediction === 1) {
                            const howSure = totalPrediction[1];
                            if (howSure > bestFound && !own.slice(0, j).includes(idx)) {
                            // if (howSure > bestFound && (howSure === 1000 || (howSure > 1.0 && howSure < 3))) {
                                bestFound = howSure;
                                own[j] = idx;
                                if (Math.round(prediction) === Math.round(inputToUse.output[0])) {
                                    thisRight = true;
                                } else {
                                    thisRight = false;
                                }
                            }
                        }
                    } else {
                        if (prediction > bestFound && !own.slice(0, j).includes(idx)) {
                            bestFound = prediction;
                            own[j] = idx;
                        }
                    }
                });
            }
        }
        // else - we had a provision to sell here if the prediction was low enough

        // retrain ------------------------ retrain
        syms.forEach((sym) => {
            if (params.keepTrainLength) {
                trainingLists[sym].push(testAnswerLists[sym][i]);
                trainingLists[sym].shift();
                if (i % retrainInterval === 0 && i > 0) {
                    // console.log("retraining " + sym + " at " + i + " with " + trainingLists[sym].length + " points");
                    nets[sym].retrain(trainingLists[sym]);
                }
            } else {
                trainingLists[sym] = [(testAnswerLists[sym][i])];
                if (i % retrainInterval === 0 && i > 0) {
                    // console.log("retraining " + sym + " at " + i + " with " + trainingLists[sym].length + " points");
                    nets[sym].trainMore(trainingLists[sym]);
                }
            }
        });
        if (own > -1) {
            if (thisRight) {
                usedUpRight += 1;
            } else {
                usedUpWrong += 1;
            }
        }
        // end retrain ----------------- end retrain


        // if (i === testAnswerLists[syms[0]].length - 2) {
        //     console.log("Second to last:");
        //     const thisAnswerEntry = testAnswerLists[syms[0]][i];
        //     console.log(thisAnswerEntry.date);
        //     console.log(thisAnswerEntry);
        //     console.log("hold: " + syms[own]);
        // }
        if (i === testAnswerLists[syms[0]].length - 1) {
            console.log("ok now last really");
            const thisAnswerEntry = testAnswerLists[syms[0]][i];
            console.log(thisAnswerEntry.date);
            // console.log(thisAnswerEntry);
            console.log("hold: " + syms[own[0]]);
            // console.log(own);
        }

    }

    let trades = 0;
    for (let i = 0; i < heldStocks[0].length; i++) {
        const theseStocks = heldStocks.map((ele) => {
            return ele[i]
        });
        let lastStock = theseStocks[0];
        for (let j = 1; j < theseStocks.length; j++) {
            const thisStock = theseStocks[j];
            if (thisStock !== lastStock) {
                if (thisStock > -1) {
                    trades += 1;
                }
                if (lastStock > -1) {
                    trades += 1;
                }
            }
            lastStock = thisStock
        }
    }
    const realEndAmt = amt * Math.pow((1 - spreadFraction), trades);

    // aiAmts.forEach((n) => {
    //     // console.log(`${n},`);
    //     console.log(n);
    // });
    // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    // keepAmts.forEach((n) => {
    //     console.log(n);
    // });

    console.log("");
    console.log(`Average ending amt: ${formatMoney(keepAmts[keepAmts.length - 1])}`);
    console.log("--------------------------");
    console.log(`Ending amt with ai: ${formatMoney(amt)}`);
    console.log("--------------------------");
    console.log("trades: " + trades + ", " + amt + " -> " + formatMoney(realEndAmt));
    console.log("");
    console.log("ups: " + ups);
    console.log("downs: " + downs);
    console.log("guess ratio: " + correct / wrong);
    console.log("correct: " + correct);
    console.log("wrong: " + wrong);
    console.log("--------------------------");
    console.log("UP ONLY guess ratio: " + correctUp / wrongUp);
    console.log("correct up: " + correctUp);
    console.log("wrong up: " + wrongUp);
    console.log("used up correct: " + usedUpRight);
    console.log("used up wrong: " + usedUpWrong);
    console.log("used up ratio: " + usedUpRight / usedUpWrong);
    console.log(frequencyTable(flattenOneLevel(heldStocks).map(ele => syms[ele] ? syms[ele] : "KEEP")));
    console.log(stockData);
    // console.log(heldStocks);
    // syms.forEach((sym) => {
    //     console.log(nets[sym].answerData);
    // });

    // const ratios = nets["QQQ"].answerData.map(ele => ele.ratio).slice(5, 505);
    // const diffs = nets["QQQ"].answerData.map(ele => ele.answerDiff).slice(5, 505);
    // ratios.forEach((n) => {
    //     console.log(n);
    // });
    // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    // diffs.forEach((n) => {
    //     console.log(n);
    // });

    console.log(combineNetData(nets));

    return [aiAmts[aiAmts.length - 1], realEndAmt, keepAmts[keepAmts.length - 1]];
}

// function runMulti(testAnswerLists, testPriceLists, trainingLists, nets, params) {
//     const retrainInterval = params.retrainInterval;
//     const buyThreshold = params.buyThreshold;
//     const spreadFraction = params.spreadFraction;
//     const useSimpleNet = params.useSimpleNet;
//     const tradeInterval = params.tradeInterval;
//     const buyTop = params.buyTopNum;
    
//     const syms = Object.keys(testAnswerLists);

//     const keepAmts = [];
//     const keepValues = {};
//     const aiAmts = [];
//     const heldStocks = [];

//     console.log("If you start with $100:");
//     syms.forEach((sym) => {
//         const startPrice = testPriceLists[sym][0];
//         const endPrice = testPriceLists[sym][testPriceLists[sym].length - 1];
//         const ratio = 1.0 * endPrice.price / startPrice.price;
//         const endMoney = 100 * ratio;
//         console.log(`keep ${sym} end with: ${formatMoney(endMoney)}`);
//         keepValues[sym] = [100.0 / syms.length];
//     });

//     let amt = 100;
//     let own = -1;
    
//     let correct = 0;
//     let wrong = 0;
    
//     let ups = 0;
//     let downs = 0;

//     let correctUp = 0;
//     let wrongUp = 0;

//     for (let i = 0; i < testAnswerLists[syms[0]].length; i++) {
//         heldStocks.push(own);
//         if (own > -1) {
//             const lastPrice = testPriceLists[syms[own]][i - 1].price;
//             const thisPrice = testPriceLists[syms[own]][i].price;
//             const ratio = 1.0 * thisPrice / lastPrice;
//             amt *= ratio;
//         }
//         aiAmts.push(amt);

//         let amtSum = 0;
//         syms.forEach((sym) => {
//             if (i > 0) {
//                 const oldValue = keepValues[sym][keepValues[sym].length - 1];
//                 const ratio = testPriceLists[sym][i].price / testPriceLists[sym][i - 1].price;
//                 const newValue = oldValue * ratio;
//                 keepValues[sym].push(newValue);
//                 amtSum += newValue;
//             } else {
//                 amtSum += amt / syms.length;
//             }
//         });
//         keepAmts.push(amtSum);

//         if (i % tradeInterval === 0) {
//             own = -1;
//             let bestFound = buyThreshold;
//             if (useSimpleNet) {
//                 // bestFound = -100000;
//                 bestFound = params.bestFoundStart === undefined ? 1 : params.bestFoundStart;
//             }
//             syms.forEach((sym, idx) => {
//                 const inputToUse = testAnswerLists[sym][i];
//                 const totalPrediction = nets[sym].run(inputToUse.input, inputToUse.answerDiff);
//                 const prediction = totalPrediction[0];
    
//                 if (Math.round(prediction) === Math.round(inputToUse.output[0])) {
//                     correct += 1;
//                     if (Math.round(prediction) === 1) {
//                         correctUp += 1;
//                     }
//                 } else {
//                     wrong += 1;
//                     if (Math.round(prediction) === 1) {
//                         wrongUp += 1;
//                     }
//                 }

//                 if (Math.round(inputToUse.output[0]) === 1) {
//                     ups += 1;
//                 } else {
//                     downs += 1;
//                 }
    
//                 if (useSimpleNet) {
//                     if (prediction === 1) {
//                         const howSure = totalPrediction[1];
//                         if (howSure > bestFound) {
//                         // if (howSure > bestFound && (howSure === 1000 || (howSure > 1.0 && howSure < 3))) {
//                             bestFound = howSure;
//                             own = idx;
//                         }
//                     }
//                 } else {
//                     if (prediction > bestFound) {
//                         bestFound = prediction;
//                         own = idx;
//                     }
//                 }
//             });
//         } else if (own > -1) {
//             const prediction = nets[syms[own]].run(testAnswerLists[syms[own]][i].input)[0];
//             const offset = i % tradeInterval;
//             if (Math.round(prediction) === 0 && testPriceLists[syms[own]][i].price > testPriceLists[syms[own]][i - offset].price) {
//                 own = -1;
//             }
//         }

//         // retrain ------------------------ retrain
//         syms.forEach((sym) => {
//             // trainingLists[sym].push(testAnswerLists[sym][i]);
//             // if (i % retrainInterval === 0 && i > 0) {
//             //     console.log("retraining " + sym + " at " + i + " with " + trainingLists[sym].length + " points");
//             //     nets[sym].retrain(trainingLists[sym]);
//             // }
//             trainingLists[sym] = [(testAnswerLists[sym][i])];
//             if (i % retrainInterval === 0 && i > 0) {
//                 console.log("retraining " + sym + " at " + i + " with " + trainingLists[sym].length + " points");
//                 nets[sym].trainMore(trainingLists[sym]);
//             }
//         });
//         // end retrain ----------------- end retrain
//     }

//     let trades = 0;
//     let lastStock = heldStocks[0];
//     for (let i = 1; i < heldStocks.length; i++) {
//         const thisStock = heldStocks[i];
//         if (thisStock !== lastStock) {
//             if (thisStock > -1) {
//                 trades += 1;
//             }
//             if (lastStock > -1) {
//                 trades += 1;
//             }
//         }
//         lastStock = thisStock;
//     }

//     aiAmts.forEach((n) => {
//         console.log(`${n},`);
//     });
//     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
//     // keepAmts.forEach((n) => {
//     //     console.log(n);
//     // });

//     console.log("");
//     console.log(`Average ending amt: ${formatMoney(keepAmts[keepAmts.length - 1])}`);
//     console.log("--------------------------");
//     console.log(`Ending amt with ai: ${formatMoney(amt)}`);
//     console.log("--------------------------");
//     console.log("trades: " + trades + ", " + amt + " -> " + formatMoney(amt * Math.pow((1 - spreadFraction), trades)));
//     console.log("");
//     console.log("ups: " + ups);
//     console.log("downs: " + downs);
//     console.log("guess ratio: " + correct / wrong);
//     console.log("correct: " + correct);
//     console.log("wrong: " + wrong);
//     console.log("--------------------------");
//     console.log("UP ONLY guess ratio: " + correctUp / wrongUp);
//     console.log("correct up: " + correctUp);
//     console.log("wrong up: " + wrongUp);
//     console.log(frequencyTable(heldStocks.map(ele => syms[ele] ? syms[ele] : "KEEP")));
//     // syms.forEach((sym) => {
//     //     console.log(nets[sym].answerData);
//     // });

//     // const ratios = nets["QQQ"].answerData.map(ele => ele.ratio).slice(5, 505);
//     // const diffs = nets["QQQ"].answerData.map(ele => ele.answerDiff).slice(5, 505);
//     // ratios.forEach((n) => {
//     //     console.log(n);
//     // });
//     // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
//     // diffs.forEach((n) => {
//     //     console.log(n);
//     // });

//     console.log(combineNetData(nets));
// }

function flattenOneLevel(arr) {
    const answer = [];
    arr.forEach((subArr) => {
        subArr.forEach((ele) => {
            answer.push(ele);
        });
    });
    return answer;
}

function frequencyTable(arr) {
    const answer = {};
    arr.forEach((ele) => {
        if (answer[ele]) {
            answer[ele] += 1;
        } else {
            answer[ele] = 1;
        }
    });
    return answer;
}

function combineNetData(nets) {
    let withData = 0;
    let noData = 0;
    Object.keys(nets).forEach((sym) => {
        withData += nets[sym].withData;
        noData += nets[sym].noData;
    });
    return {
        data: withData,
        noData: noData
    };
}

module.exports = { runMulti };