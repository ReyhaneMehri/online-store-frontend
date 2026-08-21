const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const productDetail = document.querySelector("#product-details");

let currentProduct;
async function getProduct() {
  try {
    const response = await fetch(
      `https://fakestoreapi.com/products/${productId}`,
    );
    const data = await response.json();
    currentProduct = data;
    const productCart = cart.find((item) => item.id == data.id);
    let count = productCart ? productCart.count : 1;
    const totalPrice = data.price * count;
    let buttonHtml = "";
    if (productCart) {
      buttonHtml = `
      <button class="minus ms-2" data-id = "${data.id}">-</button>
      <span class="count">${count}</span>
      <button class="plus me-2" data-id = "${data.id}">+</button>
        `;
    } else {
      buttonHtml = `
      <div class="ms-auto">
      <button type="button" class="btn btn-add" data-id = ${data.id}>افزودن</button>
      </div>
        `;
    }
    productDetail.innerHTML += `

    <nav class="breadcrumb">
    <ol>
        <li>
            <a href="index.html">خانه</a>
        </li>

        <li class="breadcrumb-arrow">›</li>

        <li class="active">
            ${data.category}
        </li>
    </ol>
</nav>

    <div class="product-details">

        <div class="product-image">
            <img src="${data.image}" class="img" alt="${data.title}">
        </div>

        <div class="information">

            <h2 class="title">${data.title}</h2>

            <div class="divider-line"></div>

            <div class="rate">
                <span>👌 ${data.rating.rate}</span>
                <span>${data.rating.count} نفر نظر داده‌اند 💡</span>
            </div>
            <p class="describe desktop-description">
                ${data.description}
            </p>
          <details class="mobile-description">
          <summary>
          توضیحات محصول
          <i class="fa-solid fa-chevron-down"></i>
          </summary>
            <p>
                ${data.description}
            </p>
          </details>
            <div class="product-bottom">

                <h4 class="price">
                    ${data.price}
                </h4>

                <div class="product-action">
                    ${buttonHtml}
                </div>

            </div>

        </div>

    </div>
`;
  } catch (error) {
    productDetail.innerHTML = "";
    console.log("خطا در دریافت محصولات", error);
  }
}
getProduct();



productDetail.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-add")) {
    const productId = e.target.dataset.id;
    //اینجا توی لوکال استویج کم و زیادش میکنه
    addToCart(productId);
    localStorage.setItem("cart", JSON.stringify(cart));

    // اینجا توی ظاهر اضافش میکنه اگه برای بار اول باشه
    const cartbox = e.target.parentElement;
    cartbox.innerHTML = `
      <button class="minus ms-2" data-id = "${productId}">-</button>
      <span class="count">1</span>
      <button class="plus me-2" data-id = "${productId}">+</button>
    `;
    updateShoppingCardIcon();
  }
  if (e.target.classList.contains("plus")) {
    const productId = e.target.dataset.id;
    const Product = cart.find(function (item) {
      return item.id == productId;
    });
    if (!Product) {
      return;
    }
    Product.count++;
    updateShoppingCardIcon();
    localStorage.setItem("cart", JSON.stringify(cart));
    const count = e.target.previousElementSibling;
    count.innerText = Product.count;
    const totalPrice = Product.price * Product.count;
    const priceElement = e.target
      .closest(".mount-info")
      .querySelector(".price");
    priceElement.innerText = totalPrice;
  }

  if (e.target.classList.contains("minus")) {
    const productId = e.target.dataset.id;
    const Product = cart.find(function (item) {
      return item.id == productId;
    });
    if (!Product) {
      return;
    }

    if (Product.count > 1) {
      Product.count--;

      const totalPrice = Product.price * Product.count;
      const priceElement = e.target
        .closest(".mount-info")
        .querySelector(".price");
      priceElement.innerText = totalPrice;
      updateShoppingCardIcon();
      localStorage.setItem("cart", JSON.stringify(cart));
      const count = e.target.nextElementSibling;
      count.innerText = Product.count;
    } else {
      cart = cart.filter(function (item) {
        return item.id != productId;
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      e.target.parentElement.innerHTML = `
        <div class="ms-auto">
        <button type="button" class="btn btn-secondary btn-add" data-id = ${productId}>افزودن</button>
        </div>
      `;
      updateShoppingCardIcon();
    }
  }
});
function addToCart(productId) {
  let existProduct = cart.find((item) => item.id == productId);

  if (existProduct) {
    existProduct.count++;
  } else {
    cart.push({
      ...currentProduct,
      count: 1,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}
