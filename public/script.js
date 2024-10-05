const menuDiv = document.getElementById('menu');
const itemSelect = document.getElementById('item');
const orderItemsDiv = document.getElementById('orderItems');
const orderForm = document.getElementById('orderForm');
let orderItems = [];

// Fetch menu items
fetch('/menu')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.innerHTML = `
                <img src="${item.image_url}" alt="${item.name}" style="width: 100px; height: auto;">
                <strong>${item.name}</strong> - $${item.price} (${item.available_quantity} available)
            `;
            menuDiv.appendChild(menuItem);

            // Populate select options
            const option = document.createElement('option');
            option.value = item.id; // Set value to item ID
            option.textContent = `${item.name} - $${item.price} (${item.available_quantity} available)`;
            itemSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching menu:', error));

// Add item to order
document.getElementById('addItem').addEventListener('click', () => {
    const selectedItemId = itemSelect.value;
    const selectedItem = Array.from(itemSelect.options).find(option => option.value === selectedItemId);
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (selectedItem) {
        const orderItem = {
            menu_item_id: selectedItemId,
            name: selectedItem.textContent.split(' - ')[0],
            quantity: quantity,
            price: parseFloat(selectedItem.textContent.split(' - ')[1].slice(1))
        };
        orderItems.push(orderItem);
        displayOrderItems();
    }
});

// Display order items
function displayOrderItems() {
    orderItemsDiv.innerHTML = '';
    orderItems.forEach(item => {
        const div = document.createElement('div');
        div.textContent = `${item.name} - Quantity: ${item.quantity} - Price: $${(item.price * item.quantity).toFixed(2)}`;
        orderItemsDiv.appendChild(div);
    });
}

// Place order
orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const tableNumber = document.getElementById('tableNumber').value;
    const contactNumber = document.getElementById('contactNumber').value;

    fetch('/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: orderItems, tableNumber, contactNumber })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        orderItems = [];
        displayOrderItems();
    })
    .catch(error => console.error('Error placing order:', error));
});
