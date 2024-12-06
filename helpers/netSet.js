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
        return [1.0 * sum / this.nets.length];
    }
    serialize() {
        return JSON.stringify(this.nets.map((net) => {
            return net.toFunction().toString();
        }));
    }

    print() {
        console.log("nothnig to report");
    }
}

class TallyNetSet {
    constructor(n, factor = 1, table = {}, useFewestNegatives = false) {
        this.greaterFactor = factor;
        this.table = table;
        this.withData = 0;
        this.noData = 0;
        this.dataAmts = [];
        this.answerData = [];
        this.useFewestNegatives = useFewestNegatives;
    }

    train(data) {
        data.forEach((point) => {
            // console.log("*******");
            // console.log(point);
            // console.log("*******");
            // throw("");
            const inputStr = point.input.join("-");
            if (!this.table[inputStr]) {
                this.table[inputStr] = {
                    up: 0,
                    down: 0,
                    totalGain: 1
                }
            }
            const answer = point.output[0];
            if (!point.equal) {
                // if (point.answerDiff > 0) {
                //     this.table[inputStr].up += point.percentDiff;
                // } else {
                //     this.table[inputStr].down += -1.0 * point.percentDiff;
                // }
                if (answer > 0.5) {
                    this.table[inputStr].up += 1;
                } else {
                    this.table[inputStr].down += 1;
                }
                this.table[inputStr].totalGain *= 1.0 + point.percentDiff;
            }
        });
    }

    retrain(data) {
        // console.log("***************************");
        // console.log(data);
        // console.log("***************************");
        this.table = {};
        this.train(data);
    }

    trainMore(data) {
        this.train(data);
    }

    run(data, answerDiff, defaultToKeep = false) {

        // RETURN CORRECT ANSWER
        // if (answerDiff > 0) {
        //     return [1, 1000];
        // } else {
        //     return [0];
        // }
        // END RETURN CORRECT

        // RETURN SPECIFIC
        // if (!data.includes(0)) {
        // // if (data[0] === 1 && data[1] === 1 && data[0] === 1) {
        //     return [1, 1000];
        // } else {
        //     return [0];
        // }
        // END RETURN SPECIFIC

        const str = data.join("-");
        if (this.table[str]) {
            this.answerData.push({
                ups: this.table[str].up,
                downs: this.table[str].down,
                ratio: this.table[str].up / this.table[str].down,
                answerDiff: answerDiff
            });
            this.withData += 1;
            this.dataAmts.push(this.table[str].up + this.table[str].down);
            // if (this.table[str].up > this.greaterFactor * this.table[str].down && this.table[str].totalGain > 0) {
            if (this.table[str].up > this.greaterFactor * this.table[str].down) {
                if (this.useFewestNegatives) {
                    return [1, -1.0 * this.table[str].down];
                }
                let howSure = 1000;
                if (this.table[str].down > 0) {
                    howSure = this.table[str].up / this.table[str].down;
                }
                // howSure *= this.table[str].totalGain;
                // return [1, this.table[str].totalGain];
                return [1, howSure];
            } else if (this.table[str].up < this.table[str].down) {
                let howSure = 1000;
                if (this.table[str].up > 0) {
                    howSure = this.table[str].down / this.table[str].up;
                }
                return [0, howSure];
            } else {
                // return [0.5];
                return defaultToKeep ? [1] : [0];
            }
        }
        this.noData += 1;
        // return [Math.random()];
        // return [1, -999];
        return [0, 0];
        // return [0];
    }

    print() {
        console.log("with data: " + this.withData);
        console.log("no data: " + this.noData);
        console.log("data amt: " + arrAverage(this.dataAmts));
    }

    printTable() {
        console.log(this.table);
    }
}

class TallyNetGroup {
    constructor(n, factor = 1, table = {}, useFewestNegatives = false) {
        this.nets = [];
        for (let i = 0; i < n; i++) {
            this.nets.push(new TallyNetSet(n, factor, table, useFewestNegatives));
        }
        this.withData = 0;
        this.noData = 0;
    }
    train(dataSets) {
        this.nets.forEach((net, i) => {
            net.train(dataSets.map((multiSnapshot) => {
                // console.log(multiSnapshot.input[i]);
                // throw("fit");
                const eleToReturn = {
                    input: multiSnapshot.input[i].map(ele => ele),
                    output: multiSnapshot.output.map(ele => ele),
                    date: multiSnapshot.date,
                    time: multiSnapshot.time,
                    equal: multiSnapshot.equal,
                    answerDiff: multiSnapshot.answerDiff,
                    percentDiff: multiSnapshot.percentDiff
                }
                // const eleToReturn = multiSnapshot;
                // if (typeof eleToReturn.input === "Array") {
                //     eleToReturn.input = multiSnapshot.input[i];
                // }
                return eleToReturn;
            }));
        });
    }
    retrain(dataSets) {
        // console.log("***************************");
        // console.log(dataSets);
        // console.log("***************************");
        this.nets.forEach((net, i) => {
            net.retrain(dataSets.map((multiSnapshot) => {
                const eleToReturn = {
                    input: multiSnapshot.input[i].map(ele => ele),
                    output: multiSnapshot.output.map(ele => ele),
                    date: multiSnapshot.date,
                    time: multiSnapshot.time,
                    equal: multiSnapshot.equal,
                    answerDiff: multiSnapshot.answerDiff,
                    percentDiff: multiSnapshot.percentDiff
                }
                // const eleToReturn = multiSnapshot;
                // if (typeof eleToReturn.input === "Array") {
                //     eleToReturn.input = multiSnapshot.input[i];
                // }
                return eleToReturn;
            }));
        });
    }
    trainMore(dataSets) {
        this.nets.forEach((net, i) => {
            net.trainMore(dataSets.map((multiSnapshot) => {
                const eleToReturn = {
                    input: multiSnapshot.input[i].map(ele => ele),
                    output: multiSnapshot.output.map(ele => ele),
                    date: multiSnapshot.date,
                    time: multiSnapshot.time,
                    equal: multiSnapshot.equal,
                    answerDiff: multiSnapshot.answerDiff,
                    percentDiff: multiSnapshot.percentDiff
                }
                // const eleToReturn = multiSnapshot;
                // if (typeof eleToReturn.input === "Array") {
                //     eleToReturn.input = multiSnapshot.input[i];
                // }
                return eleToReturn;
            }));
        });
    }
    run(data, answerDiff) {

        // return this.nets[0].run(data, answerDiff);

        // console.log(data);
        let answerSum = 0;
        let sureSum = 0;

        this.withData = 0;
        this.noData = 0;

        this.nets.forEach((net, i) => {
            // console.log(i);
            const prediction = net.run(data[i], answerDiff);
            answerSum += Math.round(prediction[0]);
            if (prediction[1] !== undefined) {
                sureSum += prediction[1];
            }
            this.withData += net.withData;
            this.noData += net.noData;
        });

        if (answerSum === this.nets.length) {
        // if (answerSum > 0) {
        // if (answerSum > 1.0 * this.nets.length / 2) {
            return [1, sureSum];
        } else {
            return [0, sureSum];
        }
    }
    print() {
        this.nets.forEach((net) => {
            net.print();
        });
    }
    printTable() {
        this.nets.forEach((net) => {
            net.printTable();
        });
    }
}

function arrAverage(arr) {
    let sum = 0;
    arr.forEach((n) => {
        sum += n;
    });
    return sum / arr.length;
}

module.exports = {
    NetSet,
    TallyNetSet,
    TallyNetGroup
};