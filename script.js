// Farm Produce Tracker - JavaScript Functions

// Sample data storage
let farmData = {
    crops: JSON.parse(localStorage.getItem('crops')) || [],
    livestock: JSON.parse(localStorage.getItem('livestock')) || [],
    sales: JSON.parse(localStorage.getItem('sales')) || [],
    activities: JSON.parse(localStorage.getItem('activities')) || [],
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in and redirect if needed
    checkAuthentication();

    // Initialize mobile menu
    initMobileMenu();

    // Dashboard initialization
    if (document.getElementById('totalCrops')) {
        updateDashboard();
    }

    // Crops page initialization
    if (document.getElementById('cropsTable')) {
        loadCropsTable();
    }

    // Livestock page initialization
    if (document.getElementById('livestockTable')) {
        loadLivestockTable();
    }

    // Sales page initialization
    if (document.getElementById('salesTable')) {
        loadSalesTable();
        updateSalesSummary();
    }

    // Reports page initialization
    if (document.getElementById('totalInventoryValue')) {
        updateReportsPage();
    }

    // Forms initialization
    initializeForms();
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Change menu icon
            if (navMenu.classList.contains('active')) {
                menuToggle.textContent = '✕';
            } else {
                menuToggle.textContent = '☰';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });

        // Close menu when clicking on a link
        navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    }
}

// Authentication functions
function checkAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const protectedPages = ['dashboard.html', 'crops.html', 'livestock.html', 'sales.html', 'reports.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !currentUser) {
        window.location.href = 'login.html';
        return;
    }

    if ((currentPage === 'login.html' || currentPage === 'register.html') && currentUser) {
        window.location.href = 'dashboard.html';
        return;
    }
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate fields
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
        showError('No account found with this email. Please register first.');
        return;
    }

    if (user.password !== password) {
        showError('Incorrect password. Please try again.');
        return;
    }

    // Login successful
    localStorage.setItem('currentUser', JSON.stringify(user));
    showSuccess('Login successful! Redirecting to dashboard...');

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const farmName = document.getElementById('farmName').value;
    const location = document.getElementById('location').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate all fields are filled
    if (!fullName || !farmName || !location || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.email === email)) {
        showError('This email is already registered. Please use a different email or login.');
        return;
    }

    // Check password match
    if (password !== confirmPassword) {
        showError('Passwords do not match!');
        return;
    }

    // Check password strength
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }

    // Save user to localStorage
    const userData = {
        id: Date.now(),
        fullName: fullName,
        farmName: farmName,
        location: location,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    showSuccess('Registration successful! Redirecting to login...');

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    // Remove any existing messages
    const existingError = document.querySelector('.error-message');
    const existingSuccess = document.querySelector('.success-message');
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();

    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 12px;
        border-radius: 4px;
        margin: 15px 0;
        border: 1px solid #f5c6cb;
        text-align: center;
    `;

    // Insert after the form title or at the top of the form
    const formContainer = document.querySelector('.form-container');
    const form = document.querySelector('form');
    if (formContainer && form) {
        formContainer.insertBefore(errorDiv, form);
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

function showSuccess(message) {
    // Remove any existing messages
    const existingError = document.querySelector('.error-message');
    const existingSuccess = document.querySelector('.success-message');
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();

    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 12px;
        border-radius: 4px;
        margin: 15px 0;
        border: 1px solid #c3e6cb;
        text-align: center;
    `;

    // Insert after the form title or at the top of the form
    const formContainer = document.querySelector('.form-container');
    const form = document.querySelector('form');
    if (formContainer && form) {
        formContainer.insertBefore(successDiv, form);
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
}

// Form handling
function initializeForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Crop form
    const cropForm = document.getElementById('cropForm');
    if (cropForm) {
        cropForm.addEventListener('submit', handleAddCrop);
    }

    // Livestock form
    const livestockForm = document.getElementById('livestockForm');
    if (livestockForm) {
        livestockForm.addEventListener('submit', handleAddLivestock);
    }

    // Sales form
    const salesForm = document.getElementById('salesForm');
    if (salesForm) {
        salesForm.addEventListener('submit', handleAddSale);
    }
}

// Dashboard functions
function updateDashboard() {
    // Update crop count
    document.getElementById('totalCrops').textContent = farmData.crops.length;

    // Update livestock count
    const totalLivestock = farmData.livestock.reduce((sum, animal) => sum + parseInt(animal.quantity), 0);
    document.getElementById('totalLivestock').textContent = totalLivestock;

    // Update monthly sales
    const currentMonth = new Date().getMonth();
    const monthlySales = farmData.sales
        .filter(sale => new Date(sale.date).getMonth() === currentMonth)
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    document.getElementById('monthlySales').textContent = `N$ ${monthlySales.toFixed(2)}`;

    // Update inventory value (simplified calculation)
    const cropValue = farmData.crops.reduce((sum, crop) => sum + (parseFloat(crop.quantity) * 10), 0);
    const livestockValue = farmData.livestock.reduce((sum, animal) => sum + (parseInt(animal.quantity) * 100), 0);
    const totalValue = cropValue + livestockValue;
    document.getElementById('inventoryValue').textContent = `N$ ${totalValue.toFixed(2)}`;

    // Update activity table
    loadActivityTable();
}

function loadActivityTable() {
    const table = document.getElementById('activityTable');
    if (!table) return;

    table.innerHTML = '';

    // Filter out system messages and get only user activities
    const userActivities = farmData.activities.filter(activity => activity.type !== 'system');
    const recentActivities = userActivities.slice(-5).reverse();

    if (recentActivities.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="3" style="text-align: center; color: var(--text-light);">
                No recent activity. Start adding crops, livestock, or sales to see activity here.
            </td>
        `;
        table.appendChild(row);
        return;
    }

    recentActivities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(activity.date)}</td>
            <td>${formatActivityType(activity.type)}</td>
            <td>${activity.details}</td>
        `;
        table.appendChild(row);
    });
}

function formatActivityType(type) {
    const typeMap = {
        'crop_added': 'Crop Added',
        'crop_updated': 'Crop Updated',
        'crop_deleted': 'Crop Deleted',
        'livestock_added': 'Livestock Added',
        'livestock_updated': 'Livestock Updated',
        'livestock_deleted': 'Livestock Deleted',
        'sale_recorded': 'Sale Recorded',
        'sale_deleted': 'Sale Deleted',
        'report_generated': 'Report Generated'
    };
    return typeMap[type] || type;
}

// Crop management functions
function showAddCropForm() {
    document.getElementById('addCropForm').style.display = 'block';
}

function hideAddCropForm() {
    document.getElementById('addCropForm').style.display = 'none';
    document.getElementById('cropForm').reset();
}

function handleAddCrop(e) {
    e.preventDefault();

    const cropName = document.getElementById('cropName').value;
    const cropType = document.getElementById('cropType').value;
    const plantingDate = document.getElementById('plantingDate').value;

    if (!cropName || !cropType || !plantingDate) {
        showError('Please fill in all required fields');
        return;
    }

    const cropData = {
        id: Date.now(),
        name: cropName,
        type: cropType,
        plantingDate: plantingDate,
        harvestDate: document.getElementById('harvestDate').value,
        quantity: document.getElementById('quantity').value || 0,
        status: document.getElementById('status').value
    };

    farmData.crops.push(cropData);
    saveToLocalStorage('crops', farmData.crops);

    // Add activity
    addActivity('crop_added', `Added ${cropData.quantity}kg of ${cropData.name}`);

    showSuccess('Crop added successfully!');
    hideAddCropForm();
    loadCropsTable();
    if (document.getElementById('totalCrops')) {
        updateDashboard();
    }
}

function loadCropsTable() {
    const table = document.getElementById('cropsTable');
    if (!table) return;

    table.innerHTML = '';

    if (farmData.crops.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" style="text-align: center; color: var(--text-light);">
                No crops added yet. Click "Add New Crop" to get started.
            </td>
        `;
        table.appendChild(row);
        return;
    }

    farmData.crops.forEach(crop => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crop.name}</td>
            <td>${crop.type}</td>
            <td>${formatDate(crop.plantingDate)}</td>
            <td>${crop.harvestDate ? formatDate(crop.harvestDate) : 'Not set'}</td>
            <td>${crop.quantity} kg</td>
            <td><span class="status-badge status-${crop.status}">${crop.status}</span></td>
            <td>
                <button class="btn-small" onclick="editCrop(${crop.id})">Edit</button>
                <button class="btn-small btn-danger" onclick="deleteCrop(${crop.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

function deleteCrop(id) {
    if (confirm('Are you sure you want to delete this crop?')) {
        const crop = farmData.crops.find(c => c.id === id);
        farmData.crops = farmData.crops.filter(crop => crop.id !== id);
        saveToLocalStorage('crops', farmData.crops);

        // Add activity
        addActivity('crop_deleted', `Deleted ${crop.name} from crops`);

        showSuccess('Crop deleted successfully!');
        loadCropsTable();
        // Update dashboard if we're on dashboard page
        if (document.getElementById('totalCrops')) {
            updateDashboard();
        }
    }
}

// Edit Crop Functionality
function editCrop(id) {
    const crop = farmData.crops.find(c => c.id === id);
    if (!crop) return;

    // Remove any existing edit form
    const existingEditForm = document.getElementById('editCropForm');
    if (existingEditForm) {
        existingEditForm.remove();
    }

    // Create edit form
    const editForm = document.createElement('div');
    editForm.id = 'editCropForm';
    editForm.className = 'edit-form';
    editForm.innerHTML = `
        <h4>Edit Crop: ${crop.name}</h4>
        <form onsubmit="handleEditCrop(event, ${crop.id})">
            <div class="form-group">
                <label for="editCropName">Crop Name</label>
                <input type="text" id="editCropName" value="${crop.name}" required>
            </div>
            <div class="form-group">
                <label for="editCropType">Crop Type</label>
                <select id="editCropType" required>
                    <option value="grain" ${crop.type === 'grain' ? 'selected' : ''}>Grain</option>
                    <option value="vegetable" ${crop.type === 'vegetable' ? 'selected' : ''}>Vegetable</option>
                    <option value="fruit" ${crop.type === 'fruit' ? 'selected' : ''}>Fruit</option>
                    <option value="legume" ${crop.type === 'legume' ? 'selected' : ''}>Legume</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editPlantingDate">Planting Date</label>
                <input type="date" id="editPlantingDate" value="${crop.plantingDate}" required>
            </div>
            <div class="form-group">
                <label for="editHarvestDate">Expected Harvest Date</label>
                <input type="date" id="editHarvestDate" value="${crop.harvestDate || ''}">
            </div>
            <div class="form-group">
                <label for="editQuantity">Quantity (kg/hectare)</label>
                <input type="number" id="editQuantity" value="${crop.quantity}" step="0.1">
            </div>
            <div class="form-group">
                <label for="editStatus">Status</label>
                <select id="editStatus" required>
                    <option value="planted" ${crop.status === 'planted' ? 'selected' : ''}>Planted</option>
                    <option value="growing" ${crop.status === 'growing' ? 'selected' : ''}>Growing</option>
                    <option value="ready" ${crop.status === 'ready' ? 'selected' : ''}>Ready for Harvest</option>
                    <option value="harvested" ${crop.status === 'harvested' ? 'selected' : ''}>Harvested</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Update Crop</button>
                <button type="button" class="btn btn-secondary" onclick="cancelEditCrop()">Cancel</button>
            </div>
        </form>
    `;

    document.getElementById('editCropContainer').appendChild(editForm);
    document.getElementById('editCropContainer').scrollIntoView({ behavior: 'smooth' });
}

function handleEditCrop(e, id) {
    e.preventDefault();

    const cropIndex = farmData.crops.findIndex(c => c.id === id);
    if (cropIndex === -1) return;

    const oldCropName = farmData.crops[cropIndex].name;

    farmData.crops[cropIndex] = {
        ...farmData.crops[cropIndex],
        name: document.getElementById('editCropName').value,
        type: document.getElementById('editCropType').value,
        plantingDate: document.getElementById('editPlantingDate').value,
        harvestDate: document.getElementById('editHarvestDate').value,
        quantity: document.getElementById('editQuantity').value,
        status: document.getElementById('editStatus').value
    };

    saveToLocalStorage('crops', farmData.crops);
    addActivity('crop_updated', `Updated ${oldCropName} to ${farmData.crops[cropIndex].name}`);

    showSuccess('Crop updated successfully!');
    cancelEditCrop();
    loadCropsTable();
    if (document.getElementById('totalCrops')) {
        updateDashboard();
    }
}

function cancelEditCrop() {
    const editForm = document.getElementById('editCropForm');
    if (editForm) {
        editForm.remove();
    }
}

// Livestock management functions
function showAddLivestockForm() {
    document.getElementById('addLivestockForm').style.display = 'block';
}

function hideAddLivestockForm() {
    document.getElementById('addLivestockForm').style.display = 'none';
    document.getElementById('livestockForm').reset();
}

function handleAddLivestock(e) {
    e.preventDefault();

    const animalType = document.getElementById('animalType').value;
    const quantity = document.getElementById('quantity').value;
    const acquisitionDate = document.getElementById('acquisitionDate').value;

    if (!animalType || !quantity || !acquisitionDate) {
        showError('Please fill in all required fields');
        return;
    }

    const livestockData = {
        id: Date.now(),
        type: animalType,
        breed: document.getElementById('breed').value,
        quantity: quantity,
        acquisitionDate: acquisitionDate,
        healthStatus: document.getElementById('healthStatus').value,
        notes: document.getElementById('notes').value
    };

    farmData.livestock.push(livestockData);
    saveToLocalStorage('livestock', farmData.livestock);

    addActivity('livestock_added', `Added ${livestockData.quantity} ${livestockData.type}(s)`);

    showSuccess('Livestock added successfully!');
    hideAddLivestockForm();
    loadLivestockTable();
    if (document.getElementById('totalLivestock')) {
        updateDashboard();
    }
}

function loadLivestockTable() {
    const table = document.getElementById('livestockTable');
    if (!table) return;

    table.innerHTML = '';

    if (farmData.livestock.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" style="text-align: center; color: var(--text-light);">
                No livestock added yet. Click "Add New Livestock" to get started.
            </td>
        `;
        table.appendChild(row);
        return;
    }

    farmData.livestock.forEach(animal => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${animal.type}</td>
            <td>${animal.breed}</td>
            <td>${animal.quantity}</td>
            <td>${formatDate(animal.acquisitionDate)}</td>
            <td><span class="status-badge status-${animal.healthStatus}">${animal.healthStatus}</span></td>
            <td>${animal.notes || '-'}</td>
            <td>
                <button class="btn-small" onclick="editLivestock(${animal.id})">Edit</button>
                <button class="btn-small btn-danger" onclick="deleteLivestock(${animal.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

function deleteLivestock(id) {
    if (confirm('Are you sure you want to delete this livestock record?')) {
        const animal = farmData.livestock.find(a => a.id === id);
        farmData.livestock = farmData.livestock.filter(animal => animal.id !== id);
        saveToLocalStorage('livestock', farmData.livestock);

        // Add activity
        addActivity('livestock_deleted', `Deleted ${animal.quantity} ${animal.type}(s)`);

        showSuccess('Livestock record deleted successfully!');
        loadLivestockTable();
        // Update dashboard if we're on dashboard page
        if (document.getElementById('totalLivestock')) {
            updateDashboard();
        }
    }
}

// Edit Livestock Functionality
function editLivestock(id) {
    const animal = farmData.livestock.find(a => a.id === id);
    if (!animal) return;

    const existingEditForm = document.getElementById('editLivestockForm');
    if (existingEditForm) {
        existingEditForm.remove();
    }

    const editForm = document.createElement('div');
    editForm.id = 'editLivestockForm';
    editForm.className = 'edit-form';
    editForm.innerHTML = `
        <h4>Edit Livestock: ${animal.type}</h4>
        <form onsubmit="handleEditLivestock(event, ${animal.id})">
            <div class="form-group">
                <label for="editAnimalType">Animal Type</label>
                <select id="editAnimalType" required>
                    <option value="Cattle" ${animal.type === 'Cattle' ? 'selected' : ''}>Cattle</option>
                    <option value="Goats" ${animal.type === 'Goats' ? 'selected' : ''}>Goats</option>
                    <option value="Sheep" ${animal.type === 'Sheep' ? 'selected' : ''}>Sheep</option>
                    <option value="Chickens" ${animal.type === 'Chickens' ? 'selected' : ''}>Chickens</option>
                    <option value="Pigs" ${animal.type === 'Pigs' ? 'selected' : ''}>Pigs</option>
                    <option value="Other" ${animal.type === 'Other' ? 'selected' : ''}>Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editBreed">Breed</label>
                <input type="text" id="editBreed" value="${animal.breed || ''}">
            </div>
            <div class="form-group">
                <label for="editQuantity">Quantity</label>
                <input type="number" id="editQuantity" value="${animal.quantity}" required>
            </div>
            <div class="form-group">
                <label for="editAcquisitionDate">Acquisition Date</label>
                <input type="date" id="editAcquisitionDate" value="${animal.acquisitionDate}" required>
            </div>
            <div class="form-group">
                <label for="editHealthStatus">Health Status</label>
                <select id="editHealthStatus" required>
                    <option value="healthy" ${animal.healthStatus === 'healthy' ? 'selected' : ''}>Healthy</option>
                    <option value="vaccinated" ${animal.healthStatus === 'vaccinated' ? 'selected' : ''}>Vaccinated</option>
                    <option value="sick" ${animal.healthStatus === 'sick' ? 'selected' : ''}>Sick</option>
                    <option value="quarantined" ${animal.healthStatus === 'quarantined' ? 'selected' : ''}>Quarantined</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editNotes">Notes</label>
                <textarea id="editNotes" rows="3">${animal.notes || ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Update Livestock</button>
                <button type="button" class="btn btn-secondary" onclick="cancelEditLivestock()">Cancel</button>
            </div>
        </form>
    `;

    document.getElementById('editLivestockContainer').appendChild(editForm);
    document.getElementById('editLivestockContainer').scrollIntoView({ behavior: 'smooth' });
}

function handleEditLivestock(e, id) {
    e.preventDefault();

    const animalIndex = farmData.livestock.findIndex(a => a.id === id);
    if (animalIndex === -1) return;

    const oldAnimalType = farmData.livestock[animalIndex].type;

    farmData.livestock[animalIndex] = {
        ...farmData.livestock[animalIndex],
        type: document.getElementById('editAnimalType').value,
        breed: document.getElementById('editBreed').value,
        quantity: document.getElementById('editQuantity').value,
        acquisitionDate: document.getElementById('editAcquisitionDate').value,
        healthStatus: document.getElementById('editHealthStatus').value,
        notes: document.getElementById('editNotes').value
    };

    saveToLocalStorage('livestock', farmData.livestock);
    addActivity('livestock_updated', `Updated ${oldAnimalType} to ${farmData.livestock[animalIndex].type}`);

    showSuccess('Livestock updated successfully!');
    cancelEditLivestock();
    loadLivestockTable();
    if (document.getElementById('totalLivestock')) {
        updateDashboard();
    }
}

function cancelEditLivestock() {
    const editForm = document.getElementById('editLivestockForm');
    if (editForm) {
        editForm.remove();
    }
}

// Sales management functions
function showAddSaleForm() {
    document.getElementById('addSaleForm').style.display = 'block';
}

function hideAddSaleForm() {
    document.getElementById('addSaleForm').style.display = 'none';
    document.getElementById('salesForm').reset();
}

function handleAddSale(e) {
    e.preventDefault();

    const itemType = document.getElementById('itemType').value;
    const itemName = document.getElementById('itemName').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const buyer = document.getElementById('buyer').value;
    const saleDate = document.getElementById('saleDate').value;

    if (!itemType || !itemName || !quantity || !price || !buyer || !saleDate) {
        showError('Please fill in all required fields');
        return;
    }

    const saleData = {
        id: Date.now(),
        itemType: itemType,
        itemName: itemName,
        quantity: quantity,
        price: price,
        amount: parseFloat(quantity) * parseFloat(price),
        buyer: buyer,
        date: saleDate,
        paymentStatus: document.getElementById('paymentStatus').value
    };

    farmData.sales.push(saleData);
    saveToLocalStorage('sales', farmData.sales);

    addActivity('sale_recorded', `Sold ${saleData.quantity} ${saleData.itemType} for N$ ${saleData.amount}`);

    showSuccess('Sale recorded successfully!');
    hideAddSaleForm();
    loadSalesTable();
    updateSalesSummary();
    if (document.getElementById('monthlySales')) {
        updateDashboard();
    }
}

function loadSalesTable() {
    const table = document.getElementById('salesTable');
    if (!table) return;

    table.innerHTML = '';

    if (farmData.sales.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="9" style="text-align: center; color: var(--text-light);">
                No sales recorded yet. Click "Record New Sale" to get started.
            </td>
        `;
        table.appendChild(row);
        return;
    }

    farmData.sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(sale.date)}</td>
            <td>${sale.itemType}</td>
            <td>${sale.itemName}</td>
            <td>${sale.quantity}</td>
            <td>N$ ${sale.price}</td>
            <td>N$ ${sale.amount.toFixed(2)}</td>
            <td>${sale.buyer}</td>
            <td><span class="status-badge status-${sale.paymentStatus}">${sale.paymentStatus}</span></td>
            <td>
                <button class="btn-small btn-danger" onclick="deleteSale(${sale.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

function deleteSale(id) {
    if (confirm('Are you sure you want to delete this sale record?')) {
        const sale = farmData.sales.find(s => s.id === id);
        farmData.sales = farmData.sales.filter(sale => sale.id !== id);
        saveToLocalStorage('sales', farmData.sales);

        // Add activity
        addActivity('sale_deleted', `Deleted sale of ${sale.quantity} ${sale.itemName} to ${sale.buyer}`);

        showSuccess('Sale record deleted successfully!');
        loadSalesTable();
        updateSalesSummary();
        // Update dashboard if we're on dashboard page
        if (document.getElementById('monthlySales')) {
            updateDashboard();
        }
    }
}

function updateSalesSummary() {
    if (!document.getElementById('totalSales')) return;

    const totalSales = farmData.sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const currentMonth = new Date().getMonth();
    const monthlySales = farmData.sales
        .filter(sale => new Date(sale.date).getMonth() === currentMonth)
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const pendingSales = farmData.sales
        .filter(sale => sale.paymentStatus === 'pending')
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);

    // Find top buyer
    const buyerCounts = {};
    farmData.sales.forEach(sale => {
        buyerCounts[sale.buyer] = (buyerCounts[sale.buyer] || 0) + 1;
    });
    const topBuyer = Object.keys(buyerCounts).reduce((a, b) => buyerCounts[a] > buyerCounts[b] ? a : b, 'None');

    document.getElementById('totalSales').textContent = `N$ ${totalSales.toFixed(2)}`;
    document.getElementById('monthlySales').textContent = `N$ ${monthlySales.toFixed(2)}`;
    document.getElementById('pendingSales').textContent = `N$ ${pendingSales.toFixed(2)}`;
    document.getElementById('topBuyer').textContent = topBuyer;
}

// Update Item Names for Sales Form
function updateItemNames() {
    const itemType = document.getElementById('itemType').value;
    const itemNameSelect = document.getElementById('itemName');

    itemNameSelect.innerHTML = '<option value="">Select item</option>';

    if (itemType === 'crop') {
        farmData.crops.forEach(crop => {
            const option = document.createElement('option');
            option.value = crop.name;
            option.textContent = crop.name;
            itemNameSelect.appendChild(option);
        });
    } else if (itemType === 'livestock') {
        farmData.livestock.forEach(animal => {
            const option = document.createElement('option');
            option.value = animal.type;
            option.textContent = animal.type;
            itemNameSelect.appendChild(option);
        });
    }
}

// Reports Page Functions
function generateSalesReport() {
    const totalSales = farmData.sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const currentMonth = new Date().getMonth();
    const monthlySales = farmData.sales
        .filter(sale => new Date(sale.date).getMonth() === currentMonth)
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);

    const reportContent = `
╔══════════════════════════════════════════════════╗
║             FARM PRODUCE TRACKER                 ║
║               SALES PERFORMANCE REPORT           ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  📅 Report Generated: ${new Date().toLocaleDateString()}              ║
║  👨‍🌾 Farmer: ${JSON.parse(localStorage.getItem('currentUser'))?.farmName || 'Your Farm'}                    ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 📊 FINANCIAL SUMMARY             ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  💰 Total Revenue:       N$ ${totalSales.toFixed(2).padEnd(10)}       ║
║  📈 This Month:          N$ ${monthlySales.toFixed(2).padEnd(10)}       ║
║  🔄 Total Transactions:  ${farmData.sales.length.toString().padEnd(10)}       ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 🏆 TOP PERFORMERS                ║
╠══════════════════════════════════════════════════╣
║                                                  ║
${getTopProducts().slice(0, 3).map((product, index) => 
`║  ${index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} ${product.name.padEnd(15)} N$ ${product.amount.toFixed(2).padEnd(8)} ║`
).join('\n')}
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 🤝 BUYER NETWORK                 ║
╠══════════════════════════════════════════════════╣
║                                                  ║
${getTopBuyers().slice(0, 3).map(buyer => 
`║  👤 ${buyer.name.padEnd(20)} ${buyer.count} purchases  ║`
).join('\n')}
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 💡 RECOMMENDATIONS               ║
╠══════════════════════════════════════════════════╣
║                                                  ║
${getSalesRecommendations().map(rec => 
`║  ✅ ${rec.padEnd(40)} ║`
).join('\n')}
║                                                  ║
╚══════════════════════════════════════════════════╝

"Your success grows from the seeds you plant today 🌱"
    `;

    downloadReportFile(reportContent, 'sales-performance-report.txt');
    addActivity('report_generated', 'Generated sales performance report');
    showSuccess('Sales report downloaded successfully! 📊');
}

function generateCropReport() {
    const totalCrops = farmData.crops.length;
    const readyCrops = farmData.crops.filter(c => c.status === 'ready').length;
    const growingCrops = farmData.crops.filter(c => c.status === 'growing').length;
    const totalQuantity = farmData.crops.reduce((sum, crop) => sum + parseFloat(crop.quantity), 0);

    const reportContent = `
╔══════════════════════════════════════════════════╗
║             FARM PRODUCE TRACKER                 ║
║               CROP ANALYTICS REPORT              ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  📅 Report Generated: ${new Date().toLocaleDateString()}              ║
║  👨‍🌾 Farmer: ${JSON.parse(localStorage.getItem('currentUser'))?.farmName || 'Your Farm'}                    ║
║  🌱 Total Crop Types: ${totalCrops}                            ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 📈 CROP OVERVIEW                 ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  📊 Total Quantity:    ${totalQuantity} kg                  ║
║  ✅ Ready to Harvest:  ${readyCrops} crops                 ║
║  🌿 Still Growing:     ${growingCrops} crops                 ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 🌾 CROP BREAKDOWN                ║
╠══════════════════════════════════════════════════╣
║                                                  ║
${farmData.crops.map(crop => 
`║  ${getCropEmoji(crop.type)} ${crop.name.padEnd(12)} ${crop.quantity}kg ${crop.status.padEnd(12)} ║`
).join('\n')}
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 🎯 ACTION PLAN                   ║
╠══════════════════════════════════════════════════╣
║                                                  ║
${getCropRecommendations().map(rec => 
`║  🌟 ${rec.padEnd(40)} ║`
).join('\n')}
║                                                  ║
╚══════════════════════════════════════════════════╝

"Every harvest begins with a single seed planted with care 🌻"
    `;

    downloadReportFile(reportContent, 'crop-analytics-report.txt');
    addActivity('report_generated', 'Generated crop analytics report');
    showSuccess('Crop report downloaded successfully! 🌾');
}

function generateLivestockReport() {
    const totalAnimals = farmData.livestock.reduce((sum, animal) => sum + parseInt(animal.quantity), 0);
    const healthyAnimals = farmData.livestock.filter(a => a.healthStatus === 'healthy').length;
    const totalTypes = farmData.livestock.length;

    const reportContent = `
╔══════════════════════════════════════════════════╗
║             FARM PRODUCE TRACKER                 ║
║              LIVESTOCK HEALTH REPORT             ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  📅 Report Generated: ${new Date().toLocaleDateString()}              ║
║  👨‍🌾 Farmer: ${JSON.parse(localStorage.getItem('currentUser'))?.farmName || 'Your Farm'}                    ║
║  🐄 Total Animals: ${totalAnimals}                          ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 🏥 HEALTH SUMMARY                ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  💚 Healthy Herds: ${healthyAnimals}/${totalTypes}                    ║
║  📊 Animal Types:  ${totalTypes}                          ║
║  🎯 Health Score:  ${Math.round((healthyAnimals/totalTypes)*100)}%                    ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 🐮 HERD BREAKDOWN                ║
╠══════════════════════════════════════════════════╣
║                                                  ║
${farmData.livestock.map(animal => 
`║  ${getAnimalEmoji(animal.type)} ${animal.type.padEnd(10)} ${animal.quantity.toString().padEnd(3)} ${animal.healthStatus.padEnd(12)} ║`
).join('\n')}
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 💪 HEALTH TIPS                   ║
╠══════════════════════════════════════════════════╣
║                                                  ║
${getLivestockRecommendations().map(rec => 
`║  💡 ${rec.padEnd(40)} ║`
).join('\n')}
║                                                  ║
╚══════════════════════════════════════════════════╝

"Healthy animals are the heartbeat of a thriving farm ❤️"
    `;

    downloadReportFile(reportContent, 'livestock-health-report.txt');
    addActivity('report_generated', 'Generated livestock health report');
    showSuccess('Livestock report downloaded successfully! 🐄');
}

function generateFinancialReport() {
    const totalSales = farmData.sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const currentMonthSales = farmData.sales
        .filter(sale => new Date(sale.date).getMonth() === new Date().getMonth())
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const inventoryValue = calculateInventoryValue();

    const reportContent = `
╔══════════════════════════════════════════════════╗
║             FARM PRODUCE TRACKER                 ║
║              FINANCIAL SUMMARY REPORT            ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  📅 Report Generated: ${new Date().toLocaleDateString()}              ║
║  👨‍🌾 Farmer: ${JSON.parse(localStorage.getItem('currentUser'))?.farmName || 'Your Farm'}                    ║
║  💼 Business Health: ${getBusinessHealth(totalSales)}                ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 💰 REVENUE ANALYSIS              ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  🏦 Total Revenue:      N$ ${totalSales.toFixed(2).padEnd(10)}       ║
║  📈 Monthly Average:    N$ ${(totalSales/Math.max(farmData.sales.length,1)).toFixed(2).padEnd(10)}       ║
║  🌟 This Month:         N$ ${currentMonthSales.toFixed(2).padEnd(10)}       ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 📦 ASSETS OVERVIEW               ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  🌱 Crop Value:         N$ ${(farmData.crops.reduce((sum, crop) => sum + (parseFloat(crop.quantity) * 10), 0)).toFixed(2).padEnd(10)}       ║
║  🐄 Livestock Value:    N$ ${(farmData.livestock.reduce((sum, animal) => sum + (parseInt(animal.quantity) * 100), 0)).toFixed(2).padEnd(10)}       ║
║  💎 Total Assets:       N$ ${inventoryValue.toFixed(2).padEnd(10)}       ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 🎯 GROWTH STRATEGY               ║
╠══════════════════════════════════════════════════╣
║                                                  ║
${getFinancialRecommendations(totalSales).map(rec => 
`║  💎 ${rec.padEnd(40)} ║`
).join('\n')}
║                                                  ║
╚══════════════════════════════════════════════════╝

"Your farm's financial growth is cultivated one wise decision at a time 💰"
    `;

    downloadReportFile(reportContent, 'financial-summary-report.txt');
    addActivity('report_generated', 'Generated financial summary report');
    showSuccess('Financial report downloaded successfully! 💵');
}

// Helper functions for reports
function getTopProducts() {
    const productSales = {};
    farmData.sales.forEach(sale => {
        productSales[sale.itemName] = (productSales[sale.itemName] || 0) + parseFloat(sale.amount);
    });

    return Object.entries(productSales)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
}

function getTopBuyers() {
    const buyerCounts = {};
    farmData.sales.forEach(sale => {
        buyerCounts[sale.buyer] = (buyerCounts[sale.buyer] || 0) + 1;
    });

    return Object.entries(buyerCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

function getSalesRecommendations() {
    const recommendations = [];
    const totalSales = farmData.sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);

    if (totalSales === 0) {
        return ['Start recording your first sales transactions', 'Focus on building customer relationships', 'Set achievable monthly revenue targets'];
    }

    if (farmData.sales.length < 5) {
        recommendations.push('Increase sales frequency with current buyers');
    }

    const topProduct = getTopProducts()[0];
    if (topProduct) {
        recommendations.push(`Focus on ${topProduct.name} - your best performer`);
    }

    recommendations.push('Explore new markets for your products');
    recommendations.push('Consider seasonal pricing strategies');

    return recommendations.slice(0, 3);
}

function getCropEmoji(type) {
    const emojis = {
        'grain': '🌾',
        'vegetable': '🥦',
        'fruit': '🍎',
        'legume': '🥜'
    };
    return emojis[type] || '🌱';
}

function getCropRecommendations() {
    const recommendations = [];
    const readyCrops = farmData.crops.filter(c => c.status === 'ready');

    if (readyCrops.length > 0) {
        recommendations.push(`Harvest and sell ${readyCrops.length} ready crops`);
    }

    if (farmData.crops.length < 3) {
        recommendations.push('Diversify with additional crop types');
    }

    recommendations.push('Monitor soil health and crop rotation');
    recommendations.push('Plan planting schedule for continuous harvest');

    return recommendations.slice(0, 3);
}

function getAnimalEmoji(type) {
    const emojis = {
        'Cattle': '🐄',
        'Goats': '🐐',
        'Sheep': '🐑',
        'Chickens': '🐔',
        'Pigs': '🐖'
    };
    return emojis[type] || '🐾';
}

function getLivestockRecommendations() {
    const recommendations = [];
    const unhealthy = farmData.livestock.filter(a => a.healthStatus !== 'healthy');

    if (unhealthy.length > 0) {
        recommendations.push(`Address health issues in ${unhealthy.length} herds`);
    }

    recommendations.push('Maintain regular vaccination schedule');
    recommendations.push('Monitor feeding and nutrition programs');
    recommendations.push('Plan breeding for herd growth');

    return recommendations.slice(0, 3);
}

function getBusinessHealth(totalSales) {
    if (totalSales === 0) return 'Starting Up 🌱';
    if (totalSales < 5000) return 'Growing Steadily 📈';
    if (totalSales < 20000) return 'Thriving Business 💰';
    return 'Highly Successful 🏆';
}

function getFinancialRecommendations(totalSales) {
    const recommendations = [];

    if (totalSales === 0) {
        return ['Begin recording all farm transactions', 'Set up basic accounting system', 'Track expenses and revenue separately'];
    }

    if (totalSales < 10000) {
        recommendations.push('Focus on increasing profit margins');
    }

    recommendations.push('Reinvest profits into farm expansion');
    recommendations.push('Build emergency fund for seasonal changes');
    recommendations.push('Explore value-added product opportunities');

    return recommendations.slice(0, 3);
}

function downloadReportFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Update reports page statistics
function updateReportsPage() {
    if (!document.getElementById('totalInventoryValue')) return;

    // Inventory value
    const cropValue = farmData.crops.reduce((sum, crop) => sum + (parseFloat(crop.quantity) * 10), 0);
    const livestockValue = farmData.livestock.reduce((sum, animal) => sum + (parseInt(animal.quantity) * 100), 0);
    document.getElementById('totalInventoryValue').textContent = `N$ ${(cropValue + livestockValue).toFixed(2)}`;

    // Monthly revenue
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = farmData.sales
        .filter(sale => new Date(sale.date).getMonth() === currentMonth)
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    document.getElementById('monthlyRevenue').textContent = `N$ ${monthlyRevenue.toFixed(2)}`;

    // Active crops and animals
    document.getElementById('activeCropsCount').textContent = farmData.crops.length;
    document.getElementById('totalAnimalsCount').textContent = farmData.livestock.reduce((sum, animal) => sum + parseInt(animal.quantity), 0);

    // Update stats table
    updateStatsTable();
}

function updateStatsTable() {
    const statsTable = document.getElementById('statsTable');
    if (!statsTable) return;

    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = new Date().getFullYear();
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthSales = farmData.sales
        .filter(sale => new Date(sale.date).getMonth() === currentMonth && new Date(sale.date).getFullYear() === currentYear)
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);

    const lastMonthSales = farmData.sales
        .filter(sale => new Date(sale.date).getMonth() === lastMonth && new Date(sale.date).getFullYear() === lastMonthYear)
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);

    const salesChange = lastMonthSales === 0 ? 100 : ((currentMonthSales - lastMonthSales) / lastMonthSales * 100);

    statsTable.innerHTML = `
        <tr>
            <td>Total Sales</td>
            <td>N$ ${currentMonthSales.toFixed(2)}</td>
            <td>N$ ${lastMonthSales.toFixed(2)}</td>
            <td style="color: ${salesChange >= 0 ? '#2d8a5f' : '#dc3545'}">${salesChange >= 0 ? '+' : ''}${salesChange.toFixed(1)}%</td>
        </tr>
        <tr>
            <td>New Crops</td>
            <td>${farmData.crops.filter(crop => new Date(crop.plantingDate).getMonth() === currentMonth).length}</td>
            <td>${farmData.crops.filter(crop => new Date(crop.plantingDate).getMonth() === lastMonth).length}</td>
            <td>-</td>
        </tr>
        <tr>
            <td>Livestock Added</td>
            <td>${farmData.livestock.filter(animal => new Date(animal.acquisitionDate).getMonth() === currentMonth).length}</td>
            <td>${farmData.livestock.filter(animal => new Date(animal.acquisitionDate).getMonth() === lastMonth).length}</td>
            <td>-</td>
        </tr>
    `;
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function addActivity(type, details) {
    const activity = {
        date: new Date().toISOString(),
        type: type,
        details: details
    };

    farmData.activities.push(activity);
    saveToLocalStorage('activities', farmData.activities);
}

function calculateInventoryValue() {
    const cropValue = farmData.crops.reduce((sum, crop) => sum + (parseFloat(crop.quantity) * 10), 0);
    const livestockValue = farmData.livestock.reduce((sum, animal) => sum + (parseInt(animal.quantity) * 100), 0);
    return cropValue + livestockValue;
}

// Add some sample data for demonstration (without system messages)
function addSampleData() {
    if (farmData.crops.length === 0) {
        farmData.crops = [
            {
                id: 1,
                name: 'Maize',
                type: 'grain',
                plantingDate: '2025-01-15',
                harvestDate: '2025-05-20',
                quantity: 500,
                status: 'growing'
            },
            {
                id: 2,
                name: 'Mahangu',
                type: 'grain',
                plantingDate: '2025-02-01',
                harvestDate: '2025-06-15',
                quantity: 300,
                status: 'growing'
            }
        ];
        saveToLocalStorage('crops', farmData.crops);

        // Add activities for sample data
        addActivity('crop_added', 'Added 500kg of Maize');
        addActivity('crop_added', 'Added 300kg of Mahangu');
    }

    if (farmData.livestock.length === 0) {
        farmData.livestock = [
            {
                id: 1,
                type: 'Cattle',
                breed: 'Brahman',
                quantity: 25,
                acquisitionDate: '2024-08-10',
                healthStatus: 'healthy',
                notes: 'Main herd'
            },
            {
                id: 2,
                type: 'Goats',
                breed: 'Boer',
                quantity: 50,
                acquisitionDate: '2024-11-05',
                healthStatus: 'healthy',
                notes: 'For meat production'
            }
        ];
        saveToLocalStorage('livestock', farmData.livestock);

        // Add activities for sample data
        addActivity('livestock_added', 'Added 25 Cattle(s)');
        addActivity('livestock_added', 'Added 50 Goat(s)');
    }

    if (farmData.sales.length === 0) {
        farmData.sales = [
            {
                id: 1,
                itemType: 'crop',
                itemName: 'Maize',
                quantity: 100,
                price: 8.5,
                amount: 850,
                buyer: 'Local Market',
                date: '2025-03-01',
                paymentStatus: 'paid'
            }
        ];
        saveToLocalStorage('sales', farmData.sales);

        // Add activities for sample data
        addActivity('sale_recorded', 'Sold 100 crop for N$ 850');
    }

    // Don't add system messages to activities
    if (farmData.activities.length === 0) {
        // Just ensure we have some initial activities from the sample data above
    }
}

// Initialize with sample data on first load
addSampleData();
