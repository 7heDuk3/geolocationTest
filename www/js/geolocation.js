var map, centered = false, myName;

const serverIP = '10.199.1.77:1337'
var myName = 'Mike Persson';

const userMarker = []
const userInfo = []

function makeMap(gmap) {
  // map = new google.maps.Map(document.getElementById('map'), {
  //   center: { lat: -34.397, lng: 150.644 },
  //   zoom: 13
  // });
  map = gmap;
  //infoWindow = new google.maps.InfoWindow;

  centered = false;



  getUserLocation();
  setInterval(function () {
    getUserLocation();
    console.log("Yeeeees")
  }, 3000);
}

function geoSuccessCb(position) {
  var point = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  );

  var locations = []
  var res;
  $.get('http://' + serverIP + '/store/name/' + myName + '/lat/' + point.lat() + '/lon/' + point.lng(), (res) => {
    console.log("Result = ", res);
  })

  $.get('http://' + serverIP + '/locations', (locations) => {
    console.log(locations);
    locations = JSON.parse(locations);
    console.log("JSON: ", locations);
    markerHandler(locations)
  })
}

function markerHandler(locations) {
  locations.forEach(location => {

    let point = new google.maps.LatLng(
      location.pos.lat,
      location.pos.lon
    );

    // Problem med findIndex! Skapas fortfarande nya markers.
    let idx = -1;
    for (var i = 0; i < userInfo.length; i++) {
      if (location.name == userInfo[i].content) {
        idx = i;
        break;
      }
    }

    if (idx != -1) {
      userMarker[idx].setPosition(point);
      userInfo[idx].setPosition(point);
    } else {
      let marker = new google.maps.Marker({
        position: point,
        map: map
      })

      let info = new google.maps.InfoWindow({
        content: location.name,
        position: point
      })

      marker.addListener('click', function () {
        info.open(map, marker);
      })

      userMarker.push(marker);
      userInfo.push(info);
    }


    if (location.name == myName && !centered) {
      map.setCenter(point);
      centered = true;
    }
  })
}

function geoErrorCb(error) {
  alert('NEJ');
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccessCb, geoErrorCb);
  }
}