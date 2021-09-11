var myMap = L.map("map", {
    center: [37.0409472, -122.028032],
    zoom: 5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Use this link to get the GeoJSON data.
  var link = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02";

  function chooseradius(mag){
      return mag*7;
  }

  function choosecolor(coord){
      if (coord >= 200) return "red";  
      else if (coord >= 150) return "orange";
      else if (coord >= 100) return "yellow";
      else if (coord >= 50){ return "purple";}
      else if (coord >= 0) return "green";
      else return "blue";
  }

  // Getting our GeoJSON data
d3.json(link).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
      // Passing in our style object
      pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng,{
            radius: chooseradius(feature.properties.mag),
            fillColor: choosecolor(feature.geometry.coordinates[2]),
            weight: 1, 
            opacity: 1,
            fillOpacity: 1,
            bindPopup: 'hello world',

        }); 
      },
      onEachFeature: function(feature, layer){
          layer.bindPopup("info: " + feature.properties.title + 
          '. Depth: ' + feature.geometry.coordinates[2]);
      }
    }).addTo(myMap);
    var legend = L.control({
        position: "bottomright"
      });
    
      legend.onAdd = function(data) {
        var div = L.DomUtil.create("div", "info legend");
    
        var colors = [
          "red",
          "orange",
          "yellow",
          "purple",
          "green",
          "blue",
        ];

        var grade = [200,150,100,50,0]
    
        // Looping through
        for (var i = 0; i < colors.length; i++) {
            if(i == 5){
                div.innerHTML +=
                '<i style="background:' + colors[i] + '">'+ '>' + grade[i-1] + '=' + colors[i] + '</i> <br>';
            }else{
             div.innerHTML +=
                '<i style="background:' + colors[i] + '">'+ '<' + grade[i] + '=' + colors[i] + '</i> <br>';
            }
        }
        return div;
      };
    
      // Finally, we our legend to the map.
      legend.addTo(myMap);