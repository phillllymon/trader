const {
    formatMoney
} = require("./util.js");

/*
params : {
    retrainInterval: 100,
    startAmt: 100
}
*/


function runSingle(testAnswers, testPrices, net, trainAnswers, params) {
    
    const retrainAnswers = trainAnswers.map(ele => ele);

    console.log("testing on " + testAnswers.length + " data points");
    let amt = 100;
    if (params.startAmt) {
        amt = params.startAmt;
    }
    console.log("start amt: " + formatMoney(amt));
    const totalRatio = 1.0 * testPrices[testPrices.length - 1] / testPrices[0];
    console.log("keep end emt: " + formatMoney(totalRatio * amt));

    let own = false;

    let right = 0;
    let wrong = 0;
    let buyTurns = 0;
    let sellTurns = 0;
    let upGuesses = 0;
    let dnGuesses = 0;
    let ups = 0;
    let downs = 0;

    let amts = [];
    let keepAmts = [];

    for (let i = 0; i < testAnswers.length; i++) {

        if (own) {
            const ratio = 1.0 * testPrices[i] / testPrices[i - 1];
            amt *= ratio;
            buyTurns += 1;
        } else {
            sellTurns += 1;
        }

        const prediction = net.run(testAnswers[i].input)[0];
        own = prediction > params.buyThreshold;

        if (Math.round(prediction) === Math.round(testAnswers[i].output[0])) {
            right += 1;
        } else {
            wrong += 1;
        }

        if (prediction > 0.5) {
            upGuesses += 1;
        } else {
            dnGuesses += 1;
        }

        if (testPrices[i] > testPrices[i - 1]) {
            ups += 1;
        } else {
            downs += 1;
        }

        amts.push(amt);
        if (i === 0) {
            keepAmts.push(amt);
        } else {
            keepAmts.push(1.0 * testPrices[i] / testPrices[i - 1] * keepAmts[keepAmts.length - 1]);
        }


        // retrain
        if (!params.increaseTraining) {
            retrainAnswers.shift();
        }
        retrainAnswers.push(testAnswers[i]);
        if (i > 0 && i % params.retrainInterval === 0) {
            console.log("retrain at " + i);
            console.log("retraining with " + retrainAnswers.length + " data points...");
            net.retrain(retrainAnswers);
        }
        // retrain

    }

    amts.forEach((n) => {
        console.log(n);
    });
    console.log("&&&&&&&&&");
    keepAmts.forEach((n) => {
        console.log(n);
    });

    console.log("guess ratio: " + right / wrong);
    console.log("right: " + right);
    console.log("wrong: " + wrong);
    console.log("up guesses: " + upGuesses);
    console.log("dn guesses: " + dnGuesses);
    console.log("ups: " + ups);
    console.log("downs: " + downs);
    console.log("buy turns: " + buyTurns);
    console.log("sell turns: " + sellTurns);
    console.log("ai end amt: " + formatMoney(amt));
}

module.exports = { runSingle };