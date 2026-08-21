const wrapper = document.querySelector(".wrapper");
const registerBtn = document.querySelector(".register-btn");
registerBtn.addEventListener("click", () => {
  wrapper.classList.add("active");
});
const loginBtn = document.querySelector(".login-btn");
loginBtn.addEventListener("click", function () {
  wrapper.classList.remove("active");
});
let users = JSON.parse(localStorage.getItem("users")) || [];
const registerForm = document.querySelector("#register-form");
const message = document.querySelector("#message");

function validEmail(email){
  const existEmail = users.some(item=>item.email === email);
  if(existEmail){
    return false;
  }else{
    return true;
  }
};
function validPass(password){
if(password === ""){
  return "رمز را وارد کنید";
}if(password.length < 5){
   return "طول رمز نباید کمتر از 5 باشد";
}
return true;
};

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!registerForm.checkValidity()) {
    e.stopPropagation();
    registerForm.classList.add("was-validated");
    return;
  };
    const user = {
      email: registerForm.email.value,
      password: registerForm.password.value,
    };
    const passResult = validPass(user.password);
    if(passResult !== true){
    message.innerHTML = `
   <div class="alert alert-success" role="alert">${passResult}</div>
    `;
    return;
    };
    if(validEmail(user.email)){
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
          message.innerHTML = `
   <div class="alert alert-success" role="alert">ثبت نام موفق شد</div>
    `;
    registerForm.reset();
    registerForm.classList.remove("was-validated");
    }else{
      message.innerHTML = `
   <div class="alert alert-success" role="alert">قبلا ثبت نام کرددی</div>
    `;
    }
});


const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#message-login");
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!loginForm.checkValidity()) {
    e.stopPropagation();
    loginForm.classList.add("was-validated");
  } else {
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const findEmail = users.find(function (item) {
      return item.email === email;
    });
    const findUser = users.find(function (item) {
      return item.email === email && item.password === password;
    });    
    if (!findEmail) {
      loginMessage.innerHTML += `<div class="alert alert-primary">هنوز ثبت نام نکردی</div>`;
    } else if (findEmail.password !== password) {
      loginMessage.innerHTML += `
      <div class="alert alert-danger">رمزت اشتباهه</div>
      `;
    } else {
      loginMessage.innerHTML += `
      <div class="alert alert-success">موفقانه اومدی تو</div>
      `;
      loginForm.reset();
      loginForm.classList.remove("was-validated");
    }
  }
});

 
// بایذ کاری کنیم که توی شرط بره بگرده و پیدا کنه ببینه کدوم یوزر و پسورد هستن شبیه اونی که کتاربر داده اگه یوزر و پس مثل اون بود که وارد میشه
// اگر که فقط یوزر بود و پس اشتباه بود بگه باید رمز رو درست بزنی اگر که کلا وجود نداشت بگه کلا نیست اصن
