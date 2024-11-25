import { Component, OnInit } from '@angular/core';
import { cart, login, product, signUp } from '../data-type';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit{
  showLogin:boolean = true
  authError:string = ""
  constructor(private user:UserService,private product:ProductService){}
  ngOnInit(): void {
    this.user.userAuthReload();

  }
  signUp(data:signUp){
    this.user.userSignUp(data);

  }
  login(data:login){
    this.user.userLogin(data);
    this.user.invalidUserAuth.subscribe((result)=>{
      console.warn("apple",result)
      if(result){
        this.authError =  "Invalid username or password";
      }else{
        this.localCartToRemoteCart();

      }
    })
  }
  openLogin(){
    this.showLogin = true;
  }
  openSignUp(){
    this.showLogin = false;
  }
  localCartToRemoteCart(){
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if(data){      
      let cartDataList:product[] = JSON.parse(data);          
      cartDataList.forEach((product:product,index) => {
        let cartData:cart = {
          ...product,
          productId:product.id,
          userId
        }
        delete cartData.id; 
        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((result)=>{
            if(result){
              console.warn('item stored in db');
            }
            
          })  
          if(cartDataList.length === index + 1){
            localStorage.removeItem('localCart');
          }  
        },500); 
          
      });
      
    }
    setTimeout(() => {
      this.product.getCartList(userId)},2000);
    
  }

}
