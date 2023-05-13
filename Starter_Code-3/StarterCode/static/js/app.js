// Load the samples data from the URL
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {

  // Select the dropdown menu and the divs for the charts
  let dropdown = d3.select("#selDataset");
  let barChartDiv = d3.select("#bar");
  let bubbleChartDiv = d3.select("#bubble");

  // Get the list of IDs for the samples
  let sampleIDs = data.names;

  // Populate the dropdown menu with the sample IDs
  dropdown.selectAll("option")
    .data(sampleIDs)
    .enter()
    .append("option")
    .text((d) => d)
    .attr("value", (d) => d);

  // Define a function to update the bar chart based on the selected sample ID
  function updateBarChart(sampleID) {
    // Find the sample data for the selected ID
    let sampleData = data.samples.find((d) => d.id === sampleID);

    // Get the top 10 OTUs and reverse the order for the bar chart
    let top10Values = sampleData.sample_values.slice(0, 10).reverse();
    let top10Labels = sampleData.otu_ids.slice(0, 10).reverse();
    let top10HoverText = sampleData.otu_labels.slice(0, 10).reverse();

    // Create the horizontal bar chart
    let trace = {
      x: top10Values,
      y: top10Labels.map((d) => `OTU ${d}`),
      type: "bar",
      orientation: "h",
      text: top10HoverText
    };
    let layout = {
      title: `Top 10 OTUs for Sample ${sampleID}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };
    Plotly.newPlot(barChartDiv.node(), [trace], layout);
  }

  // Define a function to create the bubble chart based on the selected sample ID
  function createBubbleChart(sampleID) {
    // Find the sample data for the selected ID
    let sampleData = data.samples.find((d) => d.id === sampleID);

    // Define the trace for the bubble chart
    let trace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: "markers",
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids
      }
    };

    // Define the layout for the bubble chart
    let layout = {
      xaxis: { 
        title: "OTU ID"
      },
      yaxis: {
        title: "Sample Value"
      },
      margin: {
        t: 0
      }
    };

    // Plot the bubble chart
    Plotly.newPlot(bubbleChartDiv.node(), [trace], layout);
  }


  function  getMetadata(sampleID) {
    return data.metadata.find((d) => d.id ===parseInt(sampleID));
  } ///defining the function to retrieve the metadata for the sample id

  ///update
  function updateMetadata(sampleID) {
    let metadata = getMetadata(sampleID);
    showMetadata(metadata);
  } ///demographic info still not showing :(

  // Initialize the charts with the first sample ID
  let defaultSample = sampleIDs[0];
  updateBarChart(defaultSample);
  createBubbleChart(defaultSample);

  // Add an event listener to update the charts when the dropdown selection changes
  dropdown.on("change", () => {
    let sampleID = dropdown.property("value");
    updateBarChart(sampleID);
    createBubbleChart(sampleID);
  });


  ///update metadata
  function showMetadata (metadata) {
    var metadataElement =d3.select("#sample-metadata");
    metadataElement.html("");
    Object.entries(metadata).forEach(([key,value])=> {
      metadataElement.append("p").text(`${key}: ${value}`);
    });
    
    }

});
