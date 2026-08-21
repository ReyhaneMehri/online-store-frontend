
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