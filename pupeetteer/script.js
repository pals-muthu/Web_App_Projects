const puppeteer = require('puppeteer');

(async () => {
	// Launch the Firefox browser
	const browser = await puppeteer.launch({
		headless: false,
		product: 'firefox',
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});

	const page = await browser.newPage();

	// Function to wait until Firefox has finished installing components
	const waitForFirefoxSetup = async (page, retries = 5) => {
		for (let i = 0; i < retries; i++) {
			try {
				await page.goto('https://music.amazon.in/my/songs', { waitUntil: 'networkidle2' });
				return; // If navigation is successful, exit the function
			} catch (error) {
				console.log(`Retrying navigation (${i + 1}/${retries})...`);
				await new Promise((res) => setTimeout(res, 5000)); // Wait for 5 seconds before retrying
			}
		}
		throw new Error('Failed to navigate to the page after multiple attempts');
	};

	// Wait for Firefox to finish setting up
	await waitForFirefoxSetup(page);

	// Function to check checkboxes and scroll
	const checkCheckboxesAndScroll = async () => {
		let previousHeight;
		while (true) {
			// Select all music-checkbox elements and check them
			await page.evaluate(() => {
				let musicCheckboxes = document.querySelectorAll('music-checkbox');
				musicCheckboxes.forEach((checkbox) => {
					checkbox.setAttribute('checked', '');
				});
			});

			// Scroll down to the bottom of the page
			previousHeight = await page.evaluate('document.body.scrollHeight');
			await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');

			// Wait for new elements to load
			await page.waitForTimeout(2000);

			// Calculate new scroll height and check if it's the same as previous height
			let newHeight = await page.evaluate('document.body.scrollHeight');
			if (newHeight === previousHeight) {
				break; // Exit the loop if no more new content is loaded
			}
		}
	};

	// Run the function to check checkboxes and scroll
	await checkCheckboxesAndScroll();

	// Optional: close the browser after some delay
	// setTimeout(() => browser.close(), 5000);
})();
