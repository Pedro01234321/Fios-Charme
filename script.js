document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

function addToCart(productName, productPrice) {
    let existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    saveCart();
    updateCart();
    alert(productName + " foi adicionado ao carrinho!");
}

function updateCart() {
    let cartItems = "";
    let total = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {
        totalItems += item.quantity;
        total += item.price * item.quantity;

        cartItems += `<p>${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity} 
            <button class="remove-item" data-index="${index}">Remover 1</button>
        </p>`;
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
    addRemoveListeners();
}

function addRemoveListeners() {
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");

            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }

            saveCart();
            updateCart();
        });
    });
}

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const productName = this.getAttribute("data-name");
            const productPrice = parseFloat(this.getAttribute("data-price"));
            addToCart(productName, productPrice);
        });
    });

    if (document.getElementById("checkoutForm")) {
        document.getElementById("checkoutForm").addEventListener("submit", function (event) {
            event.preventDefault();
            let name = document.getElementById("name").value;
            let address = document.getElementById("address").value;
            let email = document.getElementById("email").value;

            if (name === "" || address === "" || email === "") {
                alert("Preencha todos os campos!");
                return;
            }

            alert("Compra finalizada com sucesso!");
            localStorage.removeItem("cart");
            window.location.href = "confirmacao.html";
        });
    }

    updateCart();
});
document.getElementById("feedbackForm").addEventListener("submit", function (event) {
    event.preventDefault();
    let name = document.getElementById("name").value;
    let message = document.getElementById("message").value;

    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    feedbacks.push({ name: name, message: message });
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

    document.getElementById("feedbackMessage").innerText = "Obrigado pelo feedback!";
});
const mp = new MercadoPago("SUA_PUBLIC_KEY", {
    locale: "pt-BR"
});

document.getElementById("mercadoPagoButton").addEventListener("click", function() {
    fetch("/process_payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            transaction_amount: 50,
            payment_method_id: "pix",
            payer: {
                email: "cliente@email.com"
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = data.init_point;
    })
    .catch(error => console.error("Erro:", error));
});