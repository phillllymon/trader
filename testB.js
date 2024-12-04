const rawData = [
    { real: 1, prediction: 0.0037278870586305857 },
  { real: 1, prediction: 0.0010107678826898336 },
  { real: 0, prediction: 0.12659962475299835 },
  { real: 1, prediction: 0.6686002016067505 },
  { real: 1, prediction: 0.07326976954936981 },
  { real: 0, prediction: 0.01281936839222908 },
  { real: 0, prediction: 0.008997722528874874 },
  { real: 1, prediction: 0.5704358220100403 },
  { real: 0, prediction: 0.012511471286416054 },
  { real: 1, prediction: 0.003792162286117673 },
  { real: 0, prediction: 0.016126848757267 },
  { real: 0, prediction: 0.29160037636756897 },
  { real: 1, prediction: 0.002150492509827018 },
  { real: 0, prediction: 0.019060328602790833 },
  { real: 1, prediction: 0.19430755078792572 },
  { real: 0, prediction: 0.5138399004936218 },
  { real: 0, prediction: 0.07381828874349594 },
  { real: 0, prediction: 0.040745172649621964 },
  { real: 1, prediction: 0.046516746282577515 },
  { real: 1, prediction: 0.043631553649902344 },
  { real: 1, prediction: 0.01819414086639881 },
  { real: 0, prediction: 0.006800992880016565 },
  { real: 0, prediction: 0.033646129071712494 },
  { real: 0, prediction: 0.13280779123306274 },
  { real: 0, prediction: 0.5319105386734009 },
  { real: 0, prediction: 0.010867787525057793 },
  { real: 0, prediction: 0.11836402118206024 },
  { real: 0, prediction: 0.008131681010127068 },
  { real: 1, prediction: 0.901457667350769 },
  { real: 0, prediction: 0.7105681896209717 },
  { real: 1, prediction: 0.1933968961238861 },
  { real: 0, prediction: 0.007573673967272043 },
  { real: 0, prediction: 0.0129501111805439 },
  { real: 0, prediction: 0.07543060928583145 },
  { real: 1, prediction: 0.5824738144874573 },
  { real: 1, prediction: 0.1822793036699295 },
  { real: 0, prediction: 0.0020863288082182407 },
  { real: 1, prediction: 0.0027070355135947466 },
  { real: 0, prediction: 0.11233340203762054 },
  { real: 0, prediction: 0.40501946210861206 },
  { real: 1, prediction: 0.10121629387140274 },
  { real: 0, prediction: 0.8692861199378967 },
  { real: 0, prediction: 0.02937997318804264 },
  { real: 0, prediction: 0.010456772521138191 },
  { real: 0, prediction: 0.7833751440048218 },
  { real: 1, prediction: 0.111225426197052 },
  { real: 1, prediction: 0.003156297141686082 },
  { real: 0, prediction: 0.025733472779393196 },
  { real: 1, prediction: 0.003851864952594042 },
  { real: 0, prediction: 0.39783722162246704 },
  { real: 0, prediction: 0.036402828991413116 },
  { real: 0, prediction: 0.06620363146066666 },
  { real: 1, prediction: 0.003241203958168626 },
  { real: 1, prediction: 0.005566054489463568 },
  { real: 1, prediction: 0.03492077812552452 },
  { real: 0, prediction: 0.19353970885276794 },
  { real: 1, prediction: 0.7077795267105103 },
  { real: 0, prediction: 0.007958187721669674 },
  { real: 0, prediction: 0.012894682586193085 },
  { real: 0, prediction: 0.04032851755619049 },
  { real: 1, prediction: 0.6269984245300293 },
  { real: 1, prediction: 0.019758353009819984 },
  { real: 0, prediction: 0.07468127459287643 },
  { real: 0, prediction: 0.01070236973464489 },
  { real: 0, prediction: 0.016628140583634377 },
  { real: 0, prediction: 0.004375691059976816 },
  { real: 0, prediction: 0.02173466980457306 },
  { real: 0, prediction: 0.8386355638504028 },
  { real: 0, prediction: 0.2813175618648529 },
  { real: 0, prediction: 0.021865202113986015 },
  { real: 0, prediction: 0.024202950298786163 },
  { real: 1, prediction: 0.3729771375656128 },
  { real: 0, prediction: 0.021367808803915977 },
  { real: 0, prediction: 0.023558488115668297 },
  { real: 1, prediction: 0.023155024275183678 },
  { real: 0, prediction: 0.9703206419944763 },
  { real: 0, prediction: 0.044587377458810806 },
  { real: 0, prediction: 0.08659707754850388 },
  { real: 0, prediction: 0.012090804055333138 },
  { real: 0, prediction: 0.009153362363576889 },
  { real: 0, prediction: 0.07595641165971756 },
  { real: 0, prediction: 0.9545193910598755 },
  { real: 0, prediction: 0.6299372911453247 },
  { real: 0, prediction: 0.031049849465489388 },
  { real: 0, prediction: 0.4961068332195282 },
  { real: 1, prediction: 0.7420332431793213 },
  { real: 0, prediction: 0.12541420757770538 },
  { real: 0, prediction: 0.006570452358573675 },
  { real: 1, prediction: 0.01771107129752636 },
  { real: 0, prediction: 0.03170391917228699 },
  { real: 0, prediction: 0.008368875831365585 },
  { real: 0, prediction: 0.0072241052985191345 },
  { real: 0, prediction: 0.1114550530910492 },
  { real: 0, prediction: 0.02072039619088173 },
  { real: 0, prediction: 0.11226419359445572 },
  { real: 1, prediction: 0.922992467880249 },
  { real: 1, prediction: 0.45002198219299316 },
  { real: 0, prediction: 0.02529727853834629 },
  { real: 1, prediction: 0.026822442188858986 },
  { real: 0, prediction: 0.6723530292510986 },
];

const dataToUse = rawData.map((pair) => {
    return { time: pair.prediction, val: pair.real }
});

graphData(dataToUse, "red", "graph-a");

// data should be array of items in this format: {time: number, val: number}
function graphData(data, col, graph) {
    data.sort((a, b) => {
      if (a.time > b.time) {
        return 1;
      } else {
        return -1;
      }
    });
    const numPoints = data.length;
    const pointWidth = 1000.0 / numPoints;
    const maxTime = data[data.length - 1].time;
    const minTime = data[0].time;
    const timeRange = maxTime - minTime;

    let maxVal = 0;
    let minVal = 10000000000;
    data.forEach((bit) => {
        if (bit.val > maxVal) {
            maxVal = bit.val;
        }
        if (bit.val < minVal) {
            minVal = bit.val;
        }
    });

    const valRange = maxVal - minVal;
    let lastVal = data[0].val;

    const dataToGraph = [];
    data.forEach((bit) => {
        console.log(bit);
        // if (bit.time > 0.65 || bit.time < 0.35) {
            dataToGraph.push(bit);
        // }
    });

    dataToGraph.forEach((bit, i) => {
        // const positionFraction = 1.0 * (bit.time - minTime) / timeRange;
        const positionFraction = 1.0 * (i) / dataToGraph.length;
        const xPos = 1000.0 * positionFraction;
        const heightFraction = 1.0 * (bit.val - minVal) / valRange;
        const height = Math.max(400.0 * heightFraction, 35);
        
        const ele = document.createElement("div");
        ele.classList.add(`${col}Point`);
        ele.style.height = `${height}px`;
        ele.style.left = `${xPos}px`;
        ele.style.width = `${pointWidth - 5}px`;
        ele.id = `${graph}${col}${i}`;
        ele.addEventListener("mouseenter", () => {
            document.getElementById("timestamp").innerHTML = i;
        });
        document.getElementById(graph).appendChild(ele);
        
        
        
        lastVal = xPos;
    });

}
