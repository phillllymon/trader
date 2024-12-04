const brain = require("brain.js");

const net = new brain.NeuralNetwork();

let data = [
    {time: 1730727025566, val: 55.01},
    {time: 1730733025549, val: 54.33},
    {time: 1730733085549, val: 54.26},
    {time: 1730733145542, val: 54.34},
    {time: 1730733205530, val: 54.28},
    {time: 1730733265530, val: 54.28},
    {time: 1730733325529, val: 54.21},
    {time: 1730733385528, val: 54.23},
    {time: 1730733445526, val: 54.31},
    {time: 1730733505528, val: 54.32},
    {time: 1730733565528, val: 54.32},
    {time: 1730727625563, val: 55.01},
    {time: 1730733625526, val: 54.29},
    {time: 1730733685527, val: 54.29},
    {time: 1730733745527, val: 54.29},
    {time: 1730733805526, val: 54.24},
    {time: 1730733865526, val: 54.24},
    {time: 1730733925526, val: 54.24},
    {time: 1730733985526, val: 54.37},
    {time: 1730734045526, val: 54.33},
    {time: 1730734105526, val: 54.40},
    {time: 1730734165525, val: 54.38},
    {time: 1730727685563, val: 55.01},
    {time: 1730734225525, val: 54.38},
    {time: 1730734285524, val: 54.33},
    {time: 1730734345524, val: 54.34},
    {time: 1730734405524, val: 54.36},
    {time: 1730734465524, val: 54.29},
    {time: 1730734525511, val: 54.33},
    {time: 1730734585510, val: 54.32},
    {time: 1730734645507, val: 54.32},
    {time: 1730734705507, val: 54.36},
    {time: 1730734765508, val: 54.36},
    {time: 1730727745562, val: 55.01},
    {time: 1730734825508, val: 54.36},
    {time: 1730734885507, val: 54.36},
    {time: 1730734945507, val: 54.30},
    {time: 1730735005507, val: 54.31},
    {time: 1730735065505, val: 54.38},
    {time: 1730735125505, val: 54.37},
    {time: 1730735185506, val: 54.38},
    {time: 1730735245505, val: 54.38},
    {time: 1730735305505, val: 54.38},
    {time: 1730735365504, val: 54.38},
    {time: 1730727805562, val: 55.01},
    {time: 1730735425503, val: 54.43},
    {time: 1730735485503, val: 54.49},
    {time: 1730735545503, val: 54.54},
    {time: 1730735605502, val: 54.54},
    {time: 1730735665500, val: 54.57},
    {time: 1730735725502, val: 54.57},
    {time: 1730735785515, val: 54.52},
    {time: 1730735845519, val: 54.47},
    {time: 1730735905518, val: 54.49},
    {time: 1730735965519, val: 54.57},
    {time: 1730727865543, val: 55.01},
    {time: 1730736025519, val: 54.57},
    {time: 1730736085519, val: 54.53},
    {time: 1730736145517, val: 54.51},
    {time: 1730736205518, val: 54.47},
    {time: 1730736265518, val: 54.47},
    {time: 1730736325517, val: 54.47},
    {time: 1730736385518, val: 54.41},
    {time: 1730736445517, val: 54.41},
    {time: 1730736505517, val: 54.41},
    {time: 1730736565515, val: 54.52},
    {time: 1730727925541, val: 55.01},
    {time: 1730736625518, val: 54.52},
    {time: 1730736685517, val: 54.52},
    {time: 1730736745517, val: 54.67},
    {time: 1730736805517, val: 54.63},
    {time: 1730736865516, val: 54.63},
    {time: 1730736925515, val: 54.63},
    {time: 1730736985516, val: 54.51},
    {time: 1730737045516, val: 54.42},
    {time: 1730737105514, val: 54.37},
    {time: 1730737165534, val: 54.36},
    {time: 1730727985541, val: 55.01},
    {time: 1730737225544, val: 54.36},
    {time: 1730737285543, val: 54.36},
    {time: 1730737345544, val: 54.36},
    {time: 1730737405545, val: 54.37},
    {time: 1730737465545, val: 54.32},
    {time: 1730737525546, val: 54.27},
    {time: 1730737585545, val: 54.28},
    {time: 1730737645546, val: 54.28},
    {time: 1730737705546, val: 54.28},
    {time: 1730737765545, val: 54.28},
    {time: 1730728045538, val: 55.01},
    {time: 1730737825545, val: 54.28},
    {time: 1730737885546, val: 54.28},
    {time: 1730737945547, val: 54.18},
    {time: 1730738005547, val: 54.22},
    {time: 1730738065547, val: 54.29},
    {time: 1730738125547, val: 54.24},
    {time: 1730738185548, val: 54.26},
    {time: 1730738245547, val: 54.26},
    {time: 1730738305548, val: 54.23},
    {time: 1730738365549, val: 54.20},
    {time: 1730728105539, val: 55.01},
    {time: 1730738425549, val: 54.16},
    {time: 1730738485557, val: 54.09},
    {time: 1730738545557, val: 54.08},
    {time: 1730738605558, val: 54.08},
    {time: 1730738665559, val: 53.96},
    {time: 1730738725559, val: 53.96},
    {time: 1730738785559, val: 53.95},
    {time: 1730738845561, val: 53.92},
    {time: 1730738905562, val: 53.98},
    {time: 1730738965562, val: 53.95},
    {time: 1730728165539, val: 55.01},
    {time: 1730727085564, val: 55.01},
    {time: 1730739025562, val: 53.93},
    {time: 1730739085563, val: 53.86},
    {time: 1730739145563, val: 53.88},
    {time: 1730739205562, val: 53.81},
    {time: 1730739265564, val: 53.83},
    {time: 1730739325564, val: 53.84},
    {time: 1730739385565, val: 53.74},
    {time: 1730739445565, val: 53.77},
    {time: 1730739505565, val: 53.72},
    {time: 1730739565566, val: 53.70},
    {time: 1730728225538, val: 55.01},
    {time: 1730739625566, val: 53.77},
    {time: 1730739685567, val: 53.78},
    {time: 1730739745567, val: 53.70},
    {time: 1730739805565, val: 53.66},
    {time: 1730739865566, val: 53.63},
    {time: 1730739925566, val: 53.64},
    {time: 1730739985567, val: 53.66},
    {time: 1730740045567, val: 53.61},
    {time: 1730740105566, val: 53.69},
    {time: 1730740165568, val: 53.66},
    {time: 1730728285538, val: 55.01},
    {time: 1730740225568, val: 53.61},
    {time: 1730740285569, val: 53.66},
    {time: 1730740345568, val: 53.65},
    {time: 1730740405570, val: 53.57},
    {time: 1730740465569, val: 53.55},
    {time: 1730740525569, val: 53.57},
    {time: 1730740585571, val: 53.59},
    {time: 1730740645570, val: 53.56},
    {time: 1730740705571, val: 53.56},
    {time: 1730740765571, val: 53.56},
    {time: 1730728345537, val: 55.01},
    {time: 1730740825571, val: 53.47},
    {time: 1730740885573, val: 53.54},
    {time: 1730740945573, val: 53.67},
    {time: 1730741005573, val: 53.64},
    {time: 1730741065573, val: 53.73},
    {time: 1730741125533, val: 53.73},
    {time: 1730741185529, val: 53.75},
    {time: 1730741245529, val: 53.83},
    {time: 1730741305528, val: 53.85},
    {time: 1730741365529, val: 53.86},
    {time: 1730728405536, val: 55.01},
    {time: 1730741425527, val: 53.83},
    {time: 1730741485527, val: 53.90},
    {time: 1730741545525, val: 53.90},
    {time: 1730741605526, val: 53.86},
    {time: 1730741665526, val: 53.84},
    {time: 1730741725525, val: 53.92},
    {time: 1730741785526, val: 53.92},
    {time: 1730741845526, val: 53.95},
    {time: 1730741905525, val: 53.95},
    {time: 1730741965523, val: 53.76},
    {time: 1730728465536, val: 55.01},
    {time: 1730742025523, val: 53.76},
    {time: 1730742085524, val: 53.86},
    {time: 1730742145524, val: 53.86},
    {time: 1730742205524, val: 53.78},
    {time: 1730742265524, val: 53.88},
    {time: 1730742325523, val: 53.87},
    {time: 1730742385521, val: 53.87},
    {time: 1730742445539, val: 53.87},
    {time: 1730742505542, val: 53.87},
    {time: 1730742565541, val: 53.87},
    {time: 1730728525534, val: 55.01},
    {time: 1730742625541, val: 53.87},
    {time: 1730742685541, val: 53.89},
    {time: 1730742745540, val: 53.89},
    {time: 1730742805542, val: 53.89},
    {time: 1730742865541, val: 53.89},
    {time: 1730742925541, val: 53.89},
    {time: 1730742985541, val: 53.92},
    {time: 1730743045542, val: 53.92},
    {time: 1730743105541, val: 53.86},
    {time: 1730743165541, val: 53.86},
    {time: 1730728585534, val: 55.01},
    {time: 1730743225542, val: 53.86},
    {time: 1730743285542, val: 53.86},
    {time: 1730743345539, val: 53.86},
    {time: 1730743405541, val: 53.78},
    {time: 1730743465540, val: 53.71},
    {time: 1730743525540, val: 53.68},
    {time: 1730743585541, val: 53.70},
    {time: 1730743645540, val: 53.78},
    {time: 1730743705542, val: 53.71},
    {time: 1730743765547, val: 53.71},
    {time: 1730728645534, val: 55.01},
    {time: 1730743825548, val: 53.71},
    {time: 1730743885547, val: 53.70},
    {time: 1730743945549, val: 53.70},
    {time: 1730744005548, val: 53.77},
    {time: 1730744065548, val: 53.78},
    {time: 1730744125549, val: 53.78},
    {time: 1730744185549, val: 53.73},
    {time: 1730744245547, val: 53.73},
    {time: 1730744305549, val: 53.77},
    {time: 1730744365548, val: 53.75},
    {time: 1730728705533, val: 55.01},
    {time: 1730744425549, val: 53.83},
    {time: 1730744485549, val: 53.85},
    {time: 1730744545549, val: 53.85},
    {time: 1730744605549, val: 53.85},
    {time: 1730744665549, val: 53.95},
    {time: 1730744725549, val: 53.96},
    {time: 1730744785548, val: 53.92},
    {time: 1730744845549, val: 54.02},
    {time: 1730744905550, val: 53.99},
    {time: 1730744965550, val: 53.87},
    {time: 1730728765532, val: 55.01},
    {time: 1730727145565, val: 55.01},
    {time: 1730745025550, val: 53.80},
    {time: 1730745085551, val: 53.78},
    {time: 1730745145551, val: 53.78},
    {time: 1730745205551, val: 53.78},
    {time: 1730745265552, val: 53.78},
    {time: 1730745325551, val: 53.80},
    {time: 1730745385550, val: 53.80},
    {time: 1730745445551, val: 53.76},
    {time: 1730745505551, val: 53.74},
    {time: 1730745565551, val: 53.80},
    {time: 1730728825531, val: 55.01},
    {time: 1730745625552, val: 53.80},
    {time: 1730745685552, val: 53.80},
    {time: 1730745745552, val: 53.84},
    {time: 1730745805552, val: 53.84},
    {time: 1730745865552, val: 53.80},
    {time: 1730745925553, val: 53.73},
    {time: 1730745985553, val: 53.76},
    {time: 1730746045551, val: 53.76},
    {time: 1730746105552, val: 53.76},
    {time: 1730746165553, val: 53.71},
    {time: 1730728885530, val: 55.01},
    {time: 1730746225551, val: 53.71},
    {time: 1730746285551, val: 53.69},
    {time: 1730746345553, val: 53.69},
    {time: 1730746405553, val: 53.69},
    {time: 1730746465551, val: 53.69},
    {time: 1730746525551, val: 53.69},
    {time: 1730746585551, val: 53.73},
    {time: 1730746645551, val: 53.73},
    {time: 1730746705549, val: 53.73},
    {time: 1730746765551, val: 53.71},
    {time: 1730728945531, val: 55.01},
    {time: 1730746825551, val: 53.71},
    {time: 1730746885551, val: 53.73},
    {time: 1730746945551, val: 53.73},
    {time: 1730747005551, val: 53.73},
    {time: 1730747065552, val: 53.78},
    {time: 1730747125551, val: 53.78},
    {time: 1730747185550, val: 53.85},
    {time: 1730747245549, val: 53.85},
    {time: 1730747305550, val: 53.91},
    {time: 1730747365552, val: 53.92},
    {time: 1730729005530, val: 55.01},
    {time: 1730747425550, val: 53.93},
    {time: 1730747485552, val: 53.96},
    {time: 1730747545552, val: 53.96},
    {time: 1730747605552, val: 53.94},
    {time: 1730747665552, val: 53.95},
    {time: 1730747725551, val: 53.99},
    {time: 1730747785548, val: 53.90},
    {time: 1730747845549, val: 53.90},
    {time: 1730747905548, val: 53.91},
    {time: 1730747965548, val: 53.91},
    {time: 1730729065527, val: 55.01},
    {time: 1730748025549, val: 53.91},
    {time: 1730748085548, val: 53.91},
    {time: 1730748145547, val: 53.91},
    {time: 1730748205548, val: 54.00},
    {time: 1730748265548, val: 53.99},
    {time: 1730748325548, val: 53.96},
    {time: 1730748385548, val: 53.96},
    {time: 1730748445548, val: 54.01},
    {time: 1730748505548, val: 54.00},
    {time: 1730748565548, val: 53.97},
    {time: 1730729125528, val: 55.01},
    {time: 1730748625548, val: 53.98},
    {time: 1730748685548, val: 53.87},
    {time: 1730748745547, val: 53.87},
    {time: 1730748805548, val: 53.87},
    {time: 1730748865548, val: 53.90},
    {time: 1730748925548, val: 53.90},
    {time: 1730748985549, val: 53.90},
    {time: 1730749045547, val: 53.92},
    {time: 1730749105547, val: 53.93},
    {time: 1730749165509, val: 53.93},
    {time: 1730729185540, val: 55.01},
    {time: 1730749225504, val: 53.90},
    {time: 1730749285502, val: 53.89},
    {time: 1730749345502, val: 53.82},
    {time: 1730749405502, val: 53.82},
    {time: 1730749465501, val: 53.85},
    {time: 1730749525500, val: 53.85},
    {time: 1730749585500, val: 53.85},
    {time: 1730749645498, val: 53.85},
    {time: 1730749705499, val: 53.90},
    {time: 1730749765499, val: 53.90},
    {time: 1730729245541, val: 55.01},
    {time: 1730749825497, val: 53.86},
    {time: 1730749885497, val: 53.86},
    {time: 1730749945495, val: 53.86},
    {time: 1730750005496, val: 53.86},
    {time: 1730750065494, val: 53.86},
    {time: 1730750125495, val: 53.84},
    {time: 1730750185493, val: 53.84},
    {time: 1730750245493, val: 53.84},
    {time: 1730750305492, val: 53.88},
    {time: 1730750365490, val: 53.89},
    {time: 1730729305540, val: 55.01},
    {time: 1730729365541, val: 55.01},
    {time: 1730727205565, val: 55.01},
    {time: 1730729425539, val: 55.01},
    {time: 1730729485539, val: 55.01},
    {time: 1730729545539, val: 55.01},
    {time: 1730729605539, val: 55.01},
    {time: 1730729665539, val: 55.01},
    {time: 1730729725539, val: 55.01},
    {time: 1730729785536, val: 55.01},
    {time: 1730729845538, val: 55.01},
    {time: 1730729905538, val: 55.01},
    {time: 1730729965536, val: 55.01},
    {time: 1730727265565, val: 55.01},
    {time: 1730730025536, val: 55.01},
    {time: 1730730085535, val: 55.01},
    {time: 1730730145535, val: 55.01},
    {time: 1730730205535, val: 55.01},
    {time: 1730730265534, val: 55.01},
    {time: 1730730325534, val: 55.01},
    {time: 1730730385534, val: 55.01},
    {time: 1730730445534, val: 55.01},
    {time: 1730730505525, val: 55.01},
    {time: 1730730565520, val: 55.01},
    {time: 1730727325565, val: 55.01},
    {time: 1730730625520, val: 55.01},
    {time: 1730730685518, val: 54.51},
    {time: 1730730745519, val: 54.30},
    {time: 1730730805518, val: 54.35},
    {time: 1730730865516, val: 54.32},
    {time: 1730730925516, val: 54.25},
    {time: 1730730985516, val: 54.36},
    {time: 1730731045515, val: 54.33},
    {time: 1730731105513, val: 54.29},
    {time: 1730731165514, val: 54.29},
    {time: 1730727385564, val: 55.01},
    {time: 1730731225514, val: 54.26},
    {time: 1730731285513, val: 54.28},
    {time: 1730731345512, val: 54.37},
    {time: 1730731405511, val: 54.34},
    {time: 1730731465511, val: 54.34},
    {time: 1730731525510, val: 54.33},
    {time: 1730731585509, val: 54.40},
    {time: 1730731645510, val: 54.32},
    {time: 1730731705508, val: 54.24},
    {time: 1730731765507, val: 54.23},
    {time: 1730727445564, val: 55.01},
    {time: 1730731825525, val: 54.30},
    {time: 1730731885547, val: 54.34},
    {time: 1730731945547, val: 54.24},
    {time: 1730732005548, val: 54.26},
    {time: 1730732065549, val: 54.31},
    {time: 1730732125548, val: 54.21},
    {time: 1730732185549, val: 54.21},
    {time: 1730732245548, val: 54.18},
    {time: 1730732305549, val: 54.23},
    {time: 1730732365549, val: 54.26},
    {time: 1730727505564, val: 55.01},
    {time: 1730732425549, val: 54.26},
    {time: 1730732485549, val: 54.35},
    {time: 1730732545549, val: 54.41},
    {time: 1730732605548, val: 54.32},
    {time: 1730732665549, val: 54.32},
    {time: 1730732725550, val: 54.35},
    {time: 1730732785547, val: 54.28},
    {time: 1730732845549, val: 54.35},
    {time: 1730732905548, val: 54.33},
    {time: 1730732965549, val: 54.30},
    {time: 1730727565563, val: 55.01},
];

data.sort((a, b) => {
    if (a.time > b.time) {
        return 1;
    } else {
        return -1;
    }
});

// data = data.slice(61, data.length);

const dataToUse = [];
const priceList = [];

const setSize = 25;
data.forEach((bit, i) => {
    if (i > setSize && i < data.length - 1) {
        const arr = [];
        for (let j = i - setSize; j < i; j++) {
            const prev = data[j].val;
            const later = data[j + 1].val;
            if (later > prev) {
                arr.push([1]);
            } else {
                arr.push([0]);
            }
        }
        const answer = data[i + 1].val > data[i].val ? [1] : [0];
        dataToUse.push({ input: arr, output: answer });
        priceList.push(bit.val);
    }
});

// const trainingRange = [61, 136];
// const testingRange = [248, 387];
// const testingRange = [61, 136];
// const trainingRange = [248, 387];
const testingRange = [61, 337];
const trainingRange = [337, 387];
// const testingRange = [61, 387];
// const trainingRange = [61, 387];
const trainingData = dataToUse.slice(trainingRange[0], trainingRange[1] + 1);
const testingData = dataToUse.slice(testingRange[0], testingRange[1] + 1);

// const trainingData = dataToUse.slice(0, Math.floor(dataToUse.length * 0.8));
// const testingData = dataToUse.slice(Math.floor(dataToUse.length * 0.8), dataToUse.length);

const pricesToTest = priceList.slice(testingRange[0], testingRange[1]);

// trainingData.push(...trainingData);
// trainingData.push(...trainingData);
// trainingData.push(...trainingData);

net.train(trainingData);

let correct = 0;
let wrong = 0;

let downPredict = 0;
let upPredict = 0;

const recs = [];

const predictions = [];
testingData.forEach((bit) => {
    const rawOut = net.run(bit.input)[0];
    const out = Math.round(rawOut);
    recs.push(out);
    if (out === 1) {
        upPredict += 1;
    } else {
        downPredict += 1;
    }
    if (out === bit.output[0]) {
        correct += 1;
    } else {
        wrong += 1;
    }
    if (bit.output[0] === 1) {
        predictions.push({
            real: 1,
            prediction: rawOut
        });
    } else {
        predictions.push({
            real: 0,
            prediction: rawOut
        });
    }
});

console.log("-----");
console.log(predictions);
console.log("-----");


console.log("up predict: " + upPredict);
console.log("down predict: " + downPredict);
console.log("correct: " + correct);
console.log("wrong: " + wrong);

let oldMoney = pricesToTest[0];
let newMoney = pricesToTest[0];

let own = true;

pricesToTest.forEach((price, i) => {
    if (i === pricesToTest.length - 1) {
        console.log("testing over " + pricesToTest.length + " minutes, once per minute");
    }
    if (i > 0) {
        let prevPrice = pricesToTest[i - 1];
        oldMoney = oldMoney * (1.0 * price / prevPrice);

        if (own) {
            newMoney = newMoney * (1.0 * price / prevPrice);
        }
    }
    own = recs[i] === 1;
});

console.log("start amount: " + formatMoney(pricesToTest[0]));
console.log("end with keep: " + formatMoney(oldMoney));
console.log("end with ai: " + formatMoney(newMoney));




function formatMoney(n) {
    let bigger = 100.0 * n;
    let round = Math.round(bigger);
    let backToSmall = round / 100.0;
    return `$${backToSmall}`;
}














// let str = "[\n";
// fetch("https://graffiti.red/API/public/getAllPrices.php", {
//     method: "POST"
// }).then((res) => {
//     res.json().then((r) => {
//         // console.log(r);
//         r.value.forEach((bit) => {
//             console.log("poop");

//           str = str + `{time: ${bit.value.slice(7, bit.value.length)} val: ${bit.value.slice(1, 6)}},\n`
//         });
//         str = str + "]";
//         console.log(str);
//     });
// }).catch((err) => {
//     console.log("ERROR");
//     console.log(err.message);
// });


