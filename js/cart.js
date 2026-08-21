let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartContainer = document.querySelector("#container-cart");

function renderCart() {
  cartContainer.innerHTML = "";
  const totalPrice = cart.reduce(function(total,item){
    return total + Math.round(item.price * item.count);
  },0);
  document.querySelector("#subtotal").textContent = `$${totalPrice}`;
  const discount = 10;
  const finalPrice = totalPrice - discount;

  document.querySelector("#discount").textContent = `$${discount}`;
  document.querySelector("#total-price").textContent = `$${finalPrice}`;
  document.querySelector("#subtotal-mobile").textContent = `$${totalPrice}`;
  document.querySelector("#total-price-mobile").textContent = `$${finalPrice}`;

  
  if(cart.length > 0){
    cart.forEach(function (item) {
    cartContainer.innerHTML += `
    <div class="card cart-shopping-list">
  <img src="${item.image}" class="card-img-top card-img-shopping" alt="...">
  <div class="card-body">
    <p class="card-text">${item.title}</p>
    <span class="price">${item.price}</span> 
                <div class="float-start">    
                ${
                  item.count === 1
                    ? `<button class="delete ms-2" data-id = "${item.id}"><i class="fa-solid fa-trash-can delete" data-id = "${item.id}"></i></button>`
                    : `<button class="minus ms-2" data-id = "${item.id}">-</button>`
                }
      <span class="count">${item.count}</span>
    <button class="plus me-2" data-id = "${item.id}">+</button>
    
      </div>
    </div>
</div>
        
        `;
  });
  }else{
    cartContainer.innerHTML =`
    <div class="empty">
    <p>سبد خرید خالی است🛒</p>
    </div>
    `;
  }
}
renderCart();

cartContainer.addEventListener("click", function (e) {
  const productId = e.target.dataset.id;
  const product = cart.find((item) => item.id == productId);
  if (e.target.classList.contains("plus") && product) {
    product.count++;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateShoppingCardIcon();
  }

  if (e.target.classList.contains("minus") && product) {
    if (product.count > 1) {
      product.count--;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateShoppingCardIcon();
    }
  }

  if (e.target.classList.contains("delete") && product) {
    cart = cart.filter((item) => item.id != productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateShoppingCardIcon();

  }
});
