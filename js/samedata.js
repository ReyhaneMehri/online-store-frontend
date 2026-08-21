
const cartBadge = document.querySelectorAll(".cart-badge");
function updateShoppingCardIcon(){
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if(!cartBadge) return;
  const cartCount = cart.reduce(function(total,item){
    return total + item.count;
  },0);
  cartBadge.forEach(function(badge){
    badge.textContent = cartCount;
  });
  
  
}
updateShoppingCardIcon();
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll("nav a").forEach(function (link) {
  const linkPage = link.getAttribute("href")?.split("/").pop();

  if (linkPage === currentPage) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});