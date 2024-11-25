import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{
  searchResult:undefined|product[];
  resultNotFound:undefined|string;
  constructor(private product:ProductService,private activateRoute: ActivatedRoute) { }
  ngOnInit(): void {
    let query = this.activateRoute.snapshot.paramMap.get('query')
    query && this.product.searchproducts(query).subscribe((result)=>{
      if(result.length <1){
        this.resultNotFound = "Results Not Found";
      }
      this.searchResult = result;
    })

  }

}
