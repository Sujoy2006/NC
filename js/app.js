// Sample data for meals
const meals = [
    {
        id: 1,
        name: 'Grilled Chicken',
        description: 'Grilled chicken breast with mixed vegetables and rice',
        image: 'images/meals/grilled-chicken.jpg',
        dietaryRequirements: ['diabetes', 'cardiac', 'recovery', 'low-sodium'],
        nutrition: {
            calories: 320,
            protein: 28,
            carbs: 30,
            fat: 10
        }
    },
    {
        id: 2,
        name: 'Vegetable Stir Fry',
        description: 'Mixed vegetables stir-fried with tofu in a light soy sauce',
        image: 'images/meals/vegetable-stir-fry.jpg',
        dietaryRequirements: ['diabetes', 'cardiac', 'maternity', 'vegetarian', 'vegan'],
        nutrition: {
            calories: 280,
            protein: 15,
            carbs: 35,
            fat: 8
        }
    },
    {
        id: 3,
        name: 'Salmon Salad',
        description: 'Grilled salmon fillet on a bed of mixed greens with light dressing',
        image: 'images/meals/salmon-salad.jpg',
        dietaryRequirements: ['diabetes', 'cardiac', 'low-sodium', 'gluten-free'],
        nutrition: {
            calories: 350,
            protein: 25,
            carbs: 15,
            fat: 20
        }
    },
    {
        id: 4,
        name: 'Turkey Meatloaf',
        description: 'Lean turkey meatloaf with sweet potato mash and steamed broccoli',
        image: 'images/meals/turkey-meatloaf.jpg',
        dietaryRequirements: ['recovery', 'low-sodium'],
        nutrition: {
            calories: 380,
            protein: 30,
            carbs: 40,
            fat: 12
        }
    },
    {
        id: 5,
        name: 'Quinoa Bowl',
        description: 'Protein-rich quinoa with roasted vegetables and chickpeas',
        image: 'images/meals/quinoa-bowl.jpg',
        dietaryRequirements: ['diabetes', 'cardiac', 'vegetarian', 'vegan', 'gluten-free'],
        nutrition: {
            calories: 310,
            protein: 12,
            carbs: 45,
            fat: 9
        }
    },
    {
        id: 6,
        name: 'Lentil Soup',
        description: 'Hearty lentil soup with vegetables and whole grain bread',
        image: 'images/meals/lentil-soup.jpg',
        dietaryRequirements: ['cardiac', 'maternity', 'vegetarian', 'vegan'],
        nutrition: {
            calories: 250,
            protein: 15,
            carbs: 40,
            fat: 5
        }
    }
];

// Sample data for patients (for dietitian dashboard)
const patients = [
    {
        id: 1,
        name: 'John Smith',
        age: 45,
        room: '203A',
        dietaryRequirements: ['diabetes', 'low-sodium'],
        stats: {
            calories: 1800,
            protein: 90,
            hydration: '70%'
        }
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        age: 32,
        room: '115B',
        dietaryRequirements: ['maternity', 'vegetarian'],
        stats: {
            calories: 2200,
            protein: 75,
            hydration: '85%'
        }
    },
    {
        id: 3,
        name: 'Robert Davis',
        age: 68,
        room: '310C',
        dietaryRequirements: ['cardiac', 'low-sodium'],
        stats: {
            calories: 1600,
            protein: 80,
            hydration: '60%'
        }
    }
];

// Global variables
let selectedRole = null;
let selectedDietaryRequirements = [];
let filteredMeals = [];
let selectedMeal = null;

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Role selection
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            selectedRole = this.getAttribute('data-role');
            navigateToScreen(selectedRole);
        });
    });

    // Back buttons
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentScreen = this.closest('.screen');
            const screenId = currentScreen.id;
            
            if (screenId === 'meal-selection-screen' || screenId === 'dietitian-dashboard') {
                showRoleSelection();
            } else if (screenId === 'dietary-requirements-screen') {
                showScreen('meal-selection-screen');
            }
        });
    });

    // Filter button
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            showScreen('dietary-requirements-screen');
        });
    }

    // Apply dietary filters button
    const applyDietaryBtn = document.getElementById('apply-dietary-btn');
    if (applyDietaryBtn) {
        applyDietaryBtn.addEventListener('click', function() {
            applyDietaryFilters();
            showScreen('meal-selection-screen');
        });
    }

    // Dietary option selection
    const dietaryOptions = document.querySelectorAll('.dietary-option');
    dietaryOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('selected');
            const requirement = this.getAttribute('data-requirement');
            
            if (this.classList.contains('selected')) {
                if (!selectedDietaryRequirements.includes(requirement)) {
                    selectedDietaryRequirements.push(requirement);
                }
            } else {
                selectedDietaryRequirements = selectedDietaryRequirements.filter(req => req !== requirement);
            }
        });
    });

    // Meal search
    const mealSearch = document.getElementById('meal-search');
    if (mealSearch) {
        mealSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterMealsBySearch(searchTerm);
        });
    }

    // Star rating
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            updateStarRating(rating);
        });

        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });

        star.addEventListener('mouseout', function() {
            resetStarHighlight();
        });
    });

    // Submit rating button
    const submitRatingBtn = document.getElementById('submit-rating-btn');
    if (submitRatingBtn) {
        submitRatingBtn.addEventListener('click', function() {
            showNotification('Thank you for your feedback!');
            setTimeout(() => {
                showRoleSelection();
            }, 2000);
        });
    }

    // Dietitian dashboard tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Add meal button
    const addMealBtn = document.getElementById('add-meal-btn');
    if (addMealBtn) {
        addMealBtn.addEventListener('click', function() {
            showModal('add-meal-modal');
        });
    }

    // Close modal button
    const closeModalBtn = document.querySelector('.close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            hideModal('add-meal-modal');
        });
    }

    // Add meal form submission
    const addMealForm = document.getElementById('add-meal-form');
    if (addMealForm) {
        addMealForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewMeal();
            hideModal('add-meal-modal');
            showNotification('New meal added successfully!');
        });
    }

    // Initialize the app
    initializeApp();
});

// Functions
function initializeApp() {
    // Create placeholder images folder and logo
    createPlaceholderImages();
    
    // Populate meals
    populateMeals(meals);
    
    // Populate dietitian dashboard
    populateDietitianDashboard();
    
    // Initialize charts if Chart.js is loaded
    if (typeof Chart !== 'undefined') {
        initializeCharts();
    }
}

function createPlaceholderImages() {
    // This function would normally create or ensure the existence of placeholder images
    // In a real app, you would have actual image files
    console.log('Placeholder images would be created here in a real app');
}

function navigateToScreen(role) {
    if (role === 'patient' || role === 'visitor' || role === 'staff') {
        showScreen('meal-selection-screen');
        filteredMeals = [...meals];
        populateMeals(filteredMeals);
    } else if (role === 'dietitian') {
        showScreen('dietitian-dashboard');
    }
}

function showRoleSelection() {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });
    
    // Reset selections
    selectedRole = null;
    selectedDietaryRequirements = [];
    selectedMeal = null;
    
    // Reset dietary options UI
    const dietaryOptions = document.querySelectorAll('.dietary-option');
    dietaryOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Reset star rating
    resetStarRating();
}

function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });
    
    // Show the requested screen
    const screenToShow = document.getElementById(screenId);
    if (screenToShow) {
        screenToShow.style.display = 'block';
    }
}

function populateMeals(mealsToShow) {
    const mealsContainer = document.querySelector('.meals-container');
    if (!mealsContainer) return;
    
    mealsContainer.innerHTML = '';
    
    if (mealsToShow.length === 0) {
        mealsContainer.innerHTML = '<p class="no-meals">No meals match your criteria. Please adjust your filters.</p>';
        return;
    }
    
    mealsToShow.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';
        mealCard.setAttribute('data-meal-id', meal.id);
        
        // Create HTML for dietary requirement tags
        let tagsHTML = '';
        if (meal.dietaryRequirements && meal.dietaryRequirements.length > 0) {
            tagsHTML = '<div class="meal-tags">';
            meal.dietaryRequirements.slice(0, 3).forEach(req => {
                tagsHTML += `<span class="meal-tag">${formatRequirementName(req)}</span>`;
            });
            if (meal.dietaryRequirements.length > 3) {
                tagsHTML += `<span class="meal-tag">+${meal.dietaryRequirements.length - 3} more</span>`;
            }
            tagsHTML += '</div>';
        }
        
        // Create HTML for nutritional info
        const nutritionHTML = `
            <div class="nutritional-info">
                <div class="nutrient">
                    <div class="nutrient-value">${meal.nutrition.calories}</div>
                    <div class="nutrient-label">Calories</div>
                </div>
                <div class="nutrient">
                    <div class="nutrient-value">${meal.nutrition.protein}g</div>
                    <div class="nutrient-label">Protein</div>
                </div>
                <div class="nutrient">
                    <div class="nutrient-value">${meal.nutrition.carbs}g</div>
                    <div class="nutrient-label">Carbs</div>
                </div>
                <div class="nutrient">
                    <div class="nutrient-value">${meal.nutrition.fat}g</div>
                    <div class="nutrient-label">Fat</div>
                </div>
            </div>
        `;
        
        mealCard.innerHTML = `
            <img src="${meal.image}" alt="${meal.name}" class="meal-image">
            <div class="meal-info">
                <h3>${meal.name}</h3>
                <p>${meal.description}</p>
                ${tagsHTML}
                ${nutritionHTML}
            </div>
        `;
        
        mealCard.addEventListener('click', function() {
            selectMeal(meal);
        });
        
        mealsContainer.appendChild(mealCard);
    });
}

function formatRequirementName(requirement) {
    // Convert kebab-case to Title Case
    return requirement
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function applyDietaryFilters() {
    if (selectedDietaryRequirements.length === 0) {
        filteredMeals = [...meals];
    } else {
        filteredMeals = meals.filter(meal => {
            return selectedDietaryRequirements.every(req => 
                meal.dietaryRequirements && meal.dietaryRequirements.includes(req)
            );
        });
    }
    
    populateMeals(filteredMeals);
}

function filterMealsBySearch(searchTerm) {
    if (!searchTerm) {
        populateMeals(filteredMeals);
        return;
    }
    
    const searchResults = filteredMeals.filter(meal => {
        return (
            meal.name.toLowerCase().includes(searchTerm) ||
            meal.description.toLowerCase().includes(searchTerm)
        );
    });
    
    populateMeals(searchResults);
}

function selectMeal(meal) {
    selectedMeal = meal;
    
    // Update order confirmation screen
    document.getElementById('confirmed-meal-image').src = meal.image;
    document.getElementById('confirmed-meal-name').textContent = meal.name;
    document.getElementById('confirmed-meal-description').textContent = meal.description;
    
    // Set delivery time (current time + 30 minutes)
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('delivery-time').textContent = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    // Show order confirmation screen
    showScreen('order-confirmation-screen');
}

function updateStarRating(rating) {
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        }
    });
}

function resetStarHighlight() {
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach(star => {
        const isFilled = star.classList.contains('fas');
        if (!isFilled) {
            star.className = 'far fa-star';
        }
    });
}

function resetStarRating() {
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach(star => {
        star.className = 'far fa-star';
    });
}

function switchTab(tabName) {
    // Update active tab button
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        if (button.getAttribute('data-tab') === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Show active tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    const activeContent = document.getElementById(`${tabName}-content`);
    if (activeContent) {
        activeContent.style.display = 'block';
    }
}

function populateDietitianDashboard() {
    // Populate meals list
    const mealsList = document.querySelector('.meals-list');
    if (mealsList) {
        mealsList.innerHTML = '';
        
        meals.forEach(meal => {
            const mealItem = document.createElement('div');
            mealItem.className = 'meal-list-item';
            mealItem.innerHTML = `
                <img src="${meal.image}" alt="${meal.name}">
                <div class="meal-list-info">
                    <h3>${meal.name}</h3>
                    <p>${meal.description.substring(0, 50)}${meal.description.length > 50 ? '...' : ''}</p>
                </div>
                <div class="meal-list-actions">
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;
            mealsList.appendChild(mealItem);
        });
    }
    
    // Populate patients list
    const patientsList = document.querySelector('.patients-list');
    if (patientsList) {
        patientsList.innerHTML = '';
        
        patients.forEach(patient => {
            const patientProfile = document.createElement('div');
            patientProfile.className = 'patient-profile';
            
            // Create HTML for dietary requirement tags
            let tagsHTML = '';
            if (patient.dietaryRequirements && patient.dietaryRequirements.length > 0) {
                tagsHTML = '<div class="meal-tags">';
                patient.dietaryRequirements.forEach(req => {
                    tagsHTML += `<span class="meal-tag">${formatRequirementName(req)}</span>`;
                });
                tagsHTML += '</div>';
            }
            
            patientProfile.innerHTML = `
                <div class="patient-header">
                    <div class="patient-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <div class="patient-name">${patient.name}</div>
                        <div class="patient-details">Age: ${patient.age} | Room: ${patient.room}</div>
                        ${tagsHTML}
                    </div>
                </div>
                <div class="patient-stats">
                    <div class="stat-card">
                        <div class="stat-value">${patient.stats.calories}</div>
                        <div class="stat-label">Daily Calories</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${patient.stats.protein}g</div>
                        <div class="stat-label">Protein</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${patient.stats.hydration}</div>
                        <div class="stat-label">Hydration</div>
                    </div>
                </div>
                <div class="meal-plan-section">
                    <div class="meal-plan-header">
                        <div class="meal-plan-title">Today's Meal Plan</div>
                        <div class="meal-plan-date">${getCurrentDate()}</div>
                    </div>
                    <div class="meal-time-section">
                        <div class="meal-time-header">Breakfast</div>
                        <div class="meal-card" style="margin-bottom: 10px;">
                            <div class="meal-info">
                                <h3>Oatmeal with Fruit</h3>
                                <p>Steel-cut oats with fresh berries and honey</p>
                            </div>
                        </div>
                    </div>
                    <div class="meal-time-section">
                        <div class="meal-time-header">Lunch</div>
                        <div class="meal-card" style="margin-bottom: 10px;">
                            <div class="meal-info">
                                <h3>${meals[0].name}</h3>
                                <p>${meals[0].description}</p>
                            </div>
                        </div>
                    </div>
                    <div class="meal-time-section">
                        <div class="meal-time-header">Dinner</div>
                        <div class="meal-card">
                            <div class="meal-info">
                                <h3>${meals[2].name}</h3>
                                <p>${meals[2].description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            patientsList.appendChild(patientProfile);
        });
    }
}

function getCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString('en-US', options);
}

function initializeCharts() {
    // Popular Meals Chart
    const popularMealsCtx = document.getElementById('popular-meals-chart');
    if (popularMealsCtx) {
        new Chart(popularMealsCtx, {
            type: 'bar',
            data: {
                labels: ['Grilled Chicken', 'Vegetable Stir Fry', 'Salmon Salad', 'Turkey Meatloaf', 'Quinoa Bowl'],
                datasets: [{
                    label: 'Orders This Week',
                    data: [42, 38, 35, 30, 25],
                    backgroundColor: '#27ae60'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Dietary Requirements Chart
    const dietaryChartCtx = document.getElementById('dietary-chart');
    if (dietaryChartCtx) {
        new Chart(dietaryChartCtx, {
            type: 'pie',
            data: {
                labels: ['Diabetes', 'Cardiac', 'Low Sodium', 'Vegetarian', 'Gluten Free', 'Other'],
                datasets: [{
                    data: [25, 20, 15, 15, 10, 15],
                    backgroundColor: ['#27ae60', '#2ecc71', '#6fcf97', '#219653', '#1e8449', '#145a32']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Ratings Chart
    const ratingsChartCtx = document.getElementById('ratings-chart');
    if (ratingsChartCtx) {
        new Chart(ratingsChartCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Average Rating',
                    data: [4.2, 4.3, 4.1, 4.4, 4.5, 4.3, 4.6],
                    borderColor: 'var(--primary-color)',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        min: 3.5,
                        max: 5
                    }
                }
            }
        });
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function addNewMeal() {
    // Get form values
    const name = document.getElementById('meal-name').value;
    const description = document.getElementById('meal-description').value;
    const image = document.getElementById('meal-image').value;
    const calories = parseInt(document.getElementById('meal-calories').value);
    const protein = parseInt(document.getElementById('meal-protein').value);
    const carbs = parseInt(document.getElementById('meal-carbs').value);
    const fat = parseInt(document.getElementById('meal-fat').value);
    
    // Get selected dietary requirements
    const dietaryRequirements = [];
    const checkboxes = document.querySelectorAll('.checkbox-group input:checked');
    checkboxes.forEach(checkbox => {
        dietaryRequirements.push(checkbox.value);
    });
    
    // Create new meal object
    const newMeal = {
        id: meals.length + 1,
        name,
        description,
        image,
        dietaryRequirements,
        nutrition: {
            calories,
            protein,
            carbs,
            fat
        }
    };
    
    // Add to meals array
    meals.push(newMeal);
    
    // Update UI
    populateDietitianDashboard();
    
    // Reset form
    document.getElementById('add-meal-form').reset();
}

function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}