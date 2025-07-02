// Global Variables
let propertiesData = [];
let filteredProperties = [];
let currentPage = 1;
const propertiesPerPage = 12;
let isLoading = false;

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const pullRefreshIndicator = document.getElementById('pullRefreshIndicator');
const searchModal = document.getElementById('searchModal');
const propertiesGrid = document.getElementById('propertiesGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadPropertiesData();
    setupEventListeners();
    setupPullToRefresh();
});

// App Initialization
function initializeApp() {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

// Load Properties Data
async function loadPropertiesData() {
    try {
        const response = await fetch('properties-data.json');
        propertiesData = await response.json();
        filteredProperties = [...propertiesData];
        renderProperties();
    } catch (error) {
        console.error('Error loading properties:', error);
        // Fallback to sample data if JSON file not found
        propertiesData = generateSampleData();
        filteredProperties = [...propertiesData];
        renderProperties();
    }
}

// Generate Sample Data (fallback)
function generateSampleData() {
    const sampleData = [
        {
            id: "443ff4",
            tenantName: "Sunny Apartments",
            location: "Westlands, Nairobi",
            houseType: "One-bedroom",
            price: 25000,
            images: [
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
            ],
            rating: 4.5,
            dateUploaded: "2025-06-28"
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
            dateUploaded: "2025-06-30"
        },
        {
            id: "789cd3",
            tenantName: "Cozy Bedsitter",
            location: "Kasarani, Nairobi",
            houseType: "Bedsitter",
            price: 12000,
            images: [
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80",
                "https://images.unsplash.com/photo-1615873968403-89e068629265?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2032&q=80"
            ],
            rating: 4.2,
            dateUploaded: "2025-07-01"
        },
        {
            id: "112ef5",
            tenantName: "Executive Single Room",
            location: "CBD, Nairobi",
            houseType: "Single room",
            price: 8000,
            images: [
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80"
            ],
            rating: 3.9,
            dateUploaded: "2025-06-25"
        },
        {
            id: "334gh6",
            tenantName: "Modern Loft",
            location: "Kilimani, Nairobi",
            houseType: "Other",
            price: 45000,
            images: [
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80",
               "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80"
           ],
           rating: 4.6,
           dateUploaded: "2025-06-29"
       },
       {
           id: "567jk8",
           tenantName: "Riverside Apartments",
           location: "Lavington, Nairobi",
           houseType: "One-bedroom",
           price: 35000,
           images: [
               "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
               "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
           ],
           rating: 4.3,
           dateUploaded: "2025-06-27"
       }
   ];
   
   // Generate more sample data for demonstration
   const locations = ["Westlands", "Karen", "Kilimani", "Lavington", "Kasarani", "CBD", "Kileleshwa", "Parklands"];
   const houseTypes = ["Single room", "Bedsitter", "One-bedroom", "Villa", "Other"];
   const additionalData = [];
   
   for (let i = 0; i < 20; i++) {
       additionalData.push({
           id: Math.random().toString(36).substr(2, 6),
           tenantName: `Property ${i + 7}`,
           location: locations[Math.floor(Math.random() * locations.length)] + ", Nairobi",
           houseType: houseTypes[Math.floor(Math.random() * houseTypes.length)],
           price: Math.floor(Math.random() * 80000) + 8000,
           images: [
               "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
               "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
           ],
           rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
           dateUploaded: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
       });
   }
   
   return [...sampleData, ...additionalData];
}

// Event Listeners Setup
function setupEventListeners() {
   // Search Modal
   document.getElementById('searchToggle').addEventListener('click', openSearchModal);
   document.getElementById('closeSearch').addEventListener('click', closeSearchModal);
   document.getElementById('searchModal').addEventListener('click', (e) => {
       if (e.target === document.getElementById('searchModal')) {
           closeSearchModal();
       }
   });
   
   // Search Form
   document.getElementById('searchForm').addEventListener('submit', handleSearch);
   
   // Login Button
   document.getElementById('loginBtn').addEventListener('click', () => {
       window.location.href = 'login.html'; // Placeholder redirect
   });
   
   // Sort Properties
   document.getElementById('sortProperties').addEventListener('change', handleSort);
   
   // Load More Button
   loadMoreBtn.addEventListener('click', loadMoreProperties);
   
   // Keyboard Events
   document.addEventListener('keydown', (e) => {
       if (e.key === 'Escape') {
           closeSearchModal();
       }
       if (e.ctrlKey && e.key === 'k') {
           e.preventDefault();
           openSearchModal();
       }
   });
}

// Pull to Refresh Setup
function setupPullToRefresh() {
   let startY = 0;
   let pullDistance = 0;
   const threshold = 100;
   
   document.addEventListener('touchstart', (e) => {
       if (window.scrollY === 0) {
           startY = e.touches[0].clientY;
       }
   });
   
   document.addEventListener('touchmove', (e) => {
       if (window.scrollY === 0 && startY > 0) {
           pullDistance = e.touches[0].clientY - startY;
           
           if (pullDistance > 0 && pullDistance < threshold * 2) {
               e.preventDefault();
               const progress = Math.min(pullDistance / threshold, 1);
               pullRefreshIndicator.style.transform = `translateY(${progress * 100 - 100}%)`;
               
               if (pullDistance > threshold) {
                   pullRefreshIndicator.classList.add('pull-refresh-active');
                   pullRefreshIndicator.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>Release to refresh';
               } else {
                   pullRefreshIndicator.classList.remove('pull-refresh-active');
                   pullRefreshIndicator.innerHTML = '<i class="fas fa-arrow-down mr-2"></i>Pull to refresh';
               }
           }
       }
   });
   
   document.addEventListener('touchend', () => {
       if (pullDistance > threshold) {
           refreshData();
       }
       
       pullRefreshIndicator.style.transform = 'translateY(-100%)';
       pullRefreshIndicator.classList.remove('pull-refresh-active');
       startY = 0;
       pullDistance = 0;
   });
}

// Search Modal Functions
function openSearchModal() {
   searchModal.classList.remove('hidden');
   document.body.style.overflow = 'hidden';
   document.getElementById('locationFilter').focus();
}

function closeSearchModal() {
   searchModal.classList.add('hidden');
   document.body.style.overflow = '';
}

// Search Handler
function handleSearch(e) {
   e.preventDefault();
   
   const location = document.getElementById('locationFilter').value.toLowerCase();
   const houseType = document.getElementById('houseTypeFilter').value;
   const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
   const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;
   
   filteredProperties = propertiesData.filter(property => {
       const matchesLocation = !location || property.location.toLowerCase().includes(location);
       const matchesType = !houseType || property.houseType === houseType;
       const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
       
       return matchesLocation && matchesType && matchesPrice;
   });
   
   currentPage = 1;
   renderProperties();
   closeSearchModal();
   
   // Scroll to results
   document.getElementById('propertiesGrid').scrollIntoView({ behavior: 'smooth' });
}

// Sort Handler
function handleSort(e) {
   const sortBy = e.target.value;
   
   switch (sortBy) {
       case 'date':
           filteredProperties.sort((a, b) => new Date(b.dateUploaded) - new Date(a.dateUploaded));
           break;
       case 'price-low':
           filteredProperties.sort((a, b) => a.price - b.price);
           break;
       case 'price-high':
           filteredProperties.sort((a, b) => b.price - a.price);
           break;
       case 'rating':
           filteredProperties.sort((a, b) => b.rating - a.rating);
           break;
   }
   
   currentPage = 1;
   renderProperties();
}

// Render Properties
function renderProperties() {
   const startIndex = 0;
   const endIndex = currentPage * propertiesPerPage;
   const propertiesToShow = filteredProperties.slice(startIndex, endIndex);
   
   propertiesGrid.innerHTML = '';
   
   if (propertiesToShow.length === 0) {
       propertiesGrid.innerHTML = `
           <div class="col-span-full text-center py-20">
               <i class="fas fa-home text-6xl text-gray-300 mb-4"></i>
               <h3 class="text-2xl font-bold text-gray-600 mb-2">No Properties Found</h3>
               <p class="text-gray-500 mb-6">Try adjusting your search criteria</p>
               <button onclick="clearFilters()" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors">
                   Clear Filters
               </button>
           </div>
       `;
       loadMoreBtn.style.display = 'none';
       return;
   }
   
   propertiesToShow.forEach((property, index) => {
       const propertyCard = createPropertyCard(property, index);
       propertiesGrid.appendChild(propertyCard);
   });
   
   // Show/hide load more button
   if (endIndex >= filteredProperties.length) {
       loadMoreBtn.style.display = 'none';
   } else {
       loadMoreBtn.style.display = 'block';
   }
}

// Create Property Card
function createPropertyCard(property, index) {
   const card = document.createElement('div');
   card.className = 'property-card animate-scale-in';
   card.style.animationDelay = `${index * 0.1}s`;
   
   const starsHtml = generateStarsHtml(property.rating);
   const imagesHtml = generateImageSliderHtml(property.images, property.id);
   
   card.innerHTML = `
       <div class="image-slider" id="slider-${property.id}">
           ${imagesHtml}
           ${property.images.length > 1 ? `
               <button class="slider-controls prev" onclick="previousImage('${property.id}')">
                   <i class="fas fa-chevron-left"></i>
               </button>
               <button class="slider-controls next" onclick="nextImage('${property.id}')">
                   <i class="fas fa-chevron-right"></i>
               </button>
               <div class="slider-indicators">
                   ${property.images.map((_, i) => `
                       <div class="slider-dot ${i === 0 ? 'active' : ''}" onclick="goToImage('${property.id}', ${i})"></div>
                   `).join('')}
               </div>
           ` : ''}
       </div>
       
       <div class="p-6">
           <div class="flex justify-between items-start mb-3">
               <h3 class="text-xl font-bold text-gray-800 line-clamp-1">${property.tenantName}</h3>
               <div class="price-badge">
                   KSh ${property.price.toLocaleString()}
               </div>
           </div>
           
           <div class="flex items-center mb-3">
               <i class="fas fa-map-marker-alt text-accent mr-2"></i>
               <span class="location-badge">${property.location}</span>
           </div>
           
           <div class="flex justify-between items-center mb-4">
               <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                   ${property.houseType}
               </span>
               <div class="star-rating">
                   ${starsHtml}
                   <span class="text-sm text-gray-600 ml-2">(${property.rating})</span>
               </div>
           </div>
           
           <div class="flex justify-between items-center text-sm text-gray-500">
               <span>
                   <i class="fas fa-calendar mr-1"></i>
                   ${formatDate(property.dateUploaded)}
               </span>
               <span class="text-xs bg-gray-100 px-2 py-1 rounded">
                   ID: ${property.id}
               </span>
           </div>
       </div>
   `;
   
   card.addEventListener('click', () => {
       // Redirect to tenant's page (placeholder)
       window.location.href = `tenant.html?id=${property.id}`;
   });
   
   return card;
}

// Generate Image Slider HTML
function generateImageSliderHtml(images, propertyId) {
   return images.map((image, index) => `
       <img src="${image}" 
            alt="Property image ${index + 1}" 
            class="slider-image ${index === 0 ? 'active' : ''}"
            style="display: ${index === 0 ? 'block' : 'none'}"
            onerror="this.src='https://via.placeholder.com/400x240/f3f4f6/9ca3af?text=Image+Not+Available'">
   `).join('');
}

// Generate Stars HTML
function generateStarsHtml(rating) {
   const fullStars = Math.floor(rating);
   const hasHalfStar = rating % 1 !== 0;
   const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
   
   let starsHtml = '';
   
   for (let i = 0; i < fullStars; i++) {
       starsHtml += '<i class="fas fa-star star"></i>';
   }
   
   if (hasHalfStar) {
       starsHtml += '<i class="fas fa-star-half-alt star"></i>';
   }
   
   for (let i = 0; i < emptyStars; i++) {
       starsHtml += '<i class="far fa-star star empty"></i>';
   }
   
   return starsHtml;
}

// Image Slider Functions
function nextImage(propertyId) {
   const slider = document.getElementById(`slider-${propertyId}`);
   const images = slider.querySelectorAll('.slider-image');
   const indicators = slider.querySelectorAll('.slider-dot');
   
   let currentIndex = Array.from(images).findIndex(img => img.style.display === 'block');
   const nextIndex = (currentIndex + 1) % images.length;
   
   images[currentIndex].style.display = 'none';
   images[nextIndex].style.display = 'block';
   
   indicators[currentIndex].classList.remove('active');
   indicators[nextIndex].classList.add('active');
}

function previousImage(propertyId) {
   const slider = document.getElementById(`slider-${propertyId}`);
   const images = slider.querySelectorAll('.slider-image');
   const indicators = slider.querySelectorAll('.slider-dot');
   
   let currentIndex = Array.from(images).findIndex(img => img.style.display === 'block');
   const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
   
   images[currentIndex].style.display = 'none';
   images[prevIndex].style.display = 'block';
   
   indicators[currentIndex].classList.remove('active');
   indicators[prevIndex].classList.add('active');
}

function goToImage(propertyId, index) {
   const slider = document.getElementById(`slider-${propertyId}`);
   const images = slider.querySelectorAll('.slider-image');
   const indicators = slider.querySelectorAll('.slider-dot');
   
   images.forEach(img => img.style.display = 'none');
   indicators.forEach(dot => dot.classList.remove('active'));
   
   images[index].style.display = 'block';
   indicators[index].classList.add('active');
}

// Utility Functions
function formatDate(dateString) {
   const date = new Date(dateString);
   const now = new Date();
   const diffTime = Math.abs(now - date);
   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   
   if (diffDays === 1) return 'Today';
   if (diffDays === 2) return 'Yesterday';
   if (diffDays <= 7) return `${diffDays} days ago`;
   if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
   
   return date.toLocaleDateString('en-US', { 
       year: 'numeric', 
       month: 'short', 
       day: 'numeric' 
   });
}

function loadMoreProperties() {
   if (isLoading) return;
   
   isLoading = true;
   loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
   
   setTimeout(() => {
       currentPage++;
       renderProperties();
       isLoading = false;
       loadMoreBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Load More Properties';
   }, 1000);
}

function clearFilters() {
   document.getElementById('locationFilter').value = '';
   document.getElementById('houseTypeFilter').value = '';
   document.getElementById('minPrice').value = '';
   document.getElementById('maxPrice').value = '';
   
   filteredProperties = [...propertiesData];
   currentPage = 1;
   renderProperties();
}

function refreshData() {
   pullRefreshIndicator.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Refreshing...';
   
   setTimeout(() => {
       loadPropertiesData();
       pullRefreshIndicator.innerHTML = '<i class="fas fa-check mr-2"></i>Refreshed!';
       
       setTimeout(() => {
           pullRefreshIndicator.style.transform = 'translateY(-100%)';
       }, 1000);
   }, 2000);
}

// Auto-refresh every 5 minutes
setInterval(() => {
   if (!document.hidden) {
       loadPropertiesData();
   }
}, 300000);

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
       navigator.serviceWorker.register('/sw.js')
           .then(registration => console.log('SW registered'))
           .catch(error => console.log('SW registration failed'));
   });
}
                