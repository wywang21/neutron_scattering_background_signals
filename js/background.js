
var data = [{
    x: xValues,
    y: yValues,
    z: intensity,
    colorscale: 'Jet',
    zmin: 0,
    zmax: 0.8,
    type: 'heatmap'
}];

var layout = {
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

var eqMapDiv = document.getElementById('eqMap');
Plotly.react(eqMapDiv, data, layout);