async function fetchCartData() {
    const apiUrl = 'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889';
    try {
      const response = await fetch(apiUrl);
      const cartData = await response.json();
      renderCartItems(cartData);
      calculateTotals(cartData);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }
  
  function renderCartItems(cartData) {
    const cartTableBody = document.querySelector('.cart-items tbody');
    cartTableBody.innerHTML = '';
  
    cartData.items.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="product-info">
          <img src="${item.image}" alt="${item.title}">
          <span>${item.title}</span>
        </td>
        <td>Rs. ${item.price.toLocaleString()}</td>
        <td>
          <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
        </td>
        <td class="subtotal">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
        <td>
          <span class="remove-item" data-id="${item.id}">🗑️</span>
        </td>
      `;
      cartTableBody.appendChild(row);
    });
  
    attachEventListeners(cartData);
  }
  
  function attachEventListeners(cartData) {
    const quantityInputs = document.querySelectorAll('.cart-items input[type="number"]');
    const removeButtons = document.querySelectorAll('.remove-item');
  
    quantityInputs.forEach(input => {
      input.addEventListener('change', (e) => handleQuantityChange(e, cartData));
    });
  
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => handleRemoveItem(e, cartData));
    });
  }
  
  function handleQuantityChange(event, cartData) {
    const itemId = parseInt(event.target.dataset.id, 10);
    const newQuantity = parseInt(event.target.value, 10);
  
    const item = cartData.items.find(item => item.id === itemId);
    if (item) {
      item.quantity = newQuantity > 0 ? newQuantity : 1;
      renderCartItems(cartData);
      calculateTotals(cartData);
    }
  }
  
  function handleRemoveItem(event, cartData) {
    const itemId = parseInt(event.target.dataset.id, 10);
    cartData.items = cartData.items.filter(item => item.id !== itemId);
  
    renderCartItems(cartData);
    calculateTotals(cartData);
  }
  
  function calculateTotals(cartData) {
    const subtotal = cartData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal;
  
    document.getElementById('subtotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
    document.getElementById('total').textContent = `Rs. ${total.toLocaleString()}`;
  }
  
  document.getElementById('checkout-btn').addEventListener('click', () => {
    alert("Proceeding to checkout...");
  });

  fetchCartData();