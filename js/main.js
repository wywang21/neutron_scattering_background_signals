window.onload = function() {
    document.getElementById('add_btn').onclick = addPoint;
    document.getElementById('delete_btn').onclick = deletePoints;
    updateHeatMapData();
    drawMap();
    drawCut();
};

var g_heatMapX;
var g_heatMapY;
var g_heatMapIntensity;
var g_heatMapError;

var queryPointsX = [];
var queryPointsY = [];
var eqMapDiv = document.getElementById('eqMap');
var cutPlotDiv = document.getElementById('cutPlot');

function handleBinningValueChange() {
    drawCut();
}

function handleCutModeChange() {
    switch (document.getElementById('cutMode').value) {
        case 'cutAlongE':
            document.getElementById('binningOption').innerHTML = "Q Binned from\n" +
                "<input id=\"lowBound\" type=\"number\" value = 2.5 onchange=\"handleBinningValueChange()\">\n" +
                "to\n" +
                "<input id=\"highBound\" type=\"number\" value = 2.6 onchange=\"handleBinningValueChange()\">\n" +
                "&#8491;<sup>-1</sup>";
            break;
        case 'cutAlongQ':
            document.getElementById('binningOption').innerHTML = "Energy Binned from\n" +
                "<input id=\"lowBound\" type=\"number\" value = 0 onchange=\"handleBinningValueChange()\">\n" +
                "to\n" +
                "<input id=\"highBound\" type=\"number\" value = 1 onchange=\"handleBinningValueChange()\">\n" +
                "meV";
            break;
        case 'cutAlongT':
            document.getElementById('binningOption').innerHTML =
                "Q = <input id=\"tScanQ\" type=\"number\" value = 2 onchange=\"handleBinningValueChange()\"> &#8491;<sup>-1</sup>\n" +
                "&nbsp;&nbsp; E = <input id=\"tScanE\" type=\"number\" value = 3 onchange=\"handleBinningValueChange()\"> meV";
    }
    drawCut();
}

function updateHeatMapData() {
    switch (document.getElementById('backgroundType').value) {
        case 'cytopAndAluminum':
            getCytopAndAlData();
            break;
        case 'heliumRecoil':
            getHeliumRecoilData();
            break;
    }
}

function handleBackgroundTypeChange() {
    switch (document.getElementById('backgroundType').value) {
        case 'cytopAndAluminum':
            document.getElementById('temperatureInput').innerHTML = "";
            document.getElementById('cutMode').innerHTML = "" +
                "<option value=\"cutAlongQ\">Q</option>\n" +
                "<option value=\"cutAlongE\">E</option>"
            break;
        case 'heliumRecoil':
            document.getElementById('temperatureInput').innerHTML =
                "<input type=\"checkbox\" id = \"plotTemperatureDiff\" onclick=\"handlePlotTemperatureDiff()\"> Plot temperature difference.\n" +
                "<p> T<sub>1</sub> = <input id=\"T1\" type=\"number\" value = 1 min=\"0\" onchange=\"handleTemperatureChange()\"> K </p>\n" +
                "<p> T<sub>2</sub> = <input id=\"T2\" type=\"number\" disabled=\"disabled\" min=\"0\" onchange=\"handleTemperatureChange()\"> K </p>";
            document.getElementById('cutMode').innerHTML = "" +
                "<option value=\"cutAlongQ\">Q</option>\n" +
                "<option value=\"cutAlongE\">E</option>\n" +
                "<option value=\"cutAlongT\">T</option>\n"
            break;
    }
    drawMap();
    drawCut();
}

function handlePlotTemperatureDiff() {
    if (document.getElementById('plotTemperatureDiff').checked) {
        document.getElementById('T2').disabled = false;
    } else {
        document.getElementById('T2').value = '';
        document.getElementById('T2').disabled = true;
    }
}

function handleTemperatureChange() {
    drawMap();
    drawCut();
}

function drawMap() {
    updateHeatMapData();

    let heatMapData;
    let layout;
    switch (document.getElementById('backgroundType').value) {
        case 'cytopAndAluminum':
            heatMapData = {
                x: g_heatMapX,
                y: g_heatMapY,
                z: g_heatMapIntensity,
                colorscale: 'Jet',
                zmin: 0,
                zmax: 0.8,
                type: 'heatmap'
            };

            layout = {
                title: 'E-Q map for CYTOP and Aluminum at 5K',
                xaxis: {
                    range: [0.5, 4],
                    title: 'Q (&#8491;<sup>-1</sup>)'
                },
                yaxis: {
                    range: [-1, 50],
                    title: 'E (meV)'
                },
                margin: {
                    t: 100,
                    r: 100,
                    b: 100,
                    l: 100
                },
                width: document.getElementById('eqMap').offsetWidth,
                height: document.getElementById('eqMap').offsetWidth
            };
            break;
        case 'heliumRecoil':
            heatMapData = {
                x: g_heatMapX,
                y: g_heatMapY,
                z: g_heatMapIntensity,
                colorscale: 'Jet',
                zmin: -4,
                zmax: 4,
                type: 'heatmap'
            };

            layout = {
                title: 'E-Q map for Helium Recoil Simulation',
                xaxis: {
                    range: [0.5, 4],
                    title: 'Q (&#8491;<sup>-1</sup>)'
                },
                yaxis: {
                    range: [-1, 20],
                    title: 'E (meV)'
                },
                margin: {
                    t: 100,
                    r: 100,
                    b: 100,
                    l: 100
                },
                width: document.getElementById('eqMap').offsetWidth,
                height: document.getElementById('eqMap').offsetWidth
            };
            break;
    }

    let scatterData = {
        x: queryPointsX,
        y: queryPointsY,
        mode: 'markers',
        type: 'scatter',
        marker: {size: 10, color: 'black'}
    };

    let plotData = [heatMapData, scatterData];
    Plotly.newPlot(eqMapDiv, plotData, layout);
}

function drawCut() {
    let cutData = calculateCut();
    let xx = [];
    let yy = [];
    let err = [];
    for (let index = 0; index < cutData.length; ++index) {
        xx.push(cutData[index][0]);
        yy.push(cutData[index][1]);
        err.push(cutData[index][2]);
    }

    let cutPlotData;
    switch (document.getElementById('backgroundType').value) {
        case 'cytopAndAluminum':
            cutPlotData = [{
                x : xx,
                y : yy,
                error_y: {
                    type: 'data',
                    array: err,
                    visible: true
                },
                type: 'scatter'
            }];
            break;
        case 'heliumRecoil':
            cutPlotData = [{
                x : xx,
                y : yy,
                error_y: {
                    type: 'data',
                    array: err,
                    visible: false
                },
                type: 'scatter'
            }];
            break;
    }

    let xaxisTitle = '';
    switch (document.getElementById('cutMode').value) {
        case 'cutAlongQ':
            xaxisTitle = 'Q (&#8491;<sup>-1</sup>)';
            break;
        case 'cutAlongE':
            xaxisTitle = 'E (meV)';
            break;
        case 'cutAlongT':
            xaxisTitle = 'T (K)';
            break;
    }

    let layout = {
        xaxis: {
            title: xaxisTitle
        }
    };
    Plotly.newPlot(cutPlotDiv, cutPlotData, layout);
}

function calculateCut() {
    let cutData = [];
    if (document.getElementById('cutMode').value === 'cutAlongT') {
        let tScanQ = document.getElementById('tScanQ').value;
        let tScanE = document.getElementById('tScanE').value;
        let xValues = numeric.linspace(0, 300, 1201);
        for (let tIndex = 0; tIndex < xValues.length; ++tIndex) {
            let currTemperature = xValues[tIndex];
            let currQ = tScanQ * 1e10;
            let energyRConv = hbar * hbar / 2.0 / heliummass * currQ * currQ; // SI unit
            let energyConv = tScanE * eV2J; // in SI unit
            let beta = 1.0 / (kb * currTemperature);
            // calculate the s(q,w) and a constant (1e21) is divided from the data.
            let s = Math.sqrt((beta/(4*Math.PI*energyRConv))) * Math.pow(Math.E, ((-1)*beta/(4*Math.PI*energyRConv)
                * (energyConv - energyRConv) * (energyConv - energyRConv)))/(1e21);
            cutData.push([currTemperature, s, 0]);
        }
        return cutData;
    }

    let lowBound = document.getElementById('lowBound').value;
    let highBound = document.getElementById('highBound').value;
    if (lowBound == null || lowBound === "" || highBound == null || highBound === "") return [];
    lowBound = parseFloat(lowBound);
    highBound = parseFloat(highBound);
    if (lowBound >= highBound) return [];

    let rowNum = g_heatMapY.length;
    let colNum = g_heatMapX.length;

    switch (document.getElementById('cutMode').value) {
        case 'cutAlongQ':
            let rowIndexes = [];
            for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
                if (g_heatMapY[rowIndex] >= lowBound && g_heatMapY[rowIndex] < highBound) {
                    rowIndexes.push(rowIndex);
                }
            }

            for (let colIndex = 0; colIndex < colNum; colIndex++) {
                let count = 0;
                let intensitySum = 0;
                let errorSquareSum = 0;
                for (let ii = 0; ii < rowIndexes.length; ii++) {
                    let rowIndex = rowIndexes[ii];
                    if (g_heatMapIntensity[rowIndex][colIndex] !== null && g_heatMapError[rowIndex][colIndex] !== null) {
                        intensitySum += g_heatMapIntensity[rowIndex][colIndex];
                        errorSquareSum += g_heatMapError[rowIndex][colIndex] * g_heatMapError[rowIndex][colIndex];
                        count++;
                    }
                }
                if (count > 0) {
                    cutData.push([g_heatMapX[colIndex], intensitySum / count, Math.sqrt(errorSquareSum) / count]);
                }
            }
            return cutData;
        case 'cutAlongE':
            let colIndexes = [];
            for (let colIndex = 0; colIndex < colNum; colIndex++) {
                if (g_heatMapX[colIndex] >= lowBound && g_heatMapX[colIndex] < highBound) {
                    colIndexes.push(colIndex);
                }
            }
            for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
                let count = 0;
                let intensitySum = 0;
                let errorSquareSum = 0;
                for (let ii = 0; ii < colIndexes.length; ii++) {
                    let colIndex = colIndexes[ii];
                    if (g_heatMapIntensity[rowIndex][colIndex] !== null && g_heatMapError[rowIndex][colIndex] !== null) {
                        intensitySum += g_heatMapIntensity[rowIndex][colIndex];
                        errorSquareSum += g_heatMapError[rowIndex][colIndex] * g_heatMapError[rowIndex][colIndex];
                        count++;
                    }
                }
                if (count > 0) {
                    cutData.push([g_heatMapY[rowIndex], intensitySum / count, Math.sqrt(errorSquareSum) / count]);
                }
            }
            return cutData;
    }
}
