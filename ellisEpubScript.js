// Create lightbox elements
const lightboxOverlay = document.createElement('div');
lightboxOverlay.classList.add('lightbox-overlay');
document.body.appendChild(lightboxOverlay);
// Add an image element to the lightbox overlay
const lightboxImage = document.createElement('img');
lightboxOverlay.appendChild(lightboxImage);
// Function to show lightbox with clicked image
document.addEventListener('click', (event) => {
	if (event.target.tagName === 'IMG') {
		lightboxImage.src = event.target.src;
		lightboxOverlay.style.display = 'flex'; // Show lightbox
	}
});
// Function to hide lightbox when clicked
lightboxOverlay.addEventListener('click', () => {
	lightboxOverlay.style.display = 'none';
});

// Function to resize image to match the combined height of all elements within the text column
function matchImageHeight() {
	const textColumn = document.querySelector('.text-guided-row .column-text');
	const imageElement = document.querySelector('.text-guided-row .column-image img');
	if (textColumn && imageElement) {
		// Calculate the combined height of all direct child elements within the text column
		const textElements = Array.from(textColumn.children);
		let totalTextHeight = 0;
		textElements.forEach(element => {
			totalTextHeight += element.offsetHeight;
		});
		// Reset image dimensions for calculation
		imageElement.style.height = 'auto';
		imageElement.style.width = 'auto';
		// Set the image height to match the total height of the text elements
		imageElement.style.height = `${totalTextHeight}px`;
		// Check if the image width now exceeds its container's width
		if (imageElement.offsetWidth > imageElement.parentElement.offsetWidth) {
			// If too wide, set width to 100% and adjust height to maintain aspect ratio
			imageElement.style.width = '100%';
			imageElement.style.height = 'auto';
		}
	}
}

// Run matchImageHeight once the window and image have fully loaded
window.addEventListener('load', matchImageHeight);

// Ensure matchImageHeight runs each time the window is resized
window.addEventListener('resize', matchImageHeight);

// Ensure matchImageHeight runs when the image itself has loaded
//CHECK THIS, SEE WHY IT'S NOT WORKING
//document.querySelector('.text-guided-row .column-image img').addEventListener('load', matchImageHeight);

//REMOVE THE LOADING SCREEN WHEN EVERYTHING IS LOADED
window.addEventListener('DOMContentLoaded', () => {
	console.log("DOM fully loaded");
	// Check for all images to load
	Promise.all(
	Array.from(document.images).map(img => {
		if (!img.complete) {
			return new Promise(resolve => {
				img.onload = resolve;
				img.onerror = resolve; // Resolve even if an image fails to load
			});
		}
		return Promise.resolve(); // Resolve immediately if the image is already loaded
	})
	).then(() => {
		console.log("All images loaded");
		const loadingScreen = document.getElementById('loading-screen');
		if (loadingScreen) {
			loadingScreen.style.display = "none"; // Hide loading screen
		} else {
			console.warn("Loading screen element not found");
		}
	}).catch(err => {
		console.error("Error during image loading:", err);
	});
});

function scrollToNext() {
	document.getElementById("next-section").scrollIntoView({ behavior: "smooth" });
}