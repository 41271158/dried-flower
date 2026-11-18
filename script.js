"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const backToTop = document.querySelector(".back-to-top");
const toast = document.querySelector(".toast");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItemsElement = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartTotal = document.querySelector(".cart-total strong");
const cartCounts = document.querySelectorAll(".cart-count");
const cart = new Map();
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function updateCart() {
  const count = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0);
  cartCounts.forEach((element) => { element.textContent = String(count); });
  cartItemsElement.replaceChildren();

  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
    const row = document.createElement("div");
    row.className = "cart-line";

    const details = document.createElement("div");
    const name = document.createElement("div");
    name.className = "cart-line-name";
    name.textContent = item.name;
    const quantity = document.createElement("div");
    quantity.className = "cart-line-detail";
    quantity.textContent = `數量 ${item.quantity}`;
    details.append(name, quantity);

    const price = document.createElement("strong");
    price.textContent = `NT$ ${(item.price * item.quantity).toLocaleString("zh-TW")}`;
    row.append(details, price);
    cartItemsElement.append(row);
  });

  cartTotal.textContent = `NT$ ${total.toLocaleString("zh-TW")}`;
  cartEmpty.classList.toggle("visible", count === 0);
}

function openCart() {
  cartOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  cartOverlay.querySelector(".cart-close").focus();
}

function closeCart() {
  cartOverlay.hidden = true;
  document.body.style.overflow = "";
  document.querySelector(".header-cart").focus();
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "開啟導覽選單" : "關閉導覽選單");
  primaryNav.classList.toggle("open", !isExpanded);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "開啟導覽選單");
    primaryNav.classList.remove("open");
  });
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const answer = document.getElementById(button.getAttribute("aria-controls"));
    button.setAttribute("aria-expanded", String(!isExpanded));
    answer.hidden = isExpanded;
  });
});

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.product;
    const price = Number(button.dataset.price);
    if (!name || !Number.isFinite(price) || price <= 0) {
      showToast("商品資訊暫時無法讀取，請稍後再試。");
      return;
    }

    const item = cart.get(name) || { name, price, quantity: 0 };
    item.quantity += 1;
    cart.set(name, item);
    updateCart();

    button.classList.add("added");
    button.innerHTML = "已加入購物袋 <span aria-hidden=\"true\">✓</span>";
    window.setTimeout(() => {
      button.classList.remove("added");
      button.innerHTML = "加入購物袋 <span aria-hidden=\"true\">＋</span>";
    }, 1400);
    showToast(`${name} 已加入購物袋（前端示意）`);
  });
});

document.querySelector(".header-cart").addEventListener("click", openCart);
document.querySelector(".cart-close").addEventListener("click", closeCart);
document.querySelector(".cart-checkout").addEventListener("click", () => {
  closeCart();
  showToast("這是前端示意頁，尚未建立訂單或收取款項。");
});
cartOverlay.addEventListener("click", (event) => {
  if (event.target === cartOverlay) closeCart();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cartOverlay.hidden) closeCart();
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 500);
}, { passive: true });

document.querySelectorAll(".image-frame img").forEach((image) => {
  image.addEventListener("error", () => {
    image.closest(".image-frame").classList.add("image-fallback");
  }, { once: true });
});

document.getElementById("current-year").textContent = String(new Date().getFullYear());
updateCart();
