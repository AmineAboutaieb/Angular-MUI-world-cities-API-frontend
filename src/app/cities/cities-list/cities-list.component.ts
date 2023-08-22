import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { City } from 'src/app/entities/City';
import { PaginationDto } from 'src/app/entities/PaginationDto';
import { CitiesService } from 'src/app/services/cities.service';

@Component({
  selector: 'app-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.css']
})
export class CitiesListComponent {

  cities?: City[];
  paginationData?: PaginationDto;

  constructor(private citiesService: CitiesService){}

  currentPage: number = 0;

  ngOnInit(): void {
    this.getCities();
    this.citiesService.getCitiesPaginationData().subscribe({next : (response)=>{
      this.paginationData = response;
    }, error : (error)=>{
      console.log(error);
    }})
  }

  getCities(){
    this.citiesService.getCities(this.currentPage).subscribe({next : (response)=>{
      this.cities = response;
    }, error : (error)=>{}})
  }

  handlePageEvent(event: PageEvent){
    this.currentPage = event.pageIndex;
    this.getCities();
  }

}
