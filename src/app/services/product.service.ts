import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  cartData= new EventEmitter<product[] | []>();

  constructor(private http:HttpClient) { }
  addProduct(data:product): Observable<any>{
    return this.http.post('https://dummyjson.com/products/add',data);
  }
  productList(){
    return this.http.get<product[]>('https://dummyjson.com/products');
  }
  deleteThe(id:number): Observable<any>{
    return this.http.delete(`https://dummyjson.com/products/${id}`);
  }
  getProduct(id:string){
    return this.http.get<product>(`https://dummyjson.com/products/${id}`)

  }
  updateProduct(product:product){
    const requestbody = {
      title: product.title
    }
    return this.http.put<product>(`https://dummyjson.com/products/${product.id}`,requestbody)
  }
  popularProducts(){
    return this.http.get<product[]>('https://dummyjson.com/products?limit=3')
  }
  trendyProducts(){
    return this.http.get<product[]>('https://dummyjson.com/products?limit=8')
  }
  searchproducts(query:string){
    const params = new HttpParams().set('q',query)
    return this.http.get<product[]>(`https://dummyjson.com/products/search`,{params})
  }
  localAddToCart(data:product){
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if(!localCart){
      localStorage.setItem('localCart',JSON.stringify([data]));
      this.cartData.emit([data]);  
        
    }
    else{
      cartData = JSON.parse(localCart);
      cartData.push(data)
      localStorage.setItem('localCart',JSON.stringify(cartData));
      
      this.cartData.emit(cartData);
    }
  }
  removeItemFromCart(productId:number){
    let cartData = localStorage.getItem('localCart');

    if(cartData){
      let items:product[] = JSON.parse(cartData)
      items = items.filter((item:product)=> productId!==item.id 
      );
      localStorage.setItem('localCart',JSON.stringify(items));
      this.cartData.emit(items);
    }

  }
  addToCart(cartData:cart){
    console.warn('cart data in service',cartData);
    const userId = cartData.userId;
    const requestbody = {
      merge: true,
      products: [
      {
        id: cartData.productId,
        quantity: cartData.quantity
      },
    ]

    }
    return this.http.patch(`https://dummyjson.com/carts/${userId}`,requestbody);

  }
  getCartList(userId:number){
    return this.http.get<product[]>(`https://dummyjson.com/carts/user/${userId}`, 
      {observe:'response'}).subscribe((result)=>{
        if(result && result.body){
          this.cartData.emit(result.body); //result.body not result because its in the product[] format.
        }
      });

  }
  removeToCart(id:number){
    return this.http.delete(`https://dummyjson.com/carts/${id}`);
  }
  currentCart(){
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>(`https://dummyjson.com/carts/user/${userData.id}`);
  }
  orderNow(data:order){
    return this.http.post('http://localhost:3000/orders',data);

  }
  orderList(){
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>(`http://localhost:3000/orders?userId=${userData.id}`);
  }
  deleteCartItems(cartId:number){
    return this.http.delete(`http://localhost:3000/cart/${cartId}`,{observe:'response'}).subscribe((result)=>{
      if(result ){
        this.cartData.emit([]);
      }

    });
  }
  cancelOrder(orderId:number){
    return this.http.delete(`http://localhost:3000/orders/${orderId}` )

  }

}
//observable<any> method returns an observable that emits  the response from the server of any type.

