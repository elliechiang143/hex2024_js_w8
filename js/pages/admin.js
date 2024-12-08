let orderData = []
const orderPageTable = document.querySelector('.orderPage-table tbody')
const delSingleOrderBtn = document.querySelector('.delSingleOrder-Btn')
const discardAllBtn = document.querySelector('.discardAllBtn')

function getOrders(){
  axios.get(`${adminAPI}/orders`, headers)
  .then(res=> {
    // console.log(res.data.orders)
    orderData = res.data.orders
    renderOders();
    calcProductCategory();
  })
  .catch(err=> {
    console.log(err)
  })
}

function claerOderTable(){
  orderPageTable.innerHTML = ''
}

function formatTime(timestamp){
  const time = new Date(timestamp * 1000)
  return time.toLocaleString('zh-TW', {
    hour12: false,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function renderOders(){
  let str = '';
  orderData.forEach(data=>{
    productsTitle = '';
    data.products.forEach(productsData=>{
      productsTitle += `<p>${productsData.title} x ${productsData.quantity}</p>`
    })

    str += `
      <tr data-id="${data.id}">
        <td>${data.id}</td>
        <td>
          <p>${data.user.name}</p>
          <p>${data.user.tel}</p>
        </td>
        <td>${data.user.address}</td>
        <td>${data.user.email}</td>
        <td>${productsTitle}</td>
        <td>${formatTime(data.createdAt)}</td>
        <td class="orderStatus">
          <a href="#">${data.paid ? `<span style="color:#1f9353">已處理</span>` : `<span style="color:#C44021">未處理</span>`}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn abc" value="刪除">
        </td>
      </tr>
    `
  })
  orderPageTable.innerHTML = str
}

// 刪除單筆訂單
function deleteSingleOder(id){
  axios.delete(`${adminAPI}/orders/${id}`,headers)
  .then(res=>{
    orderData = res.data.orders;
    renderOders();
  })
  .catch(err=>{
    console.log(err)
  })
}

// 刪除全部訂單
function deleteAllOders(){
  axios.delete(`${adminAPI}/orders`,headers)
  .then(res=>{
    orderData = res.data.orders;
    renderOders();
    renderChart([])
  })
  .catch(err=>{
    console.log(err)
  })
}

discardAllBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  deleteAllOders();
})

orderPageTable.addEventListener('click', (e)=>{
  e.preventDefault();
  // 刪除按鈕
  const id = e.target.closest('tr').getAttribute('data-id')
  if(e.target.classList.contains('delSingleOrder-Btn')){
    deleteSingleOder(id);
  }
  if(e.target.nodeName === 'SPAN'){
    changeOrderStatus(id);
  }
})

// 修改訂單狀態
function changeOrderStatus(id){
  let result = {};
  orderData.forEach(data=>{
    if(data.id === id){
      result = data;
    }
  })
  console.log(result.paid);

  axios.put(`${adminAPI}/orders`,{
    data: {
      id: id,
      paid: !result.paid
    }
  }, headers)
  .then(res=>{
    orderData = res.data.orders;
    renderOders();
  })
  .catch(err=>{
    console.log(err)
  })
}

function init(){
  claerOderTable();
  getOrders();
}

init();

// LV1 全產品營收比重
function calcProductCategory(){
  const resultObj = {};
  orderData.forEach(data=>{
    // console.log(data.products)
    data.products.forEach(product=>{
      // console.log(product.category)
      if(resultObj[product.category] === undefined){
        resultObj[product.category] = product.price * product.quantity
      }else{
        resultObj[product.category] += product.price * product.quantity
      }
    })
  })
  // console.log(resultObj)
  // 把物件轉成陣列
  renderChart(Object.entries(resultObj))
}


// C3.js
function renderChart(data){
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    color: {
      pattern: ["#DACBFF", "#9D7FEA", "#5434A7", "#301E5F"]
    },
    data: {
      type: "pie",
      columns: data,
      // colors:{
      //   "Louvre 雙人床架":"#DACBFF",
      //   "Antony 雙人床架":"#9D7FEA",
      //   "Anty 雙人床架": "#5434A7",
      //   "其他": "#301E5F",
      // }
    },
  });
}