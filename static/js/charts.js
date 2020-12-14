function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
  
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);  
};

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
};

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // Create a variable that holds the metadata array (for gauge chart).
    var metadata = data.metadata;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesResultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that filters the metadata array for the object with the desired sample number (#1 for gauge chart).
    var metadatasResultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var samplesResult = samplesResultArray[0];

    // Create a variable that holds the first sample in the metadata array (#2 for gauge chart).
    var metadataResult = metadatasResultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = samplesResult.otu_ids;
    var otuLabels = samplesResult.otu_labels;
    var sampleValues = samplesResult.sample_values;

    
    // Create a variable that holds the washing frequency (#3 for gauge chart).
    var metadataWfreq = parseFloat(metadataResult.wfreq);
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      paper_bgcolor: "rgb(216, 247, 236"  
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

     // Create the trace for the bubble chart (#1 for bubble chart).
     var bubbleData = [{
       x: otuIds,
       y: sampleValues,
       text: otuLabels,
       mode: "markers",
       marker: {
         size: sampleValues,
         color: otuIds
         //colorscale:  
        }      
     }];

    // Create the layout for the bubble chart (#2 for bubble chart).
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      paper_bgcolor: "rgb(216, 247, 236"      
    };

    // Use Plotly to plot the data with the layout (#3 for bubble chart).
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Create the trace for the gauge chart (#4 for gauge chart).
    var gaugeData = [{
      value: metadataWfreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      gauge: {
        axis: {range: [null, 10], tickwidth: 1, tickcolor: "darkblue"},
        bar: {color: "darkblue"},
        steps: [
          {range:[0, 2], color: "red"},
          {range:[2, 4], color: "orange"},
          {range:[4, 6], color: "yellow"},
          {range:[6, 8], color: "lightgreen"},
          {range:[8, 10], color: "green"}
        ],
      }
    }];
    
    // Create the layout for the gauge chart (#5 for gauge chart).
    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "rgb(216, 247, 236"
    };

    // Use Plotly to plot the gauge data and layout (#6 for gauge chart).
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
};
