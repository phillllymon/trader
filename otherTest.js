// fetch("https://graffiti.red/API/public/", {
//     method: "POST",
//     body: JSON.stringify({
//         action: "set",
//         name: `priceGBTC${Date.now()}`,
//         value: document.getElementsByClassName("YMlKec fxKbKc")[0].innerText
//     })
// }).then((res) => {
//     res.json().then((r) => {
//         console.log(r);
//     });
// });

// let n = 0;
// setInterval(() => {
//     const now = Date.now();
//     console.log(now);
//     if (now > 1730727000000 && now < 1730750400000) {
//         fetch("https://graffiti.red/API/public/", {
//             method: "POST",
//             body: JSON.stringify({
//                 action: "set",
//                 name: `${n}priceGBTC`,
//                 value: `${document.getElementsByClassName("YMlKec fxKbKc")[0].innerText}-${now}`
//             })
//         }).then((res) => {
//             res.json().then((r) => {
//                 console.log(r);
//             });
//         });
//         n += 1;
//     }
// }, 60000);

// let str = "[\n";
// fetch("https://graffiti.red/API/public/getAllPrices.php", {
//     method: "POST"
// }).then((res) => {
//     res.json().then((r) => {
//         // console.log(r);
//         r.value.forEach((bit) => {
//             str = str + `{ name: "${bit.name.split("price")[1]}", time: ${bit.value.split("-")[1]}, price: ${bit.value.split("-")[0].slice(1)} },\n`;
//         });
//         str = str + "]";
//         console.log(str);
//     });
// }).catch((err) => {
//     console.log("ERROR");
//     console.log(err.message);
// });

const myDate = new Date("2024-11-11T13:11:00-08:00");
console.log(myDate.getTime());




