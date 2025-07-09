// Global variables
let properties = [];
let currentPropertyData = {};
let uploadedImages = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProperties();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Property form submission
    document.getElementById('propertyForm').addEventListener('submit', handlePropertySubmit);
    
    // Image upload
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
            closeAllModals();
        }
    });
}

// Role selection functions
function selectRole(role) {
    if (role === 'seeker') {
        closeRoleModal();
        return;
    } else if (role === 'landlord') {
        closeRoleModal();
        setTimeout(() => {
            showPropertyModal();
        }, 300);
    }
}

function showRoleModal() {
    document.getElementById('roleModal').classList.remove('hidden');
}

function closeRoleModal() {
    document.getElementById('roleModal').classList.add('hidden');
}

// Property modal functions
function showPropertyModal() {
    document.getElementById('propertyModal').classList.remove('hidden');
}

function closePropertyModal() {
    document.getElementById('propertyModal').classList.add('hidden');
    document.getElementById('propertyForm').reset();
}

// Image modal functions
function showImageModal() {
    document.getElementById('imageModal').classList.remove('hidden');
}

function closeImageModal() {
    document.getElementById('imageModal').classList.add('hidden');
    uploadedImages = [];
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('imageActions').classList.add('hidden');
}

function closeAllModals() {
    closeRoleModal();
    closePropertyModal();
    closeImageModal();
}

// Handle property form submission
function handlePropertySubmit(e) {
    e.preventDefault();
    
    // Get form data
    currentPropertyData = {
        tenantName: document.getElementById('apartmentName').value,
        houseType: document.getElementById('houseType').value,
        location: document.getElementById('location').value,
        price: parseInt(document.getElementById('price').value),
        description: document.getElementById('description').value || `Modern ${document.getElementById('houseType').value.toLowerCase()} in ${document.getElementById('location').value}.`
    };
    
    closePropertyModal();
    setTimeout(() => {
        showImageModal();
    }, 300);
}

// Handle image upload
function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    
    if (files.length < 3) {
        alert('Please select at least 3 images');
        return;
    }
    
    uploadedImages = [];
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';
    
    files.forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImages.push(e.target.result);
                
                const imageDiv = document.createElement('div');
                imageDiv.className = 'image-preview';
                imageDiv.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button class="remove-btn" onclick="removeImage(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                imagePreview.appendChild(imageDiv);
            };
            reader.readAsDataURL(file);
        }
    });
    
    setTimeout(() => {
        if (uploadedImages.length >= 3) {
            document.getElementById('imagePreview').classList.remove('hidden');
            document.getElementById('imageActions').classList.remove('hidden');
        }
    }, 100);
}

// Remove image from preview
function removeImage(index) {
    uploadedImages.splice(index, 1);
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.children[index].remove();
    
    if (uploadedImages.length < 3) {
        document.getElementById('imageActions').classList.add('hidden');
    }
}

// Complete property post
function completePost() {
    if (uploadedImages.length < 3) {
        alert('Please upload at least 3 images');
        return;
    }
    
    // Create new property object
    const newProperty = {
        id: generateId(),
        tenantName: currentPropertyData.tenantName,
        location: currentPropertyData.location,
        houseType: currentPropertyData.houseType,
        price: currentPropertyData.price,
        images: uploadedImages,
        rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
        dateUploaded: new Date().toISOString().split('T')[0],
        description: currentPropertyData.description
    };
    
    // Add to properties array
    properties.push(newProperty);
    
    // Save to localStorage (simulating JSON file save)
    localStorage.setItem('properties-data', JSON.stringify({ properties }));
    
    // Close modal and show success message
    closeImageModal();
    showSuccessMessage();
    
    // Refresh properties display
    displayProperties();
    
    // Reset form data
    currentPropertyData = {};
    uploadedImages = [];
}

// Generate unique ID
function generateId() {
    return Math.random().toString(36).substr(2, 6);
}

// Show success message
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('hidden');
    successMessage.classList.add('success-animation');
    
    setTimeout(() => {
        successMessage.classList.add('hidden');
        successMessage.classList.remove('success-animation');
    }, 3000);
}

// Load properties from localStorage or use default data
function loadProperties() {
    const savedData = localStorage.getItem('properties-data');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        properties = data.properties || [];
    } else {
        // Default properties data
        properties = [
            {
                id: "443ff4",
                tenantName: "Sunny Westlands Apartment",
                location: "Westlands, Nairobi",
                houseType: "One-bedroom",
                price: 25000,
                images: [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
                ],
                rating: 4.5,
                dateUploaded: "2025-06-28",
                description: "Modern one-bedroom apartment in the heart of Westlands with all amenities included."
            },
            {
                id: "556ab2",
                tenantName: "Garden View Villa",
                location: "Karen, Nairobi",
                houseType: "Villa",
                price: 85000,
                images: [
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
                    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                ],
                rating: 4.8,
                dateUploaded: "2025-06-30",
                description: "Luxurious villa with garden views in exclusive Karen neighborhood."
            },
            {
                id: "789cd3",
                tenantName: "Cozy Kasarani Bedsitter",
                location: "Kasarani, Nairobi",
                houseType: "Bedsitter",
                price: 12000,
                images: [
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80",
                    "https://images.unsplash.com/photo-1615873968403-89e068629265?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2032&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                ],
                rating: 4.2,
                dateUploaded: "2025-07-01",
                description: "Affordable and comfortable bedsitter perfect for young professionals."
            },
            {
                id: "112ef5",
                tenantName: "Executive CBD Single Room",
                location: "CBD, Nairobi",
                houseType: "Single room",
                price: 8000,
                images: [
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                ],
                rating: 3.9,
                dateUploaded: "2025-06-25",
                description: "Single room in the heart of CBD with easy access to amenities."
            },
            {
                id: "334gh6",
                tenantName: "Modern Kilimani Loft",
                location: "Kilimani, Nairobi",
                houseType: "Other",
                price: 45000,
                images: [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80"
                ],
                rating: 4.6,
                dateUploaded: "2025-06-29",
                description: "Stylish loft apartment with modern design in trendy Kilimani area."
            },
            {
                id: "567jk8",
                tenantName: "Riverside Lavington Apartment",
                location: "Lavington, Nairobi",
                houseType: "One-bedroom",
                price: 35000,
                images: [
                    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                ],
                rating: 4.3,
                dateUploaded: "2025-06-27",
                description: "Elegant one-bedroom apartment with riverside views in Lavington."
            },
            {
                id: "890lm9",
                tenantName: "Parklands Family Villa",
                location: "Parklands, Nairobi",
                houseType: "Villa",
                price: 95000,
                images: [
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
                    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                ],
                rating: 4.7,
                dateUploaded: "2025-06-26",
                description: "Spacious family villa in Parklands with premium amenities."
            },
            {
                id: "123no0",
                tenantName: "Kileleshwa Studio",
                location: "Kileleshwa, Nairobi",
                houseType: "Bedsitter",
                price: 18000,
                images: [
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    "https://images.unsplash.com/photo-1615873968403-89e068629265?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2032&q=80",
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80"
                ],
                rating: 4.1,
                dateUploaded: "2025-07-02",
                description: "Modern studio apartment in upscale Kileleshwa neighborhood."
            }
        ];
    }
    
    // Save default data to localStorage if it doesn't exist
    if (!savedData) {
        localStorage.setItem('properties-data', JSON.stringify({ properties }));
    }
    
    // Hide loading spinner and display properties
    setTimeout(() => {
        document.getElementById('loadingSpinner').classList.add('hidden');
        displayProperties();
    }, 1000);
}

// Display properties in the grid
function displayProperties() {
    const grid = document.getElementById('propertiesGrid');
    grid.innerHTML = '';
    
    properties.forEach((property, index) => {
        const propertyCard = createPropertyCard(property, index);
        grid.appendChild(propertyCard);
    });
}

// Create property card element
function createPropertyCard(property, index) {
    const card = document.createElement('div');
    card.className = 'property-card animate-fade-in';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const imageSlider = createImageSlider(property.images, property.id);
    const starRating = createStarRating(property.rating);
    
    card.innerHTML = `
        ${imageSlider}
        <div class="price-badge">
            KES ${property.price.toLocaleString()}
        </div>
        <div class="p-6">
            <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-bold text-gray-800 line-clamp-1">${property.tenantName}</h3>
                <div class="flex items-center space-x-1">
                    ${starRating}
                    <span class="text-sm text-gray-600 ml-1">${property.rating}</span>
                </div>
            </div>
            <div class="flex items-center text-gray-600 mb-2">
                <i class="fas fa-map-marker-alt mr-2 text-cyan-500"></i>
                <span class="text-sm">${property.location}</span>
            </div>
            <div class="flex items-center text-gray-600 mb-3">
                <i class="fas fa-home mr-2 text-indigo-500"></i>
                <span class="text-sm">${property.houseType}</span>
            </div>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">${property.description}</p>
            <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">
                    <i class="fas fa-calendar-alt mr-1"></i>
                    ${formatDate(property.dateUploaded)}
                </span>
                <button class="bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    <i class="fas fa-phone mr-2"></i>
                    Contact
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Create image slider for property card
function createImageSlider(images, propertyId) {
    if (!images || images.length === 0) return '<div class="property-image bg-gray-200"></div>';
    
    const sliderId = `slider-${propertyId}`;
    
    let sliderHTML = `
        <div class="image-slider" id="${sliderId}">
            <div class="slider-container">
    `;
    
    images.forEach((image, index) => {
        sliderHTML += `<img src="${image}" alt="Property ${index + 1}" class="slider-image">`;
    });
    
    sliderHTML += `</div>`;
    
    if (images.length > 1) {
        sliderHTML += `
            <button class="slider-nav prev" onclick="changeSlide('${sliderId}', -1)">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="slider-nav next" onclick="changeSlide('${sliderId}', 1)">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="slider-indicators">
        `;
        
        images.forEach((_, index) => {
            sliderHTML += `<div class="slider-indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide('${sliderId}', ${index})"></div>`;
        });
        
        sliderHTML += `</div>`;
    }
    
    sliderHTML += `</div>`;
    
    return sliderHTML;
}

// Create star rating
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt star"></i>';
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
        starsHTML += '<i class="far fa-star star empty"></i>';
    }
    
    return starsHTML;
}

// Image slider functionality
let currentSlides = {};

function changeSlide(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    const container = slider.querySelector('.slider-container');
    const images = container.querySelectorAll('.slider-image');
    const indicators = slider.querySelectorAll('.slider-indicator');
    
    if (!currentSlides[sliderId]) {
        currentSlides[sliderId] = 0;
    }
    
    currentSlides[sliderId] += direction;
    
    if (currentSlides[sliderId] < 0) {
        currentSlides[sliderId] = images.length - 1;
    } else if (currentSlides[sliderId] >= images.length) {
        currentSlides[sliderId] = 0;
    }
    
    const translateX = -currentSlides[sliderId] * 100;
    container.style.transform = `translateX(${translateX}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlides[sliderId]);
    });
}

function goToSlide(sliderId, slideIndex) {
    const slider = document.getElementById(sliderId);
    const container = slider.querySelector('.slider-container');
    const indicators = slider.querySelectorAll('.slider-indicator');
    
    currentSlides[sliderId] = slideIndex;
    
    const translateX = -slideIndex * 100;
    container.style.transform = `translateX(${translateX}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === slideIndex);
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Search and filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[placeholder="Search by location or name..."]');
    const typeFilter = document.querySelector('select');
    const sortFilter = document.querySelectorAll('select')[1];
    
    if (searchInput) {
        searchInput.addEventListener('input', filterProperties);
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', filterProperties);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProperties);
    }
});

function filterProperties() {
    const searchTerm = document.querySelector('input[placeholder="Search by location or name..."]').value.toLowerCase();
    const typeFilter = document.querySelector('select').value;
    const sortFilter = document.querySelectorAll('select')[1].value;
    
    let filteredProperties = properties.filter(property => {
        const matchesSearch = property.tenantName.toLowerCase().includes(searchTerm) ||
                             property.location.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || property.houseType === typeFilter;
        
        return matchesSearch && matchesType;
    });
    
    // Sort properties
    if (sortFilter) {
        filteredProperties = sortProperties(filteredProperties, sortFilter);
    }
    
    displayFilteredProperties(filteredProperties);
}

function sortProperties(properties, sortBy) {
    return properties.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'newest':
                return new Date(b.dateUploaded) - new Date(a.dateUploaded);
            default:
                return 0;
        }
    });
}

function displayFilteredProperties(filteredProperties) {
    const grid = document.getElementById('propertiesGrid');
    grid.innerHTML = '';
    
    if (filteredProperties.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
                <p class="text-gray-500">Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    filteredProperties.forEach((property, index) => {
        const propertyCard = createPropertyCard(property, index);
        grid.appendChild(propertyCard);
    });
}

// Auto-slide functionality for image sliders
setInterval(() => {
    const sliders = document.querySelectorAll('.image-slider');
    sliders.forEach(slider => {
        const images = slider.querySelectorAll('.slider-image');
        if (images.length > 1) {
            changeSlide(slider.id, 1);
        }
    });
}, 5000); // Change slide every 5 seconds