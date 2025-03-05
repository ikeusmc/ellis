// CREATE LIGHTBOX ELEMENTS
const lightboxOverlay = document.createElement('div');
lightboxOverlay.classList.add('lightbox-overlay');
document.body.appendChild(lightboxOverlay);
// ADD AN IMAGE ELEMENT TO THE LIGHTBOX OVERLAY
const lightboxImage = document.createElement('img');
lightboxOverlay.appendChild(lightboxImage);
// FUNCTION TO SHOW LIGHTBOX WITH CLICKED IMAGE
document.addEventListener('click', (event) => {
	if (event.target.tagName === 'IMG') {
		lightboxImage.src = event.target.src;
		lightboxOverlay.style.display = 'flex'; // Show lightbox
	}
});
// FUNCTION TO HIDE LIGHTBOX WHEN CLICKED
lightboxOverlay.addEventListener('click', () => {
	lightboxOverlay.style.display = 'none';
});

// FUNCTION TO RESIZE IMAGE TO MATCH THE COMBINED HEIGHT OF ALL ELEMENTS WITHIN THE TEXT COLUMN
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

// RUN MATCHIMAGEHEIGHT ONCE THE WINDOW AND IMAGE HAVE FULLY LOADED
window.addEventListener('load', matchImageHeight);

// ENSURE MATCHIMAGEHEIGHT RUNS EACH TIME THE WINDOW IS RESIZED
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

// FUNCTION TO READ THE SCREEN WHEN BUTTON IS CLICKED
document.addEventListener("DOMContentLoaded", function () {
	let speech = new SpeechSynthesisUtterance();
	let isPaused = false;
	
	function getReadableText() {
		let elements = document.body.querySelectorAll("*:not(.skipTTS):not(.skipTTS *)");
		let textContent = "";
		elements.forEach(el => {
			if (!el.closest(".skipTTS")) textContent += el.innerText.trim() + " ";
		});
		return textContent.trim();
	}

	function addEventIfExists(id, event, handler) {
		const element = document.getElementById(id);
		if (element) element.addEventListener(event, handler);
	}

	addEventIfExists("readButton", "click", function () {
		if (speechSynthesis.speaking && !speechSynthesis.paused) return;
		speech.text = getReadableText();
		speech.lang = "en-US";
		speech.rate = 1.0;
		speech.onend = () => (isPaused = false);
		speechSynthesis.speak(speech);
	});

	addEventIfExists("pauseButton", "click", function () {
		if (speechSynthesis.speaking && !speechSynthesis.paused) {
			speechSynthesis.pause();
			isPaused = true;
		}
	});

	addEventIfExists("resumeButton", "click", function () {
		if (isPaused) {
			speechSynthesis.resume();
			isPaused = false;
		}
	});

	addEventIfExists("stopButton", "click", function () {
		if (speechSynthesis.speaking) {
			speechSynthesis.cancel();
			isPaused = false;
		}
	});
});

//INITALIZE THE SERVICE WORKER
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js') // Uses relative path
    .then(reg => console.log('Service Worker registered with scope:', reg.scope))
    .catch(err => console.error('Service Worker registration failed:', err));
}
// NOTIFICATION IF A NEW VERSION IS FOUND WHEN BACK ONLINE
window.addEventListener('load', () => {
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data === 'updateAvailable') {
            if (confirm("A new version is available. Reload?")) {
                window.location.reload();
            }
        }
    });
});
//CHECK FOR NEW VERSION WHEN BACK ON LINE
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
        .then(response => {
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, response.clone());
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => client.postMessage('updateAvailable'));
                });
                return response;
            });
        })
        .catch(() => caches.match(event.request))
    );
});
