const apiPath = "ellie2024";
const token = "hfJtHOPlbRhvrENYbBPc58tKa0D3";

const productDisplayUl = document.querySelector('.productWrap');
const shoppingCartTable = document.querySelector('.shoppingCart-table');
const shoppingCartHeaderHTML = `
  <tr>
    <th width="40%">品項</th>
    <th width="15%">單價</th>
    <th width="15%">數量</th>
    <th width="15%">金額</th>
    <th width="15%"></th>
  </tr>`
const shoppingCartFooterHTML = `
  <tr>
    <td>
      <a href="#" class="discardAllBtn">刪除所有品項</a>
    </td>
    <td></td>
    <td></td>
    <td>
      <p>總金額</p>
    </td>
    <td>NT$13,980</td>
  </tr>`

function getProductList(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/products`)
  .then(function(res){
    const productData = res.data.products;
    renderProductDisplay(productData);
  })
  .catch(function(error){
    console.log(error.res.data)
  })
}

// 清除預設產品列表
function clearProductDisplay(){
  productDisplayUl.innerHTML = ''
}

// 金額轉換為千分位顯示
function priceToLocaleString(price){
  return price.toLocaleString();
}

// 渲染產品列表
function renderProductDisplay(productData){
  productData.forEach(function(item){
    productDisplayUl.innerHTML += `
    <li class="productCard">
      <h4 class="productType">新品</h4>
      <img src="${item.images}" alt="">
      <a href="#" class="addCardBtn">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${priceToLocaleString(item.origin_price)}</del>
      <p class="nowPrice">NT$${priceToLocaleString(item.price)}</p>
    </li>
    `
  })
}

// 取得購物車列表
function getCartList(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`)
  .then(function(res){
    console.log(res.data.carts)
    
    const cartData = res.data.carts;
    renderCartList(cartData);
  })
}

// 清空購物車
function clearShoppingCart(){
  shoppingCartTable.innerHTML = `${shoppingCartHeaderHTML}${shoppingCartFooterHTML}`
}

function renderCartList(cartData){
  let cartListHTML = '';
  cartData.forEach(function(item){
    let totalPrice = (item.quantity)*(item.product.price);
    cartListHTML += `
    <tr>
      <td>
        <div class="cardItem-title">
          <img src="${item.product.images}" alt="">
          <p>${item.product.title}</p>
        </div>
      </td>
      <td>NT$${priceToLocaleString(item.product.price)}</td>
      <td>${item.quantity}</td>
      <td>NT$${priceToLocaleString(totalPrice)}</td>
      <td class="discardBtn">
        <a href="#" class="material-icons">
            clear
        </a>
      </td>
    </tr>`

    shoppingCartTable.innerHTML = `${shoppingCartHeaderHTML}${cartListHTML}${shoppingCartFooterHTML}`
  })
}

clearProductDisplay();
getProductList();
clearShoppingCart();
getCartList();