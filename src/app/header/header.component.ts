import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  menuType:string = 'default'
  sellerName:string = '';
  searchResults :undefined | product[];
  userName:string="";
  cartItems=0;
  constructor(private route:Router,private product: ProductService){}
  ngOnInit(): void {
    this.route.events.subscribe((val:any)=>{
      if(val.url){
        if(val.url.includes('seller') && localStorage.getItem('seller')){
          console.warn('in seller area');
          this.menuType = 'seller'
          if(localStorage.getItem('seller')){
            let sellerStore = localStorage.getItem('seller');
            let sellerData = sellerStore && JSON.parse(sellerStore)[0];
            this.sellerName = sellerData.name;

          }
      }
      else if(localStorage.getItem('user')){
        let userStore = localStorage.getItem('user');
        let userData = userStore && JSON.parse(userStore);
        this.userName= userData.name;
        this.menuType='user';
        this.product.getCartList(userData.id);
      }
      else{
        console.warn('outside seller')
        this.menuType = 'default'
      }
      }
    })
    let cartData = localStorage.getItem('localCart');
    if(cartData){
      this.cartItems = JSON.parse(cartData).length; 
    }
    this.product.cartData.subscribe((items)=>{
      this.cartItems = items.length;      
    })
    
  }
  logout(){
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
  }
  userLogout(){
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth']);
    this.product.cartData.emit([]);
  }
  searchProduct(query:KeyboardEvent){
    if(query){
      const element = query.target as HTMLInputElement;
      this.product.searchproducts(element.value).subscribe((result)=>{
        
        if(result.length>5){
          result.length=5;
        }
        this.searchResults = result;
      })

    }
  }
  hideSearch(){
    this.searchResults = undefined;
  }
  submitSearch(val:String){
    this.route.navigate([`search/${val}`])
  }
  redirectToDetails(id:number){
    this.route.navigate(['/details/'+id]);
  }

}
