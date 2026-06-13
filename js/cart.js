import { 
  getCart, addToCart, removeFromCart, 
  increaseQuantity, decreaseQuantity, clearCart, getCartTotal 
} from './api.js';

const CURRENT_CUSTOMER_ID = localStorage.getItem('userId');
const R2_URL = 'https://pub-c966a90ea96443f98cb7bede2669eb6f.r2.dev/';

const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartBadge = document.getElementById('cart-badge');
const clearCartBtn = document.getElementById('clear-cart-btn');
const productsGrid = document.getElementById('products-grid');

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  updateCartUI();
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}

cartToggleBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

async function updateCartUI() {
  try {
    const [cart, totalData] = await Promise.all([
      getCart(CURRENT_CUSTOMER_ID),
      getCartTotal(CURRENT_CUSTOMER_ID)
    ]);

    cartItemsContainer.innerHTML = '';
    
    const totalItemsCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    cartBadge.innerText = totalItemsCount;

    if (!cart.items || cart.items.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-text">კალათა ცარიელია</p>';
      cartTotalPrice.innerText = '0.00 ₾';
      return;
    }

    cart.items.forEach(item => {
        const productInfo = item.product || {};
        const productName = productInfo.name || 'უსახელო პროდუქტი';
        const productPrice = typeof productInfo.price === 'number' ? productInfo.price : 0;
        
        const imgPath = productInfo.imagePath 
            ? `${R2_URL}${productInfo.imagePath.replace(/^\//, '')}` 
            : 'https://via.placeholder.com/60';
        
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';
        itemRow.innerHTML = `
            <img src="${imgPath}" alt="${productName}">
            <div class="cart-item-details">
            <h4>${productName}</h4>
            <p class="cart-item-price">${productPrice.toFixed(2)} ₾</p>
            <div class="cart-quantity-controls">
                <button class="qty-btn btn-minus" data-id="${item.productId || productInfo.id}">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn btn-plus" data-id="${item.productId || productInfo.id}">+</button>
            </div>
            </div>
            <button class="btn-remove-item" data-id="${item.productId || productInfo.id}">&times;</button>
        `;
        cartItemsContainer.appendChild(itemRow);
    });

    const total = typeof totalData === 'number' ? totalData : (totalData.total || 0);
    cartTotalPrice.innerText = `${total.toFixed(2)} ₾`;

  } catch (error) {
    console.error('კალათის განახლება ჩავარდა:', error);
  }
}

productsGrid.addEventListener('click', async (e) => {
  if (!e.target.classList.contains('btn-add-to-cart')) return;

  const btn = e.target;
  const productId = btn.getAttribute('data-id');

  try {
    btn.disabled = true;
    const originalText = btn.innerText;
    btn.innerText = 'ემატება...';

    await addToCart(CURRENT_CUSTOMER_ID, productId);

    btn.innerText = '✓ დამატებულია';
    btn.style.backgroundColor = '#2e7d32';

    await updateCartUI();
    openCart();

    setTimeout(() => {
      btn.disabled = false;
      btn.innerText = originalText;
      btn.style.backgroundColor = '';
    }, 1200);

  } catch (error) {
    alert('კალათაში დამატება ვერ მოხერხდა.');
    btn.disabled = false;
    btn.innerText = 'კალათაში დამატება';
  }
});

cartItemsContainer.addEventListener('click', async (e) => {
  const target = e.target;
  const productId = target.getAttribute('data-id');
  if (!productId) return;

  try {
    if (target.classList.contains('btn-plus')) {
      await increaseQuantity(CURRENT_CUSTOMER_ID, productId);
    } 
    else if (target.classList.contains('btn-minus')) {
      const currentQty = parseInt(target.nextElementSibling.innerText);
      if (currentQty > 1) {
        await decreaseQuantity(CURRENT_CUSTOMER_ID, productId);
      } else {
        await removeFromCart(CURRENT_CUSTOMER_ID, productId);
      }
    } 
    else if (target.classList.contains('btn-remove-item')) {
      await removeFromCart(CURRENT_CUSTOMER_ID, productId);
    }
    
    updateCartUI();

  } catch (error) {
    console.error('კალათის ოპერაცია ჩავარდა:', error);
  }
});

clearCartBtn.addEventListener('click', async () => {
  if (!confirm('ნამდვილად გსურთ კალათის მთლიანად გასუფთავება?')) return;
  try {
    await clearCart(CURRENT_CUSTOMER_ID);
    updateCartUI();
  } catch (error) {
    alert('კალათის გასუფთავება ვერ მოხერხდა.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
});