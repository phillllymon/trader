// extract from yahoo finance table closing price per day and volume
const prices = [];
const eles = document.getElementsByClassName("yf-j5d1ld");
console.log(eles.length);
console.log(eles[47]);
console.log(eles[47].children);
console.log(eles[47].tagName);
console.log(eles[47].children[5]);
for (let i = 0; i < eles.length; i++) {
    const ele = eles[i];
    if (ele.tagName === "TR" && ele.children.length === 7) {
        prices.push({
            price: ele.children[5].innerText.split(",").join(""),
            volume: ele.children[6].innerText.split(",").join("")
        });
    }
}
let str = "[\n";
prices.forEach((ele, i) => {
    if (i > 0) {

        str = str + `{name: "ABNB", price: ${ele.price}, volume: ${ele.volume}},\n`
    }
});
str = str + "]";
console.log(str);

// extract specified number of rows from yahoo finance table closing price per day
function deComma(input) {
    return input.split(",").join("");
}
const prices = [];
const eles = document.getElementsByClassName("yf-j5d1ld"); /// NOTE: this changes!!!!

const rowsToGet = 1; // ROWS HERE!!!!!!!

for (let i = 0; i < eles.length; i++) {
    const ele = eles[i];
    if (ele.tagName === "TR" && ele.children.length === 7) {
        prices.push({
            date: ele.children[0].innerText,
            open: deComma(ele.children[1].innerText),
            high: deComma(ele.children[2].innerText),
            low: deComma(ele.children[3].innerText),
            close: deComma(ele.children[5].innerText),
            vol: deComma(ele.children[6].innerText)
        });
    }
}
let str = "[\n";
prices.forEach((n, i) => {
    if (i > 0 && i < rowsToGet + 1) {

        str = str + `{date: "${n.date}", open: ${n.open}, high: ${n.high}, low: ${n.low}, close: ${n.close}, vol: ${n.vol}},\n`
    }
});
str = str + "]";
console.log(str);


// extract from yahoo finance table closing price per day
function deComma(input) {
    return input.split(",").join("");
}
const prices = [];
const eles = document.getElementsByClassName("yf-j5d1ld"); /// NOTE: this changes!!!!

for (let i = 0; i < eles.length; i++) {
    const ele = eles[i];
    if (ele.tagName === "TR" && ele.children.length === 7) {
        prices.push({
            date: ele.children[0].innerText,
            open: deComma(ele.children[1].innerText),
            high: deComma(ele.children[2].innerText),
            low: deComma(ele.children[3].innerText),
            close: deComma(ele.children[5].innerText),
            vol: deComma(ele.children[6].innerText)
        });
    }
}
let str = "[\n";
prices.forEach((n, i) => {
    if (i > 0) {

        str = str + `{date: "${n.date}", open: ${n.open}, high: ${n.high}, low: ${n.low}, close: ${n.close}, vol: ${n.vol}},\n`
    }
});
str = str + "]";
console.log(str);

// grab every 30 seconds between the specified times from google finance real time
let n = 0;
setInterval(() => {
    const now = Date.now();
    console.log(now);
    if (now > 1731333600000 && now < 1731358800000) {
        fetch("https://graffiti.red/API/public/", {
            method: "POST",
            body: JSON.stringify({
                action: "set",
                name: `${n}priceCOST11/11`,
                value: `${document.getElementsByClassName("YMlKec fxKbKc")[0].innerText}-${now}`
            })
        }).then((res) => {
            res.json().then((r) => {
                console.log(r);
            });
        });
        n += 1;
    }
}, 30000);

// grab every 30 seconds from yahoo finance price and volume (note: volume appears to be total of the day, so the number just increases)
let n = 0;
setInterval(() => {
    const now = Date.now();
    console.log(now);
    if (now > 1731333600000 && now < 1731358800000) {
        const price = document.getElementsByClassName("d60f3b00 c956d6fc")[0].innerText;
        const wholeTitle = document.getElementsByClassName("yf-xxbei9")[0].innerText;
        const sym = wholeTitle.split(")")[0].split("(")[1];
        const volume = document.querySelector('[data-field="regularMarketVolume"]').children[0].innerText;
        const info = {
            price: price,
            volume: volume
        };
        fetch("https://graffiti.red/API/public/", {
            method: "POST",
            body: JSON.stringify({
                action: "set",
                name: `${sym}-${now}`,
                value: JSON.stringify(info)
            })
        }).then((res) => {
            res.json().then((r) => {
                console.log(r);
            });
        });
        n += 1;
    }
}, 30000);

const answer = [];
const checkInterval = setInterval(() => {
    const now = Date.now();
    console.log(now);
    if (now > 1731333600000 && now < 1731359460000) {
        const price = document.getElementsByClassName("livePrice")[0].firstChild.innerText;
        const wholeTitle = document.getElementsByClassName("yf-xxbei9")[0].innerText;
        const sym = wholeTitle.split(")")[0].split("(")[1];
        const volume = document.querySelector('[data-field="regularMarketVolume"]').innerText;
        const info = {
            sym: sym,
            price: price,
            volume: volume
        };
        answer.push(info);
    }
    if (now > 1731359460000) {
        let str = "[\n";
        answer.forEach((ans) => {
            str = str + `{ sym: ${ans.sym}, price: ${ans.price}, volume: ${ans.volume} },\n`;
        });
        str = str + "]";
        console.log(str);
        clearInterval(checkInterval);
    }
}, 30000);

document.querySelector('[hu-tooltip-field="DT"]').children[1].innerText;

// for yahoo finance 1 day chart at end of day - exctracts and prints minutely price and volume
let animating = true;
const quotes = {};

document.addEventListener("click", () => {
    animating = false;
    let str = "[\n";
    Object.keys(quotes).forEach((key) => {
        str = str + `{ time: "${key}", price: ${quotes[key].price}, vol: ${quotes[key].volume}, open: ${quotes[key].open}, high: ${quotes[key].high}, low: ${quotes[key].low} },\n`;
    });
    str = str + "]";
    console.log(str);
});

function animate() {
    const time = document.querySelector('[hu-tooltip-field="DT"]').children[1].innerText;
    if (!quotes[time]) {
        console.log(Object.keys(quotes).length);
        try {
            const price = document.querySelector('[hu-tooltip-field="Close"]').children[1].innerText.split(",").join("");
            const volume = document.querySelector('[hu-tooltip-field="Volume"]').children[1].innerText.split(",").join("");
            const open = document.querySelector('[hu-tooltip-field="Open"]').children[1].innerText.split(",").join("");
            const high = document.querySelector('[hu-tooltip-field="High"]').children[1].innerText.split(",").join("");
            const low = document.querySelector('[hu-tooltip-field="Low"]').children[1].innerText.split(",").join("");
            quotes[time] = {
                price: `"${price}"`,
                volume: `"${volume}"`,
                open: `"${open}"`,
                high: `"${high}"`,
                low: `"${low}"`
            };
        } catch (err) {
            console.log("none found");
        }
    }
    if (animating) {
        requestAnimationFrame(animate);
    }
}

animate();


