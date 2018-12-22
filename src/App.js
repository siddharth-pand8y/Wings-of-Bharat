import React, { Component } from 'react';
import fetchJsonp from 'fetch-jsonp';
import * as dataLocations from './SanctuaryLocations.json';
import FilterLocations from './FilterLocations';
import InfoWindow from './InfoWindow';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: dataLocations,
      map: '',
      infoWindow: '',
      markers: [],
      infoWindowIsOpen: false,
      currentMarker: {},
      infoContent: ''
    };
  }

  gm_authFailure() {
    window.alert("Google Maps error!")
  }

  componentDidMount() {
    window.initMap = this.initMap;
    window.gm_authFailure = this.gm_authFailure;
    loadJS('https://maps.googleapis.com/maps/api/js?key=API_KEY&callback=initMap');
  }

  initMap = () => {
    let controlledThis = this;
    const { locations, markers } = this.state;

    //  Define map
    let map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: {
        lat: 20.593684,
        lng: 78.96288
      },
      styles: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [
            {
              color: "#e9e9e9"
            },
            {
              lightness: 17
            }
          ]
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [
            {
              color: "#f5f5f5"
            },
            {
              lightness: 20
            }
          ]
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#ffffff"
            },
            {
              lightness: 17
            }
          ]
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [
            {
              color: "#ffffff"
            },
            {
              lightness: 29
            },
            {
              weight: 0.2
            }
          ]
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [
            {
              color: "#ffffff"
            },
            {
              lightness: 18
            }
          ]
        },
        {
          featureType: "road.local",
          elementType: "geometry",
          stylers: [
            {
              color: "#ffffff"
            },
            {
              lightness: 16
            }
          ]
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [
            {
              color: "#f5f5f5"
            },
            {
              lightness: 21
            }
          ]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [
            {
              color: "#dedede"
            },
            {
              lightness: 21
            }
          ]
        },
        {
          elementType: "labels.text.stroke",
          stylers: [
            {
              visibility: "on"
            },
            {
              color: "#ffffff"
            },
            {
              lightness: 16
            }
          ]
        },
        {
          elementType: "labels.text.fill",
          stylers: [
            {
              saturation: 36
            },
            {
              color: "#333333"
            },
            {
              lightness: 40
            }
          ]
        },
        {
          elementType: "labels.icon",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [
            {
              color: "#f2f2f2"
            },
            {
              lightness: 19
            }
          ]
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#fefefe"
            },
            {
              lightness: 20
            }
          ]
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [
            {
              color: "#fefefe"
            },
            {
              lightness: 17
            },
            {
              weight: 1.2
            }
          ]
        }
      ]
    });

    // Keep state in sync
    this.setState({
      map
    });

    // Create marker for each location in Locations.json file
    for (let i = 0; i < locations.length; i++) {
      // Define the values of the properties
      let position = locations[i].position;
      let title = locations[i].title;
      let id = locations[i].key

      // Create the marker
      let marker = new window.google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: window.google.maps.Animation.DROP,
        id: id
      });

      // push markers into the state
      markers.push(marker);

      // Open infoWindow on click
      marker.addListener('click', function () {
        controlledThis.openInfoWindow(marker);
      });
    }
    // listener to close infoWindow on click on map body
    map.addListener('click', function () {
      controlledThis.closeInfoWindow();
    });
  }



  openInfoWindow = (marker) => {
    this.setState({
      infoWindowIsOpen: true,
      currentMarker: marker
    });

    this.getInfos(marker);
  }

  closeInfoWindow = () => {
    this.setState({
      infoWindowIsOpen: false,
      currentMarker: {}
    });
  }

  getInfos = (marker) => {
    let controlledThis = this;
    // Get URL
    let place = marker.title;
    let srcUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' +
      place;
    srcUrl = srcUrl.replace(/ /g, '%20');

    // Fetch Wikipedia API
    fetchJsonp(srcUrl)
      .then(function (response) {
        return response.json();
      }).then(function (data) {
        // Get response content
        let pages = data.query.pages;
        let pageId = Object.keys(data.query.pages)[0];
        let pageContent = pages[pageId].extract;

        // Get content into state
        controlledThis.setState({
          infoContent: pageContent
        });
      }).catch(function (error) {
        console.log('Parsing failed ' + error);
        let pageError = "Request timed out"
        controlledThis.setState({
          infoContent: pageError
        });
      });
  }

  render() {
    return (
      <div className="App">
        <FilterLocations
          locationsList={this.state.locations}
          markers={this.state.markers}
          openInfoWindow={this.openInfoWindow}
        />

        {
          this.state.infoWindowIsOpen &&
          <InfoWindow
            currentMarker={this.state.currentMarker}
            infoContent={this.state.infoContent}
          />
          }

        <div id="map" role="application"></div>
      </div>
    );
  }
}

export default App;

function loadJS(src) {
  let ref = window.document.getElementsByTagName('script')[0];
  let script = window.document.createElement('script');

  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);

  script.onerror = function () {
    document.write('Load error: Google Maps')
  };
}
