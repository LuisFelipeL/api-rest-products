const formAddProduct = document.getElementById("form-add-product");
const formEditProduct = document.getElementById("form-edit-product");
const bodyTable = document.getElementById("body-table");
const btnLogout = document.getElementById("btn-logout");
const urlGlobal = "https://api-rest-pro.herokuapp.com/api/products";

// ------------- Funciones para peticiones HTTP -------------
// Función para peticiones GET
function getData(url = "") {
  fetch(url, {
    headers: {
      authorization: localStorage.getItem("token"),
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        console.log("Hay problema. Status code: " + res.status);
        return;
      }
      return res.json();
    })
    .then((data) => {
      createTable(data.products);
    })
    .catch((err) => console.log(err));
}
// Función para peticiones POST, PUT, DELETE
function sendData(method = "", url = "", bodyContent = {}) {
  fetch(url, {
    method: method, // *GET, POST, PUT, DELETE, etc.
    headers: {
      authorization: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
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
      getData(urlGlobal);
    })
    .catch((err) => console.log(err));
}

// ------------- Funciones para trabajar con el DOM -------------
// Recarga la tabla realizando una petición nuevamente
function createTable(products) {
  bodyTable.textContent = "";
  const docFrag = document.createDocumentFragment();
  let html = ``;
  products.forEach((product) => {
    const tr = document.createElement("tr");
    html = `
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.price}</td>
        <td>${product.description || "No hay descripción"}</td>
        <td class="text-center">
          <button type="button" class="btn btn-danger delete-product" id="${
            product._id
          }">
            <i class="fas fa-trash"></i>
          </button>
        </td>
        `;
    tr.innerHTML = html;
    docFrag.appendChild(tr);
  });
  bodyTable.appendChild(docFrag);

  addDeleteEventsBtns();
}
// Añade los eventos a los botones de eliminar producto
function addDeleteEventsBtns() {
  const deleteProduct = document.querySelectorAll(".delete-product");
  deleteProduct.forEach((del) => {
    del.addEventListener("click", (e) => {
      const id = e.target.id;
      sendData("DELETE", urlGlobal + `/${id}`);
    });
  });
}
// Elimina el token almacenado en el localstorage
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
});

// ------------- Funciones para añadir eventos a los formularios -------------
// Crea el objeto productos mediante el formulario y los envia por POST
formAddProduct.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(formAddProduct);
  const bodyContent = {
    name: formData.get("name"),
    price: formData.get("price"),
    category: formData.get("category"),
    description: formData.get("description"),
  };
  sendData("POST", urlGlobal, bodyContent);
  $("#addProductModal").modal("hide");
});

// ------------- Otras funciones -------------
// Inicializa la tabla cuando se carga la pagina
document.addEventListener("DOMContentLoaded", () => {
  getData(urlGlobal);
});
