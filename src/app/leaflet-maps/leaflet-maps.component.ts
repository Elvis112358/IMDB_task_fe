import { Component, ElementRef, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet'; 
import * as turf from '@turf/turf'; // Import Turf
import colorInterpolate from 'color-interpolate';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-leaflet-maps',
  templateUrl: './leaflet-maps.component.html',
  styleUrls: ['./leaflet-maps.component.scss']
})
export class LeafletMapsComponent {
  cellAdded = true;
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  hexLayer?: Leaflet.GeoJSON;
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 4,
    center: { lat: 50, lng: -120 }
  }
  @ViewChild('map', { static: true }) mapContainer!: ElementRef;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadEarthquakeData();
  }

  private loadEarthquakeData(): void {
    this.http.get('./assets/earthquake-data.geojson').subscribe((earthquakeData: any) => {

      const currentBounds = this.map.getBounds();
      console.log(currentBounds)
      console.log(currentBounds.getNorthEast().lng, currentBounds.getNorthEast().lat, currentBounds.getSouthWest().lng, currentBounds.getSouthWest().lat);
      // Need to format bounds to fit Turf
      const hexGrid = turf.hexGrid([
        currentBounds.getNorthEast().lng, currentBounds.getNorthEast().lat, currentBounds.getSouthWest().lng, currentBounds.getSouthWest().lat
      ], 100)
  
      let min = 0
      let max = 0
      let maxIntensity = 0
      hexGrid.features.forEach((feature: any) => {
        const pointsInThisFeature = turf.pointsWithinPolygon(earthquakeData, feature);
        feature.properties.earthquakeNumber = pointsInThisFeature.features.length;
        feature.properties.earthquakeIntensity = pointsInThisFeature.features.reduce((a: number, b: any) => a + b.properties.mag, 0);

        if (feature.properties.earthquakeNumber > max) {
          max = pointsInThisFeature.features.length;
        }
        if (feature.properties.earthquakeIntensity > maxIntensity) {
          maxIntensity = feature.properties.earthquakeIntensity;
        }
      });
  
  
      // We run this after we've done the calculations, so we know the max and min accurately
      // Using color-interpolate browserified
      let colormap = colorInterpolate(['rgba(33,102,172,0)', 'rgb(103,169,207)', 'rgb(209,229,240)', 'rgb(253,219,199)', 'rgb(239,138,98)', 'rgb(178,24,43)']);
      this.hexLayer  = Leaflet.geoJSON(hexGrid, {
        style : (feature) => {
          let thisColor = colormap(feature?.properties.earthquakeNumber / max);
          return {
            color : thisColor
          }
        }
      }).addTo(this.map)
    });
  }

  initMarkers() {
    // const initialMarkers = [
    //   {
    //     position: { lat: 28.625485, lng: 79.821091 },
    //     draggable: true
    //   },
    //   {
    //     position: { lat: 28.625293, lng: 79.817926 },
    //     draggable: false
    //   },
    //   {
    //     position: { lat: 28.625182, lng: 79.81464 },
    //     draggable: true
    //   }
    // ];
    // for (let index = 0; index < initialMarkers.length; index++) {
    //   const data = initialMarkers[index];
    //   const marker = this.generateMarker(data, index);
    //   marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
    //   this.map.panTo(data.position);
    //   this.markers.push(marker)
    // }
  }

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
  }

  mapClicked($event: any) {

    const data = {
      position: { lat: $event.latlng.lat, lng: $event.latlng.lng },
      draggable: true
    }
    const marker = this.generateMarker(data, this.markers.length - 1);
    marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
    this.markers.push(marker);
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  }  

  cellEnableDisable() {
    if(this.cellAdded) {
      if (this.hexLayer) {
        this.cellAdded = false;
        this.map.removeLayer(this.hexLayer);
      }
    } else {
      this.loadEarthquakeData();
      this.cellAdded = true;
    }
  }
  proximityEnableDisable() {
    
  }
}
