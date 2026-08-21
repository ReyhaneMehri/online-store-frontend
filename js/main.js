let cart = JSON.parse(localStorage.getItem("cart")) || [];
let apiData = [];
const offerProducts = document.querySelector("#offer-product");

function updateProductPrice(product, priceElement) {
  const totalPrice = Math.round(product.price * product.count);
  priceElement.innerText = totalPrice;
}

function createQuantityControl(productId, count) {
  return ` 
  <div>
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

function showSkeleton() {
  offerProducts.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    offerProducts.innerHTML += `
      <div class="skeleton-card">
        <div class="product-card" aria-hidden="true">

          <div class="placeholder-glow skeleton-img">
            <span class="placeholder w-100 h-100"></span>
          </div>

          <div class="card-body">

            <h5 class="card-title placeholder-glow">
              <span class="placeholder col-8"></span>
            </h5>

            <div class="d-flex justify-content-between align-items-center flex-row-reverse">
              <span class="placeholder col-3"></span>
              <span class="placeholder col-4"></span>
            </div>

          </div>
        </div>
      </div>
    
    `;
  }
}
function showPopularSkeleton() {
  const popularProductList = document.querySelector("#popular-product-list");

  popularProductList.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    popularProductList.innerHTML += `
          <div class="skeleton-card">
        <div class="product-card" aria-hidden="true">

          <div class="placeholder-glow skeleton-img">
            <span class="placeholder w-100 h-100"></span>
          </div>

          <div class="card-body">

            <h5 class="card-title placeholder-glow">
              <span class="placeholder col-8"></span>
            </h5>

            <div class="d-flex justify-content-between align-items-center flex-row-reverse">
              <span class="placeholder col-3"></span>
              <span class="placeholder col-4"></span>
            </div>

          </div>

        </div>
      </div>
    
    `;
  }
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

async function getProduct() {
  showSkeleton();
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    apiData = data;
    popularProduct();
    let productsHtml = "";
    apiData.forEach(function (item) {
      const cartProduct = cart.find(function (product) {
        return product.id === item.id;
      });
      let totalPrice = item.price;
      if (cartProduct) {
        totalPrice = Math.round(item.price * cartProduct.count);
      }
      const formattedPrice = totalPrice.toLocaleString("en-US");
      let actionHtml = "";
      if (cartProduct) {
        actionHtml = createQuantityControl(item.id, cartProduct.count);
      } else {
        actionHtml = createAddBtn(item.id);
      }
      productsHtml += `
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
    });
    offerProducts.innerHTML = productsHtml;
  } catch (error) {
    offerProducts.innerHTML = `
    <div class="error-state">
    <span>یه مشکلی پیش اومده☕</span>
    <button class="btn btn-error">تلاش دوباره</button>
    </div>
    
    `;
    console.log("خطا در دریافت محصولات", error);
  }
}

document.addEventListener("click", function (e) {
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
    getProduct();
  }
});

function searchProduct() {
  const searchInputs = document.querySelectorAll(
    "#search-input, #search-input-mobile"
  );

  searchInputs.forEach(function (searchInput) {

    searchInput.addEventListener("input", function (e) {

      const searchValue = e.target.value.trim();

      const searchResult =
        searchInput.id === "search-input"
          ? document.querySelector("#search-result")
          : document.querySelector("#search-result-mobile");

      searchResult.innerHTML = "";

      if (!searchValue) {
        return;
      }

      const filteredData = apiData.filter((item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      );

      filteredData.forEach(function (item) {
        searchResult.innerHTML += `
        
                  <div class="cart-shopping-list">
            <a href="product.html?id=${item.id}">
              <img src="${item.image}" class="img">
            </a>

            <div class="card-body">
              <p class="card-text">${item.title}</p>
              <span class="price">${item.price}</span>
            </div>
          </div>
         `;

      });

      if (filteredData.length === 0) {
        searchResult.innerHTML = "محصولی با این عنوان پیدا نشد";
      }

    });

  });
}

function popularProduct() {
  const popularProductList = document.querySelector("#popular-product-list");
  const popularProducts = [...apiData]
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, 6);

  let popularHtml = "";

  popularProducts.forEach(function (item) {
    const cartProduct = cart.find(function (product) {
      return product.id === item.id;
    });

    let totalPrice = item.price;

    if (cartProduct) {
      totalPrice = Math.round(item.price * cartProduct.count);
    }

    const formattedPrice = totalPrice.toLocaleString("en-US");

    let actionHtml = "";

    if (cartProduct) {
      actionHtml = createQuantityControl(item.id, cartProduct.count);
    } else {
      actionHtml = createAddBtn(item.id);
    }

    popularHtml += `
            <div class="product-card">
        <a href="product.html?id=${item.id}">
          <img src="${item.image}" class="img">
          <p class="title">${item.title}</p>
        </a>
                  <div>
                <span>👌 ${item.rating.rate} نفر پیشنهاد دادند</span>
                <hr>
                <span>${item.rating.count} نفر نظر داده‌اند </span>
            </div>
        <div class="mount-info">
          <span class="price">${formattedPrice}</span>

          ${actionHtml}
        </div>
      </div>
    
    `
  });

  popularProductList.innerHTML = popularHtml;
}
// popularProduct();
showPopularSkeleton();
getProduct();
searchProduct();
