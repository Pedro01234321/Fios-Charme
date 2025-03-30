let cart = [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    let savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function addToCart(productName, productPrice) {
    const product = { name: productName, price: productPrice };
    cart.push(product);
    alert(productName + " foi adicionado ao carrinho!");
    saveCart();
    updateCart();
}

function updateCart() {
    let cartItems = "";
    let total = 0;
    let totalItems = cart.length;

    cart.forEach(item => {
        cartItems += `<p>${item.name} - R$ ${item.price.toFixed(2)}</p>`;
        total += item.price;
    });

    cartItems += `<br><strong>Total de Itens: ${totalItems}</strong>`;
    cartItems += `<br><strong>Total a Pagar: R$ ${total.toFixed(2)}</strong>`;

    let cartElement = document.getElementById("cart");
    if (cartElement) {
        cartElement.innerHTML = cartItems;
    }

    let checkoutCartElement = document.getElementById("checkout-cart");
    if (checkoutCartElement) {
        checkoutCartElement.innerHTML = cartItems;
    }

    saveCart();
}

document.addEventListener("DOMContentLoaded", function () {
    loadCart();
    updateCart();

    const buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const productName = this.getAttribute("data-name");
            const productPrice = parseFloat(this.getAttribute("data-price"));
            addToCart(productName, productPrice);
        });
    });

    if (document.getElementById("checkoutForm")) {
        document.getElementById("checkoutForm").addEventListener("submit", function (event) {
            event.preventDefault();
            processOrder();
        });
    }
});

function processOrder() {
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let email = document.getElementById("email").value;

    if (name === "" || address === "" || email === "") {
        alert("Por favor, preencha todos os campos para finalizar a compra.");
        return;
    }

    alert("Compra finalizada com sucesso!");
    localStorage.removeItem("cart"); // Limpa o carrinho após a compra
    window.location.href = "confirmacao.html"; // Redireciona para a página de confirmação
}