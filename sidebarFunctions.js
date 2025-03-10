// FUNCTION TO TOGGLE THE SIDEBAR
function toggleSidebar() {
	const sidebar = document.getElementById('sidebar');
	sidebar.classList.toggle('open');
	console.log("ToggleSidebar Called");
}
document.addEventListener("DOMContentLoaded", function () {
	function getLanguageCode() {
		const fileName = window.location.pathname.split("/").pop().split(".")[0]; // Get the filename without extension
		const fileParts = fileName.split("_"); // Split by underscore
		return fileParts.length > 1 ? fileParts[1] : "en"; // Extract language if available, default to "en"
	}

	function loadSidebar(languageCode) {
		const sidebarFileName = `sidebar_${languageCode}.html`;
		fetch(sidebarFileName)
			.then(response => {
				if (!response.ok) throw new Error(`Failed to fetch ${sidebarFileName}`);
				return response.text();
			})
			.then(data => {
				const sidebar = document.getElementById("sidebar");
				if (sidebar) {
					sidebar.innerHTML = data;
					loadLanguageList(languageCode);
				}
			})
			.catch(error => console.error(error));
	}

	function loadLanguageList(currentLanguage) {
		fetch("languageList.html")
			.then(response => {
				if (!response.ok) throw new Error("Failed to fetch languageList.html");
				return response.text();
			})
			.then(data => {
				const tempDiv = document.createElement("div");
				tempDiv.innerHTML = data;
				const options = tempDiv.querySelectorAll("option");
				const languageSelect = document.querySelector("#sidebar #languageSelect");
				if (languageSelect) {
					languageSelect.innerHTML = "";
					options.forEach(option => {
						const langValue = option.getAttribute("lang");
						if (langValue) {
							const baseFile = window.location.pathname.split("/").pop().split("_")[0]; // Get base file name
							const localFile = `${baseFile}_${langValue}.html`; // Construct new filename
							option.setAttribute("data-link", localFile);
						}
						languageSelect.appendChild(option.cloneNode(true));
					});
					languageSelect.value = currentLanguage;
					languageSelect.addEventListener("change", function () {
						const selectedOption = languageSelect.options[languageSelect.selectedIndex];
						const fileLink = selectedOption.getAttribute("data-link");
						if (fileLink) window.location.replace(fileLink); // Redirect to local file
					});
				}
			})
			.catch(error => console.error(error));
	}

	const languageCode = getLanguageCode();
	loadSidebar(languageCode);
});
