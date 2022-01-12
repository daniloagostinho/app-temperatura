import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiKey } from '../classes/api-key';
import { HttpService } from '../service/http.service';
import { StoreService } from '../service/store.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  urlImage: string = '';
  apiKey: ApiKey = new ApiKey();
  urlLocations: any;
  urlCurrentCondition: any;
  showContent: any;
  city: any;
  temperature: any;
  climate: any;
  loading: boolean = false;
  durationInSeconds = 5;
  constructor(
    private storeService: StoreService,
    private http: HttpService,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.getCity();
    console.log('loading >> ', this.loading)
  }

  getCity() {
    this.storeService.getStore().subscribe(city => {
      this.urlLocations = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${this.apiKey.apiKey}&q=${city}`;
      city ? this.citySearch(this.urlLocations) : null;
      city ? this.showContent = true : this.showContent = false;
      if(city) {
        this.loading = true;
      }
    })
  }

  citySearch(url: string) {
    this.http.getData(url).subscribe((data: any) => {
      try {
        let {Key, LocalizedName} = data[0];
        if(Key == undefined) {
          this.openSnackBar();
        } else {
          this.currentConditions(Key, LocalizedName);
        }
      } catch (error) {
        this.openSnackBar();
        this.loading = false;
        this.showContent = false;
      }
    })
  }
  currentConditions(key: string, localizedName: string) {
    this.urlCurrentCondition = `http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=${this.apiKey.apiKey}&language=pt-br`;
    this.http.getData(this.urlCurrentCondition).subscribe((data: any) => {
      let {Temperature, WeatherText, IsDayTime} = data[0];
      IsDayTime ? this.urlImage = '../assets/day.svg'  : this.urlImage = '../assets/night.svg';

      this.fillVariables(Temperature, WeatherText, localizedName);
    })
  }

  fillVariables(temperature: any, weatherText: any, localizedName: any) {
    this.temperature = temperature.Metric.Value;
    this.climate = weatherText;
    this.city = localizedName;
    this.cancelLoading();
  }


  cancelLoading() {
    setTimeout(() => {
      this.loading = false;
    } , 1000);
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
}
