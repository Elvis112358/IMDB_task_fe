import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import * as turf from '@turf/turf'; // Import Turf
import colorInterpolate from 'color-interpolate';
declare var google: any;



@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements AfterViewInit {
  private colormap: any;
  private map: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Initialize color interpolation
    this.colormap = colorInterpolate(['rgba(33,102,172,0)', 'rgb(103,169,207)', 'rgb(209,229,240)', 'rgb(253,219,199)', 'rgb(239,138,98)', 'rgb(178,24,43)']);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: { lat: 50, lng: -120 }
    });

    google.maps.event.addListenerOnce(this.map, 'bounds_changed', () => {
      this.http.get('./assets/earthquake-data.geojson').subscribe((earthquakeData: any) => {
        const currentBounds = this.map.getBounds();
        console.log(currentBounds.getNorthEast().lng(), currentBounds.getNorthEast().lat(), currentBounds.getSouthWest().lng(), currentBounds.getSouthWest().lat());

        const hexGrid = turf.hexGrid([
          currentBounds.getNorthEast().lng(), currentBounds.getNorthEast().lat(), currentBounds.getSouthWest().lng() - 360, currentBounds.getSouthWest().lat()
        ], 100);

        console.log(hexGrid);

        let min = 0;
        let max = 0;
        let maxIntensity = 0;
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

        this.map.data.addGeoJson(hexGrid);
        this.map.data.setStyle((feature: any) => {
          let thisColor = this.colormap(feature.getProperty('earthquakeNumber') / max);
          return {
            fillColor: thisColor,
            strokeWeight: 0
          };
        });
      });
    });
  }
}
