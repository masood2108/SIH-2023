// Smooth scroll to section when a navigation link is clicked
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        window.scrollTo({
            top: targetElement.offsetTop - 50, // Adjust as needed
            behavior: 'smooth'
        });
    });
});

// Example: Toggle a class when a button is clicked
document.getElementById('magnetometer-button').addEventListener('click', function () {
    // Toggle the 'active' class on the button
    this.classList.toggle('active');

    // Add or remove content based on the button state
    const instrumentInfo = document.getElementById('instrument-info');
    if (this.classList.contains('active')) {
        instrumentInfo.innerHTML = `
            <h2>Magnetometers</h2>
            <p>Magnetometers are instruments used to measure the strength and direction of magnetic fields. In our project, we use magnetometers to...</p>
            <!-- Add more detailed information here -->
        `;
    } else {
        // Reset the content when the button is clicked again
        instrumentInfo.innerHTML = `
            <h2>Welcome to the Instrument Information Page</h2>
            <p>Select an instrument to learn more about it.</p>
        `;
    }
});
// Show the loader
document.getElementById("loader-container").style.display = "block";

// Simulate an asynchronous task (replace with your actual loading logic)
setTimeout(function() {
  // Hide the loader when the task is complete
  document.getElementById("loader-container").style.display = "none";
}, 3000); // Simulated loading time: 3 seconds

