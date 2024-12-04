
/*
params: {
    lookBack: 10,
    normalizeFactor: 1.5,
    normalizeOutput: true, // (if false, output is simply 1, 0, or 0.5)
    useForAnswer: "close",
    close: {
        useDiff: true,
        useDir: true,
        useActual: true,
        normalizeDiff: true
    },
    open: { ... },
    high: { ... },
    low: { ... },
    vol: { ... }
}
*/

function createAnswersMulti(unsortedDataList, paramsArr, sortByTime = false) { // this time params is an array

    const dataList = unsortedDataList.map((ele) => {
        const eleToReturn = {};
        Object.keys(ele).forEach((key) => {
            // if (key === "date" || key === "time") {
                eleToReturn[key] = ele[key];
            // } else {
                // eleToReturn[key] = Number.parseFloat(ele[key]);
            // }
        });
        return eleToReturn;
    });

    if (sortByTime) {
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

    // const dataList = unsortedDataList;


    const maxLookBack = Math.max(...paramsArr.map(ele => ele.lookBack));
    const answers = [];
    
    // console.log(dataList.slice(dataList.length - 3, dataList.length));
    // throw("fit");
    for (let i = maxLookBack; i < dataList.length - 0; i++) {
        
        const outerArr = [];

        paramsArr.forEach((params) => {
            const arr = [];
            const lookBack = params.lookBack;

            [
                "high",
                "low",
                "open",
                "close",
                "vol",
                "price",
                "trend"
            ].forEach((priceType) => {
                const theseParams = params[priceType];
                if (theseParams) {
                    // for normalizing
                    let min = dataList[i - lookBack + 1][priceType] - dataList[i - lookBack][priceType];
                    let max = dataList[i - lookBack + 1][priceType] - dataList[i - lookBack][priceType];
                    if (theseParams.normalizeDiff) {
                        for (let j = i - lookBack; j < i; j++) {
                            const thisDiff = dataList[j + 1][priceType] - dataList[j][priceType];
                            if (thisDiff < min) {
                                min = thisDiff;
                            }
                            if (thisDiff > max) {
                                max = thisDiff;
                            }
                        }
                    }
                    let maxActual = dataList[i - lookBack + 1][priceType];
                    let minActual = dataList[i - lookBack + 1][priceType];
                    if (theseParams.normalizeActual) {
                        for (let j = i - lookBack; j < i; j++) {
                            const thisActual = dataList[j + 1][priceType];
                            if (thisActual < minActual) {
                                minActual = thisActual;
                            }
                            if (thisActual > maxActual) {
                                maxActual = thisActual;
                            }
                        }
                    }
                    for (let j = i - lookBack; j < i; j++) {
                        if (theseParams.useDir) {
                            if (dataList[j + 1][priceType] > dataList[j][priceType]) {
                                arr.push(1);
                            } else if (dataList[j + 1][priceType] === dataList[j][priceType]) {
                                arr.push(0.5);
                            } else {
                                arr.push(0);
                            }
                        }
                        if (theseParams.useDirDir && j > i - lookBack) {
                            if (dataList[j + 1][priceType] - dataList[j][priceType] > dataList[j][priceType] - dataList[j - 1][priceType]) {
                                arr.push(1);
                            } else if (dataList[j + 1][priceType] - dataList[j][priceType] === dataList[j][priceType] - dataList[j - 1][priceType]) {
                                arr.push(0.5);
                            } else {
                                arr.push(0);
                            }
                        }
                        if (theseParams.useActual) {
                            if (theseParams.normalizeActual) {
                                const thisActual = dataList[j + 1][priceType];
                                let fraction = (thisActual - minActual) / (maxActual - minActual);
                                if (maxActual === minActual) {
                                    fraction = 0.5;
                                }
                                arr.push(fraction);
                            } else if (theseParams.minimizeActual) {
                                let factor = 1;
                                const testVal = dataList[i - lookBack + 1][priceType];
                                while (1.0 * testVal / factor > 1) {
                                    factor += 1;
                                }
                                arr.push(1.0 * dataList[j + 1][priceType] / factor);
                            } else {
                                arr.push(dataList[j + 1][priceType]);
                            }
                        }
                        if (theseParams.useDiff) {
                            if (theseParams.normalizeDiff) {
                                const thisDiff = dataList[j + 1][priceType] - dataList[j][priceType];
                                let fraction = 0.5 + Math.min((1.0 * thisDiff / max / params.normalizeFactor), 0.5);
                                if (max === 0) { // prevent rare cases of fraction being NaN
                                    fraction = 0;
                                }
                                if (thisDiff < 0) {
                                    fraction = 0.5 - Math.min((1.0 * thisDiff / min / params.normalizeFactor), 0.5);
                                    if (min === 0) { // prevent rare cases of fraction being NaN
                                        fraction = 0;
                                    }
                                }
    
                                // TEMP
                                fraction -= 0.5;
                                fraction *= params.normalizeFactor;
                                // END TEMP
    
                                if (i < 20) {
                                    // console.log(fraction, min, max);
                                }
                                if (fraction === NaN) {
                                    console.log(fraction);
                                }
                                arr.push(fraction);
                            } else {
                                arr.push(dataList[j + 1][priceType] - dataList[j][priceType]);
                            }
                        }
                    }
                }
            });
            outerArr.push(arr);
        });


        let lastEntry = false;
        if (!dataList[i + 1]) {
            lastEntry = true;
        }

        const answerDiff = lastEntry ? 0 : dataList[i + 1][paramsArr[0].useForAnswer] - dataList[i][paramsArr[0].useForAnswer];
        let minAnswer = answerDiff;
        let maxAnswer = answerDiff;
        let outputAnswer = lastEntry ? "no idea" : answerDiff > 0 ? 1 : answerDiff === 0 ? 0.5 : 0;
        // let outputAnswer = answerDiff < 0 ? 1 : answerDiff === 0 ? 0.5 : 0;
        // let outputAnswer = answerDiff > 0 ? 1 : 0;
        if (paramsArr[0].normalizeOutput) {
            for (let j = i - lookBack; j < i; j++) {
                const thisAnswer = dataList[j + 1][paramsArr[0].useForAnswer] - dataList[j][paramsArr[0].useForAnswer];
                if (thisAnswer < minAnswer) {
                    minAnswer = thisAnswer;
                }
                if (thisAnswer > maxAnswer) {
                    maxAnswer = thisAnswer;
                }
            }
            outputAnswer = 0.5 + Math.min((1.0 * answerDiff / maxAnswer / paramsArr[0].normalizeFactor), 0.5);
            if (maxAnswer === 0) {
                outputAnswer = 1;
            }
            if (answerDiff < 0) {
                outputAnswer = 0.5 - Math.min((1.0 * answerDiff / minAnswer / paramsArr[0].normalizeFactor), 0.5);
                if (minAnswer === 0) {
                    outputAnswer = 0;
                }
            }
        }
        
        answers.push({
            input: outerArr, output: [outputAnswer],
            date: dataList[i].date, time: dataList[i].time,
            equal: lastEntry ? false : dataList[i + 1][paramsArr[0].useForAnswer] === dataList[i][paramsArr[0].useForAnswer],
            answerDiff: lastEntry ? 0 : dataList[i + 1][paramsArr[0].useForAnswer] - dataList[i][paramsArr[0].useForAnswer],
            percentDiff: lastEntry ? "no idea" : 1.0 * (dataList[i + 1][paramsArr[0].useForAnswer] - dataList[i][paramsArr[0].useForAnswer]) / dataList[i][paramsArr[0].useForAnswer],
            // price: dataList[i][paramsArr[0].useForAnswer],
            // nextPrice: dataList[i + 1][paramsArr[0].useForAnswer]
        });
    }
    
    
    return answers;
}

function createAnswers(unsortedDataList, params, sortByTime = false) {

    const dataList = unsortedDataList.map((ele) => {
        const eleToReturn = {};
        Object.keys(ele).forEach((key) => {
            // if (key === "date" || key === "time") {
                eleToReturn[key] = ele[key];
            // } else {
                // eleToReturn[key] = Number.parseFloat(ele[key]);
            // }
        });
        return eleToReturn;
    });

    if (sortByTime) {
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

    // const dataList = unsortedDataList;


    const lookBack = params.lookBack;
    const answers = [];

    
    
    for (let i = lookBack; i < dataList.length - 0; i++) {
        
        // EXP ********
        const answerDiffs = [0];
        const nToUse = 1;
        if (i > nToUse) {
            for (let j = i - (nToUse); j < i; j++) {
                // answerDiffs.push(dataList[j][params.useForAnswer] / dataList[j - 1][params.useForAnswer]);
                answerDiffs.push(dataList[j][params.useForAnswer] - dataList[j - 1][params.useForAnswer]);
            }
        }
        // ^EXP^
        
        const arr = [];
        [
            "high",
            "low",
            "open",
            "close",
            "vol",
            "price",
            "trend"
        ].forEach((priceType) => {
            const theseParams = params[priceType];
            if (theseParams) {
                // console.log(theseParams);
                // throw("git");
                // for normalizing
                let min = dataList[i - lookBack + 1][priceType] - dataList[i - lookBack][priceType];
                let max = dataList[i - lookBack + 1][priceType] - dataList[i - lookBack][priceType];
                if (theseParams.normalizeDiff) {
                    for (let j = i - lookBack; j < i; j++) {
                        const thisDiff = dataList[j + 1][priceType] - dataList[j][priceType];
                        if (thisDiff < min) {
                            min = thisDiff;
                        }
                        if (thisDiff > max) {
                            max = thisDiff;
                        }
                    }
                }
                let maxActual = dataList[i - lookBack + 1][priceType];
                let minActual = dataList[i - lookBack + 1][priceType];
                if (theseParams.normalizeActual) {
                    for (let j = i - lookBack; j < i; j++) {
                        const thisActual = dataList[j + 1][priceType];
                        if (thisActual < minActual) {
                            minActual = thisActual;
                        }
                        if (thisActual > maxActual) {
                            maxActual = thisActual;
                        }
                    }
                }
                for (let j = i - lookBack; j < i; j++) {
                    if (theseParams.useDir) {
                        if (dataList[j + 1][priceType] > dataList[j][priceType]) {
                            arr.push(1);
                        } else if (dataList[j + 1][priceType] === dataList[j][priceType]) {
                            arr.push(0.5);
                        } else {
                            arr.push(0);
                        }
                    }
                    if (theseParams.useDirDir && j > i - lookBack) {
                        if (dataList[j + 1][priceType] - dataList[j][priceType] > dataList[j][priceType] - dataList[j - 1][priceType]) {
                            arr.push(1);
                        } else if (dataList[j + 1][priceType] - dataList[j][priceType] === dataList[j][priceType] - dataList[j - 1][priceType]) {
                            arr.push(0.5);
                        } else {
                            arr.push(0);
                        }
                    }
                    if (theseParams.useActual) {
                        if (theseParams.normalizeActual) {
                            const thisActual = dataList[j + 1][priceType];
                            let fraction = (thisActual - minActual) / (maxActual - minActual);
                            if (maxActual === minActual) {
                                fraction = 0.5;
                            }
                            arr.push(fraction);
                        } else if (theseParams.minimizeActual) {
                            let factor = 1;
                            const testVal = dataList[i - lookBack + 1][priceType];
                            while (1.0 * testVal / factor > 1) {
                                factor += 1;
                            }
                            arr.push(1.0 * dataList[j + 1][priceType] / factor);
                        } else {
                            arr.push(dataList[j + 1][priceType]);
                        }
                    }
                    if (theseParams.useDiff) {
                        if (theseParams.normalizeDiff) {
                            const thisDiff = dataList[j + 1][priceType] - dataList[j][priceType];
                            let fraction = 0.5 + Math.min((1.0 * thisDiff / max / params.normalizeFactor), 0.5);
                            if (max === 0) { // prevent rare cases of fraction being NaN
                                fraction = 0;
                            }
                            if (thisDiff < 0) {
                                fraction = 0.5 - Math.min((1.0 * thisDiff / min / params.normalizeFactor), 0.5);
                                if (min === 0) { // prevent rare cases of fraction being NaN
                                    fraction = 0;
                                }
                            }

                            // TEMP
                            fraction -= 0.5;
                            fraction *= params.normalizeFactor;
                            // END TEMP

                            if (i < 20) {
                                // console.log(fraction, min, max);
                            }
                            if (fraction === NaN) {
                                console.log(fraction);
                            }
                            arr.push(fraction);
                        } else {
                            arr.push(dataList[j + 1][priceType] - dataList[j][priceType]);
                        }
                    }
                }
            }
        });
        const lastOne = i === dataList.length - 1;
        const answerDiff = lastOne ? 0 : dataList[i + 1][params.useForAnswer] - dataList[i][params.useForAnswer];
        let minAnswer = answerDiff;
        let maxAnswer = answerDiff;
        let outputAnswer = answerDiff > 0 ? 1 : answerDiff === 0 ? 0.5 : 0;
        // let outputAnswer = answerDiff < 0 ? 1 : answerDiff === 0 ? 0.5 : 0;
        // let outputAnswer = answerDiff > 0 ? 1 : 0;
        if (params.normalizeOutput) {
            for (let j = i - lookBack; j < i; j++) {
                const thisAnswer = dataList[j + 1][params.useForAnswer] - dataList[j][params.useForAnswer];
                if (thisAnswer < minAnswer) {
                    minAnswer = thisAnswer;
                }
                if (thisAnswer > maxAnswer) {
                    maxAnswer = thisAnswer;
                }
            }
            outputAnswer = 0.5 + Math.min((1.0 * answerDiff / maxAnswer / params.normalizeFactor), 0.5);
            if (maxAnswer === 0) {
                outputAnswer = 1;
            }
            if (answerDiff < 0) {
                outputAnswer = 0.5 - Math.min((1.0 * answerDiff / minAnswer / params.normalizeFactor), 0.5);
                if (minAnswer === 0) {
                    outputAnswer = 0;
                }
            }
        }

        // EXP *******************
        // const answerRatio = dataList[i + aheadDist][params.useForAnswer] / dataList[i][params.useForAnswer];
        // // console.log(answerDiffs, answerRatio);
        // if (answerDiff > Math.max(...answerDiffs)) {
        //     outputAnswer = 1;
        // } else {
        //     outputAnswer = 0;
        // }
        // const answerRatio = dataList[i + aheadDist][params.useForAnswer] / dataList[i][params.useForAnswer];
        // if (answerRatio > 1.03) {
        //     outputAnswer = 1;
        // } else {
        //     outputAnswer = 0;
        // }
        // console.log(answerDiffs, answerDiff, outputAnswer);
        
        answers.push({
            input: arr, output: [outputAnswer],
            date: dataList[i].date, time: dataList[i].time,
            equal: lastOne ? false : dataList[i + 1][params.useForAnswer] === dataList[i][params.useForAnswer],
            answerDiff: lastOne ? "no idea" : dataList[i + 1][params.useForAnswer] - dataList[i][params.useForAnswer],
            percentDiff: lastOne ? "no idea" : 1.0 * (dataList[i + 1][params.useForAnswer] - dataList[i][params.useForAnswer]) / dataList[i][params.useForAnswer],
            
            // price: dataList[i][params.useForAnswer],
            // nextPrice: dataList[i + 1][params.useForAnswer]
        });
    }
    
    
    return answers;
}

module.exports = { createAnswers, createAnswersMulti };