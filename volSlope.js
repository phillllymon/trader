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

const dayToUse = nov11;
const stockToUse = "COST";

dayToUse[stockToUse].forEach((snapshot) => {
    console.log(snapshot.vol);
});
console.log("--------------------------------");
// dayToUse[stockToUse].forEach((snapshot) => {
//     console.log(snapshot.price);
// });