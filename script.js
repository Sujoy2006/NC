// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Navigation active state
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // BMI Calculator functionality
    const calculateBtn = document.getElementById('calculate-btn');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    const bmiDescription = document.getElementById('bmi-description');

    calculateBtn.addEventListener('click', function() {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        
        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            alert('Please enter valid height and weight values');
            return;
        }
        
        // BMI formula: weight (kg) / (height (m))²
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        const roundedBmi = bmi.toFixed(1);
        
        bmiValue.textContent = roundedBmi;
        
        // Determine BMI category
        let category, description, color;
        
        if (bmi < 18.5) {
            category = 'Underweight';
            description = 'You are in the underweight range. Consider consulting with a nutritionist about healthy ways to gain weight.';
            color = '#3498db';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal Weight';
            description = 'You are in the healthy weight range. Maintain a balanced diet and regular exercise.';
            color = '#27ae60';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            description = 'You are in the overweight range. Consider adopting healthier eating habits and increasing physical activity.';
            color = '#f39c12';
        } else {
            category = 'Obese';
            description = 'You are in the obese range. It is recommended to consult with healthcare professionals for personalized advice.';
            color = '#e74c3c';
        }
        
        bmiCategory.textContent = category;
        bmiDescription.textContent = description;
        bmiValue.style.color = color;
        bmiCategory.style.color = color;
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // In a real application, you would send this data to a server
            alert(`Thank you for your message, ${name}! We will get back to you soon.`);
            contactForm.reset();
        });
    }

    // Add animation on scroll
    const animateOnScroll = function() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('visible');
            }
        });
    };
    
    // Initial check and add event listener
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});