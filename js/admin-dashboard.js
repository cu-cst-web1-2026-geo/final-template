import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  updateProductPrice,
  updateProductImage
} from './api.js';

const isAdmin = document.cookie.split('; ').some(row => row.startsWith('isAdmin=true'));
if (!isAdmin) {
  window.location.replace('admin-login.html');
}

const R2_BASE_Path = 'https://pub-c966a90ea96443f98cb7bede2669eb6f.r2.dev/';
const adminGreeting = document.getElementById('admin-greeting');
const btnAdminLogout = document.getElementById('btn-admin-logout');

const sidebarButtons = document.querySelectorAll('.sidebar-btn');
const tabContents = document.querySelectorAll('.tab-content');

const categoryForm = document.getElementById('category-form');
const categoryIdInput = document.getElementById('category-id');
const catNameInput = document.getElementById('cat-name');
const categoriesTableBody = document.getElementById('categories-table-body');

const productForm = document.getElementById('product-form');
const productIdInput = document.getElementById('product-id');
const prodNameInput = document.getElementById('prod-name');
const prodDescInput = document.getElementById('prod-description');
const prodPriceInput = document.getElementById('prod-price');
const prodStockInput = document.getElementById('prod-stock');
const prodCategorySelect = document.getElementById('prod-category');
const prodImageInput = document.getElementById('prod-image');
const productsTableBody = document.getElementById('products-table-body');

sidebarButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sidebarButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.remove('active'));

    btn.classList.add('active');
    const targetTab = btn.getAttribute('data-tab');
    document.getElementById(targetTab).classList.add('active');
  });
});

async function renderCategories() {
  try {
    const categories = await getAllCategories();
    
    categoriesTableBody.innerHTML = '';
    prodCategorySelect.innerHTML = '<option value="">აირჩიეთ კატეგორია</option>';

    if (categories.length === 0) {
      categoriesTableBody.innerHTML = '<tr><td colspan="3" class="text-center">კატეგორიები არ მოიძებნა.</td></tr>';
      return;
    }

    categories.forEach(cat => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cat.id}</td>
        <td><strong>${cat.name}</strong></td>
        <td>
          <div class="actions-cell">
            <button class="btn-action btn-edit edit-cat-btn" data-id="${cat.id}" data-name="${cat.name}">შეცვლა ✏️</button>
            <button class="btn-action btn-delete delete-cat-btn" data-id="${cat.id}">წაშლა 🗑️</button>
          </div>
        </td>
      `;
      categoriesTableBody.appendChild(tr);

      const option = document.createElement('option');
      option.value = cat.id;
      option.innerText = cat.name;
      prodCategorySelect.appendChild(option);
    });
  } catch (error) {
    categoriesTableBody.innerHTML = `<tr><td colspan="3" class="text-center" style="color:red;">${error.message}</td></tr>`;
  }
}

categoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const catId = categoryIdInput.value;
  const catName = catNameInput.value.trim();

  try {
    if (catId) {
      await updateCategory(catId, { name: catName });
      alert('კატეგორია წარმატებით განახლდა!');
    } else {
      await createCategory({ name: catName });
      alert('კატეგორია წარმატებით დაემატა!');
    }
    categoryForm.reset();
    categoryIdInput.value = '';
    categoryForm.querySelector('.btn-dash-submit').innerText = 'კატეგორიის შენახვა';
    await renderCategories();
  } catch (error) {
    alert(error.message);
  }
});

categoriesTableBody.addEventListener('click', async (e) => {
  if (e.target.classList.contains('edit-cat-btn')) {
    const id = e.target.getAttribute('data-id');
    const name = e.target.getAttribute('data-name');
    
    categoryIdInput.value = id;
    catNameInput.value = name;
    categoryForm.querySelector('.btn-dash-submit').innerText = 'კატეგორიის განახლება 🔄';
    catNameInput.focus();
  }

  if (e.target.classList.contains('delete-cat-btn')) {
    const id = e.target.getAttribute('data-id');
    if (confirm(`ნამდვილად გსურთ კატეგორიის (ID: ${id}) წაშლა?`)) {
      try {
        await deleteCategory(id);
        alert('კატეგორია წაიშალა!');
        await renderCategories();
        await renderProducts();
      } catch (error) {
        alert(error.message);
      }
    }
  }
});

async function renderProducts() {
  try {
    const products = await getAllProducts();
    productsTableBody.innerHTML = '';

    if (products.length === 0) {
      productsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">პროდუქტები არ მოიძებნა.</td></tr>';
      return;
    }

    products.reverse().forEach(prod => {
        let imagePath = '';
        if (prod.imagePath) {
            const cleanRelativePath = prod.imagePath.startsWith('/') 
                ? prod.imagePath.slice(1) 
                : prod.imagePath;
            
            imagePath = `${R2_BASE_Path}${cleanRelativePath}`;
        }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${prod.id}</td>
        <td>
          <img src="${imagePath || 'https://via.placeholder.com/45'}" class="table-prod-img" alt="${prod.name}">
        </td>
        <td><strong>${prod.name}</strong><br><small style="color:#777">${prod.description || ''}</small></td>
        <td>
          <span class="view-price">${prod.price.toFixed(2)} ₾</span>
          <button class="btn-action inline-patch-price" data-id="${prod.id}" data-current="${prod.price}" style="font-size:10px;">⚡</button>
        </td>
        <td>
          <span class="view-stock">${prod.stock} ც.</span>
          <button class="btn-action inline-patch-stock" data-id="${prod.id}" data-current="${prod.stock}" style="font-size:10px;">⚡</button>
        </td>
        <td>
          <div class="actions-cell">
            <button class="btn-action btn-edit edit-prod-btn" 
                    data-id="${prod.id}" 
                    data-name="${prod.name}" 
                    data-desc="${prod.description || ''}">ძირითადის შეცვლა ✏️</button>
            <button class="btn-action inline-patch-image" data-id="${prod.id}">სურათი 📷</button>
            <button class="btn-action btn-delete delete-prod-btn" data-id="${prod.id}">წაშლა 🗑️</button>
          </div>
        </td>
      `;
      productsTableBody.appendChild(tr);
    });
  } catch (error) {
    productsTableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:red;">${error.message}</td></tr>`;
  }
}

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const prodId = productIdInput.value;

  try {
    if (prodId) {
      const updateData = {
        name: prodNameInput.value.trim(),
        description: prodDescInput.value.trim()
      };
      await updateProduct(prodId, updateData);
      alert('პროდუქტის ძირითადი მონაცემები განახლდა! (ფასი/მარაგი/სურათი ცალკე იცვლება)');
    } else {
      const formData = new FormData();
      formData.append('Name', prodNameInput.value.trim());
      formData.append('Description', prodDescInput.value.trim());
      formData.append('Price', prodPriceInput.value);
      formData.append('Stock', prodStockInput.value);
      formData.append('CategoryId', prodCategorySelect.value);
      
      if (prodImageInput.files) {
        formData.append('ImageFile', prodImageInput.files[0]);
      } else {
        alert('პროდუქტის შესაქმნელად სურათის ატვირთვა აუცილებელია!');
        return;
      }

      await createProduct(formData);
      alert('ახალი პროდუქტი წარმატებით შეიქმნა!');
    }

    productForm.reset();
    productIdInput.value = '';
    prodPriceInput.disabled = false;
    prodStockInput.disabled = false;
    prodCategorySelect.disabled = false;
    prodImageInput.required = true;
    productForm.querySelector('.btn-dash-submit').innerText = 'პროდუქტის შენახვა';
    
    await renderProducts();
  } catch (error) {
    alert(error.message);
  }
});

productsTableBody.addEventListener('click', async (e) => {
  const id = e.target.getAttribute('data-id');

  if (e.target.classList.contains('delete-prod-btn')) {
    if (confirm(`ნამდვილად გსურთ პროდუქტის (ID: ${id}) წაშლა?`)) {
      try {
        await deleteProduct(id);
        alert('პროდუქტი წაიშალა!');
        await renderProducts();
      } catch (error) {
        alert(error.message);
      }
    }
  }

  if (e.target.classList.contains('edit-prod-btn')) {
    productIdInput.value = id;
    prodNameInput.value = e.target.getAttribute('data-name');
    prodDescInput.value = e.target.getAttribute('data-desc');
    
    prodPriceInput.disabled = true;
    prodStockInput.disabled = true;
    prodCategorySelect.disabled = true;
    prodImageInput.required = false;

    productForm.querySelector('.btn-dash-submit').innerText = 'მხოლოდ სახელის/აღწერის განახლება 🔄';
    prodNameInput.focus();
  }

  if (e.target.classList.contains('inline-patch-price')) {
    const currentPrice = e.target.getAttribute('data-current');
    const newPrice = prompt(`მიუთითეთ ახალი ფასი პროდუქტისთვის #${id}:`, currentPrice);
    if (newPrice !== null && newPrice.trim() !== "" && !isNaN(newPrice)) {
      try {
        await updateProductPrice(id, parseFloat(newPrice));
        alert('ფასი განახლდა!');
        await renderProducts();
      } catch (error) {
        alert(error.message);
      }
    }
  }

  if (e.target.classList.contains('inline-patch-stock')) {
    const currentStock = e.target.getAttribute('data-current');
    const newStock = prompt(`მიუთითეთ ახალი მარაგი პროდუქტისთვის #${id}:`, currentStock);
    if (newStock !== null && newStock.trim() !== "" && !isNaN(newStock)) {
      try {
        await updateProductStock(id, parseInt(newStock));
        alert('მარაგი განახლდა!');
        await renderProducts();
      } catch (error) {
        alert(error.message);
      }
    }
  }

  if (e.target.classList.contains('inline-patch-image')) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = async () => {
      if (fileInput.files) {
        try {
          const imgFormData = new FormData();
          imgFormData.append('imageFile', fileInput.files[0]);
          
          await updateProductImage(id, imgFormData);
          alert('პროდუქტის სურათი წარმატებით შეიცვალა! 📷');
          await renderProducts();
        } catch (error) {
          alert(error.message);
        }
      }
    };
    fileInput.click();
  }
});

if (btnAdminLogout) {
  btnAdminLogout.addEventListener('click', () => {
    document.cookie = "isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminToken');
    window.location.replace('admin-login.html');
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const adminName = localStorage.getItem('adminUser') || 'ადმინისტრატორი';
  if (adminGreeting) {
    adminGreeting.innerText = `👋 მოგესალმებით, ${adminName}`;
  }

  await renderCategories();
  await renderProducts();
});