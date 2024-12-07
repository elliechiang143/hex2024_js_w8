const apiPath = "ellie2024";
const token = "hfJtHOPlbRhvrENYbBPc58tKa0D3";

const productDisplayUl = document.querySelector('.productWrap');
const shoppingCartTable = document.querySelector('.shoppingCart-table tbody');
const discardAllBtn = document.querySelector('.discardAllBtn');
const productSelect = document.querySelector('.productSelect');
const cartTotalPrice = document.querySelector('.shoppingCart-table tfoot tr td:last-child');
const orderInfoBtn = document.querySelector('.orderInfo-btn');

let productData = [];

function getProductList(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/products`)
  .then(function(res){
    productData = res.data.products;
    renderProductDisplay(productData);
  })
  .catch(function(error){
    console.log(error || '取得產品列表失敗')
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

// 篩選產品類別
function productFilter(value){
  const result = [];
  productData.forEach(function(item){
    if(item.category == value){
      result.push(item)
    }
  })
  renderProductDisplay(result)
}

// 監聽篩選產品選單
productSelect.addEventListener('change', function(e){
  const categoryValue = e.target.value
  if(categoryValue === '全部'){
    renderProductDisplay(productData)
  }else{
    productFilter(categoryValue)
  }
})

// 渲染產品列表
function renderProductDisplay(productData){
  clearProductDisplay()
  productData.forEach(function(item){
    productDisplayUl.innerHTML += `
    <li class="productCard">
      <h4 class="productType">新品</h4>
      <img src="${item.images}" alt="">
      <a href="#" class="addCardBtn js-addCart" data-id="${item.id}">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${priceToLocaleString(item.origin_price)}</del>
      <p class="nowPrice">NT$${priceToLocaleString(item.price)}</p>
    </li>
    `
  })
}

let cartData = [];
// 取得購物車列表
function getCartList(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`)
  .then(function(res){
    cartData = res.data.carts;
    const cartTotalPrice = res.data.finalTotal
    // 當cartData為空陣列時
    if (cartData.length === 0){
      clearShoppingCart();
    } else {
      renderCartList();
    }
    renderCartTotalPrice(cartTotalPrice);
    getDiscardBtnDOM();
  })
  .catch(function(error){
    console.log(error || '取得購物車列表失敗')
  })
}

// 清空購物車
function clearShoppingCart(){
  shoppingCartTable.innerHTML = '<tr><td colspan="5" align="center">購物車內空空的 ( ´•̥̥̥ω•̥̥̥` )</td></tr>'
}

// 加入購物車
function addShoppingCart(productId){
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`,
  {
    data: {
      productId: productId,
      quantity: 1
    }
  })
  .then(function(res){
    //加入購物車後才get資料(非同步)
    getCartList()
    Swal.fire({
      text: "成功加入購物車囉 (っ˘ω˘ς )",
      icon: "success"
    });
  })
  .catch(function(error){
    console.log(error || '加入購物車失敗')
  })
}

productDisplayUl.addEventListener('click', function(e){
  e.preventDefault();
  if(e.target.classList.contains('js-addCart')){
    const productId = e.target.getAttribute('data-id');
    addShoppingCart(productId);
    // getCartList();--->放在這裡時不會等到先加入購物車後才取得購物車資料
  }
})

// 渲染購物車
function renderCartList(){
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
        <a href="#" class="material-icons" data-cartItemId="${item.id}">
            clear
        </a>
      </td>
    </tr>`
    shoppingCartTable.innerHTML = `${cartListHTML}`
  })
}

// 購物車總金額
function renderCartTotalPrice(totalPrice){
  cartTotalPrice.innerHTML = `NT$${priceToLocaleString(totalPrice)}`
}

// 刪除購物車單一商品
function clearCartItem(id){
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts/${id}`)
  .then(function(res){
    getCartList();
    Swal.fire({
      text: "已移除一項商品 (´;ω;`)",
      icon: "success"
    });
  })
  .catch(function(error){
    console.log(error || '刪除商品失敗')
  })
}

// 取得購物車內刪除商品按鈕的DOM
function getDiscardBtnDOM(){
  const discardBtn = document.querySelectorAll('.discardBtn a')
}

// 點擊刪除購物車單一商品按鈕
shoppingCartTable.addEventListener('click', function(e){
  e.preventDefault();
  if(e.target.tagName === 'A'){
    const cartItemId = e.target.getAttribute('data-cartItemId');
    clearCartItem(cartItemId);
  }
})

// 清除購物車內全部商品
function clearCart(){
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`)
  .then(function(res){
    getCartList()
    Swal.fire({
      text: "已清除購物車內所有商品 இдஇ",
      icon: "success"
    });
  })
  .catch(function(error){
    console.log(error || '清除購物車內全部商品失敗')
  })
}

// 清除購物車按鈕
discardAllBtn.addEventListener('click', function(e){
  e.preventDefault();
  clearCart();
})

const orderName = document.querySelector('#customerName')
const orderPhone = document.querySelector('#customerPhone')
const orderMail = document.querySelector('#customerEmail')
const orderAddress = document.querySelector('#customerAddress')
const orderTradeWay = document.querySelector('#tradeWay')
const orderInfoForm = document.querySelector('.orderInfo-form')

function checkForm(){
  const constraints = {
    姓名: {
      presence: { message: "^必填" },
    },
    電話: {
      presence: { message: "^必填" },
      length: {
        is: 10,
        message: "^請輸入正確的電話號碼"
      },
    },
    Email: {
      presence: { message: "^必填" },
      email: { message: "^請輸入正確的信箱格式" },
    },
    寄送地址: {
      presence: { message: "^必填" },
    },
  };

  const errorMessages = document.querySelectorAll('.orderInfo-message');
  errorMessages.forEach(function(message) {
    message.remove();
  });

  const errors = validate(orderInfoForm, constraints)

  // 如果沒有錯誤時，errors的值為undefined
  if (errors){
    const errorArr = Object.keys(errors)
    errorArr.forEach(function(item){
      const input = document.querySelector(`input[name=${item}]`)
      const message = `<p class="orderInfo-message" data-message=${item}>必填！</p>`
      input.insertAdjacentHTML('afterend', message);
    })
  }
  return errors
}

// 送出訂單
function submitOrder(){
  let orderData = {
    data: {
      user: {
        name: orderName.value.trim(),
        tel: orderPhone.value.trim(),
        email: orderMail.value.trim(),
        address: orderAddress.value.trim(),
        payment: orderTradeWay.value
      }
    }
  }

  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/orders`, 
    orderData
  )
  .then(function(res){
    getCartList();
    orderInfoForm.reset();
    Swal.fire({
      title: "感謝您的購買",
      text: "成功送出訂單! (*´▽`*)",
      icon: "success"
    });
  })
  .catch(function(error){
    console.log(error.response.data.message)
  })
}

orderInfoBtn.addEventListener('click', function(e){
  e.preventDefault();

  if(cartData.length == 0){
    alert('購物車內沒有東西啊!! ((((；゜Д゜)))')
    return;
  }

  if (checkForm()){
    return;
  }else{
    submitOrder();
  }
})

function init(){
  getProductList();
  clearShoppingCart();
  getCartList();
}

init();