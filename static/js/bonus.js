// Color palette for the Gauge Chart
var arrColorsG = ["darkturquoise", "mediumturquoise", "turquoise", "paleturquoise", "mintcream", "aliceblue", "lightgray", "gray", "dimgray", "white"];

// Use d3.json to fetch the metadata for a sample
function buildMetadata(sample) {
  d3.json(url).then((data) => {
    var metadata= data.metadata;
    var resultsarray= metadata.filter(sampleobject => sampleobject.id == sample);
    var result= resultsarray[0]
    // Using d3 to select the panel
    var panel = d3.select("#sample-metadata");
    // Using .html("") to clear any existing metadata
    panel.html("");
    // Using Object.entries to add each key-value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// Create a function for Gauge Chart
function buildGaugeChart(sample) {
  d3.json(url).then(data =>{
    var objs = data.metadata;
    var matchedSampleObj = objs.filter(sampleData => sampleData["id"] === parseInt(sample));
      gaugeChart(matchedSampleObj[0]);
 });   
}

// Build Gauge Chart
function gaugeChart(data) {
  if(data.wfreq === null){ data.wfreq = 0; }
  let degree = parseInt(data.wfreq) * (180/10);

  // Trigonometry to calculate meter point
  let degrees = 180 - degree;
  let radius = .5;
  let radians = degrees * Math.PI / 180;
  let x = radius * Math.cos(radians);
  let y = radius * Math.sin(radians);

  let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
    pathX = String(x),
    space = ' ',
    pathY = String(y),
    pathEnd = ' Z';
  let path = mainPath.concat(pathX, space, pathY, pathEnd);

  let trace = [{ type: 'scatter',
    x: [0], y:[0],
    marker: {size: 25, color:'orange'},
    showlegend: false,
    name: 'WASH FREQ',
    text: data.wfreq,
    hoverinfo: 'text+name'},
    { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
      textinfo: 'text',
      textposition:'inside',
      textfont:{ size : 13, },
      marker: {colors:[...arrColorsG]},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
      hoverinfo: 'text',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

  let layout = {
    shapes:[{
      type: 'path',
      path: path,
      fillcolor: 'orange',
      line: { color: 'orange' }
    }],

    title: '<b>Belly Button Washing Frequency</b> <br> Scrub(s) Per Week',
    height: 400,
    width: 550,
    xaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
  };

  Plotly.newPlot('gauge', trace, layout, {responsive: true});
}

// Create Bubble & Bar Chart
function buildCharts(sample) {
    d3.json(url).then((data) => {
      var samples= data.samples;
      var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
      var result= resultsarray[0]
      var ids = result.otu_ids;
      var labels = result.otu_labels;
      var values = result.sample_values;
    });
 }

function init() {
    var selector = d3.select("#selDataset");
    d3.json(url).then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      const firstSample = sampleNames[0];
      buildMetadata(firstSample);
      buildCharts(firstSample);
      buildGaugeChart(firstSample)
    });
  }
   
  function optionChanged(newSample) {
    // Get new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    buildGaugeChart(newSample) 
  }
    
  // Initialize the dashboard
  init();
