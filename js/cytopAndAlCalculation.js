var queryPointsX = [];
var queryPointsY = [];
var eqMapDiv = document.getElementById('eqMap');
var cutPlotDiv = document.getElementById('cutPlot');

function drawCytopAndAlMap() {
    let heatMapData = {
        x: rawDataXValues,
        y: rawDataYValues,
        z: rawDataIntensity,
        colorscale: 'Jet',
        zmin: 0,
        zmax: 0.8,
        type: 'heatmap'
    };

    let scatterData = {
        x: queryPointsX,
        y: queryPointsY,
        mode: 'markers',
        type: 'scatter',
        marker: {size: 10, color: 'black'}
    };

    let plotData = [heatMapData, scatterData];

    let layout = {
        title: 'E-Q map for CYTOP and Aluminum',
        xaxis: {range: [0.5, 4]},
        yaxis: {range: [-1, 50]},
        margin: {
            t: 100,
            r: 100,
            b: 100,
            l: 100
        },
        width: document.getElementById('eqMap').offsetWidth,
        height: document.getElementById('eqMap').offsetWidth
    };
    Plotly.newPlot(eqMapDiv, plotData, layout);
}


function drawCytopAndAlCut() {
    let cutData = calculateCut();
    let xx = [];
    let yy = [];
    let err = [];
    for (let index = 0; index < cutData.length; ++index) {
        xx.push(cutData[index][0]);
        yy.push(cutData[index][1]);
        err.push(cutData[index][2]);
    }
    let cutPlotData = [{
        x : xx,
        y : yy,
        error_y: {
            type: 'data',
            array: err,
            visible: true
        },
        type: 'scatter'
    }];
    Plotly.newPlot(cutPlotDiv, cutPlotData);
}

function calculateCut() {
    let lowBound = document.getElementById('lowBound').value;
    let highBound = document.getElementById('highBound').value;
    if (lowBound == null || lowBound === "" || highBound == null || highBound === "") return [];
    lowBound = parseFloat(lowBound);
    highBound = parseFloat(highBound);
    if (lowBound >= highBound) return [];

    let rowNum = rawDataYValues.length;
    let colNum = rawDataXValues.length;
    let cutData = [];
    switch (document.getElementById('cutMode').value) {
        case 'cutAlongQ':
            let rowIndexes = [];
            for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
                if (rawDataYValues[rowIndex] >= lowBound && rawDataYValues[rowIndex] < highBound) {
                    rowIndexes.push(rowIndex);
                }
            }

            for (let colIndex = 0; colIndex < colNum; colIndex++) {
                let count = 0;
                let intensitySum = 0;
                let errorSquareSum = 0;
                for (let ii = 0; ii < rowIndexes.length; ii++) {
                    let rowIndex = rowIndexes[ii];
                    if (rawDataIntensity[rowIndex][colIndex] !== null && rawDataError[rowIndex][colIndex] !== null) {
                        intensitySum += rawDataIntensity[rowIndex][colIndex];
                        errorSquareSum += rawDataError[rowIndex][colIndex] * rawDataError[rowIndex][colIndex];
                        count++;
                    }
                }
                if (count > 0) {
                    cutData.push([rawDataXValues[colIndex], intensitySum / count, Math.sqrt(errorSquareSum) / count]);
                }
            }
            return cutData;
        case 'cutAlongE':
            let colIndexes = [];
            for (let colIndex = 0; colIndex < colNum; colIndex++) {
                if (rawDataXValues[colIndex] >= lowBound && rawDataXValues[colIndex] < highBound) {
                    colIndexes.push(colIndex);
                }
            }
            for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
                let count = 0;
                let intensitySum = 0;
                let errorSquareSum = 0;
                for (let ii = 0; ii < colIndexes.length; ii++) {
                    let colIndex = colIndexes[ii];
                    if (rawDataIntensity[rowIndex][colIndex] !== null && rawDataError[rowIndex][colIndex] !== null) {
                        intensitySum += rawDataIntensity[rowIndex][colIndex];
                        errorSquareSum += rawDataError[rowIndex][colIndex] * rawDataError[rowIndex][colIndex];
                        count++;
                    }
                }
                if (count > 0) {
                    cutData.push([rawDataYValues[rowIndex], intensitySum / count, Math.sqrt(errorSquareSum) / count]);
                }
            }
            return cutData;
    }
}


