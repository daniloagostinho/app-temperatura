import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { StoreService } from '../service/store.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  constructor(private fb: FormBuilder, private storeService: StoreService) { }

  ngOnInit(): void {
    this.city()
  }
  form = this.fb.group({
    city: ['', Validators.required]
  })

  city() {
    this.form.valueChanges
    .pipe(debounceTime(500))
    .subscribe(data => {
      this.storeService.setStore(data.city)
    })
  }
}
