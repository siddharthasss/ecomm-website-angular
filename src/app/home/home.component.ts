import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { Router } from '@angular/router';
import { HeaderService } from '../header/header.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  popularProducts :undefined | any[];
  trendyProduts :undefined | any[];   
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  constructor(private product:ProductService, private router:Router,private header:HeaderService) { }
  ngOnInit(): void {
    this.product.popularProducts().subscribe((data:any)=>{
      console.warn(data)
      this.popularProducts = data.products;

    })
    this.product.productList().subscribe((data:any)=>{
      console.log('data',data)
      this.trendyProduts = data.products;

    })

  }
  addToCart(itemId:number|undefined){    
    this.router.navigate(['/details', itemId]);
  }
  

}


