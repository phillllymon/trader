
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


// extract entire history table from yahoo finance
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


