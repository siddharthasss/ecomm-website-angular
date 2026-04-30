import { Component, OnInit } from '@angular/core';
import { cart, priceSummary, product } from '../data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit{
  cartData: undefined| cart[] ;
  productMessage:undefined|string;
  priceSummary:priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  };
  constructor(private product:ProductService,private router:Router){}
  ngOnInit(): void {
    this.loadDetails();
    

  }
  checkout(){
    this.router.navigate(['/checkout']);
  }
  removeToCart(cartId:number|undefined){
    cartId && this.product.removeToCart(cartId).subscribe((result)=>{
      if(result){          
        this.productMessage = "Item removed from cart";
        this.loadDetails();         
        setTimeout(() => {
          this.productMessage = undefined;
        }, 3000);     
      }
    })

  }
  loadDetails(){
    this.product.currentCart().subscribe((result:any)=>{
      console.warn('cart details',result);
      this.cartData = result.carts[0].products;
      console.warn('cart data',this.cartData);
      let  price = result.carts[0].total;      
      this.priceSummary.price = price;
      this.priceSummary.discount = Math.round(price*0.1);
      this.priceSummary.tax = Math.round(price*0.05);
      this.priceSummary.delivery = 100;
      this.priceSummary.total = price - this.priceSummary.discount + this.priceSummary.tax + this.priceSummary.delivery;
      if(!this.cartData?.length){
        this.router.navigate(['/']);
      }
    })
  }


}
