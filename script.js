// Slider (Eğer varsa, yoksa bu kısmı kaldırabilirsin)
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let slideInterval;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
}

function startSlideShow() {
  slideInterval = setInterval(() => {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }, 5000);
}

function stopSlideShow() {
  clearInterval(slideInterval);
}

if (document.querySelector('.slider')) {
  document.querySelector('.slider').addEventListener('mouseenter', stopSlideShow);
  document.querySelector('.slider').addEventListener('mouseleave', startSlideShow);

  prev.addEventListener('click', () => {
    stopSlideShow();
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
    startSlideShow();
  });

  next.addEventListener('click', () => {
    stopSlideShow();
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
    startSlideShow();
  });

  showSlide(slideIndex);
  startSlideShow();
}

// Sepet işlemleri
let cart = [];

function addToCart(name, price, imageUrl) {
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name, price, imageUrl });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Ürün sepete eklendi!');
    updateCartDisplay();
  } catch (error) {
    console.error('Sepete ekleme hatası:', error);
    alert('Ürün sepete eklenirken bir hata oluştu.');
  }
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const total = document.getElementById('total');

  if (!cartItems || !total) return;

  cartItems.innerHTML = '';
  let sum = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<li>Sepetiniz boş.</li>';
    total.textContent = 'Toplam: 0 TL';
    return;
  }

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add('cart-item');
    li.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-img" />
      <div class="cart-item-info">
        <span>${item.name}</span>
        <span>${item.price.toFixed(2)} TL</span>
      </div>
      <button onclick="removeFromCart(${index})" class="remove-btn" aria-label="Ürünü sepetten kaldır">
        <i class="fas fa-trash"></i>
      </button>
    `;
    cartItems.appendChild(li);
    sum += item.price;
  });

  total.textContent = `Toplam: ${sum.toFixed(2)} TL`;
}

function removeFromCart(index) {
  try {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
  } catch (error) {
    console.error('Sepetten ürün silme hatası:', error);
    alert('Ürün sepetten silinirken bir hata oluştu.');
  }
}

// Sayfa yüklendiğinde butonlara tıklayınca fotoğraf da alınacak şekilde düzenle
window.onload = function () {
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();

    const productButtons = document.querySelectorAll('.product-card button');
    productButtons.forEach(button => {
      button.addEventListener('click', function () {
        const card = this.closest('.product-card');
        const name = card.querySelector('h3').textContent;
        const price = parseFloat(card.querySelector('p').textContent.replace('₺', '').replace(',', '.'));
        const imageUrl = card.querySelector('img').src;
        addToCart(name, price, imageUrl);
      });
    });
  } catch (error) {
    console.error('Sayfa yükleme hatası:', error);
  }
};

// Arama fonksiyonu
document.querySelector('.search-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const searchTerm = this.querySelector('input').value.toLowerCase().trim();

  if (!searchTerm) {
    alert('Lütfen bir arama terimi girin.');
    return;
  }

  const products = document.querySelectorAll('.product-card');
  let found = false;

  products.forEach(product => {
    const productName = product.querySelector('h3').textContent.toLowerCase();
    const productPrice = product.querySelector('p').textContent.toLowerCase();

    if (productName.includes(searchTerm) || productPrice.includes(searchTerm)) {
      product.style.display = 'block';
      found = true;
      product.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      product.style.display = 'none';
    }
  });

  if (!found) {
    alert('Aradığınız kriterlere uygun ürün bulunamadı.');
    products.forEach(product => (product.style.display = 'block'));
  }
});

document.querySelector('.search-form input')?.addEventListener('input', function () {
  if (!this.value.trim()) {
    document.querySelectorAll('.product-card').forEach(product => {
      product.style.display = 'block';
    });
  }
});
