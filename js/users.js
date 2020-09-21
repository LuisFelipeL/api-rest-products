const formSignup = document.getElementById("form-signup");
const formSignin = document.getElementById("form-signin");
const urlGlobal = "https://api-rest-pro.herokuapp.com/api/users";

function postData(url = "", bodyContent = {}) {
  fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(bodyContent), // body data type must match "Content-Type" header
  })
    .then((res) => {
      if (res.status !== 200) {
        console.log("Hay problema. Status code: " + res.status);
        return;
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      localStorage.setItem("token", data.token);
      location.reload();
    })
    .catch((err) => console.log(err));
}

formSignup.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(formSignup);
  const bodyContent = {
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  postData(urlGlobal + "/signup", bodyContent);
});

formSignin.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(formSignin);
  const bodyContent = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  postData(urlGlobal + "/signin", bodyContent);
});

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token")) {
    const btnSignup = document.getElementById("btn-signup");
    const btnSignin = document.getElementById("btn-signin");
    const btnLogout = document.getElementById("btn-logout");
    const btnProducts = document.getElementById("btn-products");

    btnSignup.classList.toggle("d-none");
    btnSignin.classList.toggle("d-none");
    btnLogout.classList.toggle("d-none");
    btnProducts.classList.toggle("d-none");

    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("token");
      location.reload();
    });
  }
});
