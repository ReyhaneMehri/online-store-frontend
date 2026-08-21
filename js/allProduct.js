const productContainer = document.querySelector("#products-container");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const categoryButton = document.querySelectorAll(".category-btn");
const params = new URLSearchParams(window.location.search);
const categoryFromUrl = params.get("category");

const productCount = document.querySelector(".product-count");
let currentProduct = [];
let apiData = [];
function createQuantityControl(productId, count) {
  return ` 
  <div class="quantity-control">
    <button class="minus" data-id = "${productId}">-</button>
      <span class="count">${count}</span>
      <button class="plus" data-id = "${productId}">+</button>
      </div>
      `;
}
function createAddBtn(productId) {
  return `
        <div class="ms-auto">
      <button type="button" class="btn btn-add" data-id = ${productId}>افزودن</button>
      </div>
  `;
}

function addToCart(productId) {
  const existProduct = cart.find((item) => item.id == productId);
  if (existProduct) {
    existProduct.count++;
  } else {
    const product = apiData.find(function (item) {
      return item.id == productId;
    });
    cart.push({
      ...product,
      count: 1,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}
function updateProductPrice(product, priceElement) {
  const totalPrice = Math.round(product.price * product.count);
  priceElement.innerText = totalPrice;
}
function renderProduct (products){
       productContainer.innerHTML = "";
    products.forEach(function (item) {
        const cartProduct = cart.find(function (product) {
        return product.id === item.id;
      });
        let actionHtml = "";
        let count = cartProduct ? cartProduct.count : 1;

        let totalPrice = item.price;
      if (cartProduct) {
        
        totalPrice = Math.round(item.price * count);
        actionHtml = createQuantityControl(item.id, count);
      } else {
        actionHtml = createAddBtn(item.id);
      }
      const formattedPrice = totalPrice.toLocaleString("en-US");

        productContainer.innerHTML += `
      <div class="product-card">
      <a href="product.html?id=${item.id}">
      <img src="${item.image}" class="img">  
      <p class="title">${item.title}</p>
      </a>
      <div class="mount-info">
      <span class="price">${formattedPrice}</span>
      
       ${actionHtml}
     
      </div>
      </div>

            `;
}
    )};

async function getData() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
apiData = data;

if (categoryFromUrl) {
  categoryButton.forEach(function(button){
    if (button.dataset.category === categoryFromUrl){
        button.classList.add("active");
    }
  });
    currentProduct = apiData.filter(function (item) {
    return item.category === categoryFromUrl;
  });
} else {
  currentProduct = apiData;
}

productCount.textContent = currentProduct.length;
renderProduct(currentProduct);
    
  } catch(error) {
    console.log(error);
  }
}

categoryButton.forEach(function(button){
    button.addEventListener("click",function(){
        const category = button.dataset.category;
        let filteredProduct;
        categoryButton.forEach(function(btn){
            btn.classList.remove("active");
        });
        button.classList.add("active");
        if(category === "all"){
            currentProduct = apiData;
        }else{
            currentProduct = apiData.filter(function(item){
                return item.category === category;
            });
        }
        renderProduct(currentProduct);
        productCount.textContent = currentProduct.length;
    })
})

const sortButtons = document.querySelectorAll(".dropdown-item");
sortButtons.forEach(function(button){
    button.addEventListener("click",function(){
        const sortType = button.dataset.sort;
        let sortedProduct;
        if(sortType === "cheap"){
            sortedProduct = [...currentProduct].sort(function(a,b){
                return a.price - b.price;
            });
        }
        if(sortType === "expensive"){
            sortedProduct = [...currentProduct].sort(function(a,b){
                return b.price -a.price;
            });
        }
        renderProduct(sortedProduct);
    });
});


productContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-add")) {
    const productId = e.target.dataset.id;
    addToCart(productId);
    const cartbox = e.target.parentElement;
    cartbox.innerHTML = createQuantityControl(productId, 1);
  } else if (e.target.classList.contains("plus")) {
    const productId = e.target.dataset.id;
    const product = cart.find(function (item) {
      return item.id == productId;
    });
    if (product) {
      product.count++;
      localStorage.setItem("cart", JSON.stringify(cart));
      const count = e.target.previousElementSibling;
      count.innerText = product.count;
      const priceElement = e.target
        .closest(".mount-info")
        .querySelector(".price");
      updateProductPrice(product, priceElement);
    } else {
      console.log("محصولو پیدا نکردیم");
    }
  } else if (e.target.classList.contains("minus")) {
    const productId = Number(e.target.dataset.id);
    const product = cart.find(function (item) {
      return item.id == productId;
    });
    if (product.count > 1) {
      product.count--;
      const priceElement = e.target
        .closest(".mount-info")
        .querySelector(".price");
      updateProductPrice(product, priceElement);
      localStorage.setItem("cart", JSON.stringify(cart));
      const count = e.target.nextElementSibling;
      count.innerText = product.count;
    } else {
      cart = cart.filter(function (item) {
        return item.id != productId;
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      e.target.parentElement.innerHTML = createAddBtn(productId);
    }
  }
  if (e.target.classList.contains("btn-error")) {
    getData();
  }
});





getData();

