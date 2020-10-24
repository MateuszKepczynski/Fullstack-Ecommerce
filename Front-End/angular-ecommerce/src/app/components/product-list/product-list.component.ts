import { Component, OnInit } from '@angular/core';
import {Product} from '../../common/product';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId = 1;
  previousCategoryId: number;
  currentCategoryName: string;
  previousKeyword: string = null;
  searchMode = false;

  thePageNumber = 1;
  thePageSize = 5;
  theTotalElements = 0;

  // Injecting Service, and Activated Route
  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if ( this.searchMode ) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if ( hasCategoryId )
    {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.currentCategoryName = this.route.snapshot.paramMap.get('categoryName');
    }
    else
    {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if ( this.previousCategoryId != this.currentCategoryId)
    {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                              this.thePageSize,
                                              this.currentCategoryId)
                                              .subscribe(this.processResult());
  }

  handleSearchProducts() {
    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword');

    if ( this.previousKeyword != theKeyWord)
    {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyWord;

    console.log(theKeyWord);
    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyWord).subscribe(this.processResult());
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
