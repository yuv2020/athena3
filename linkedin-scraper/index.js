// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function crawlLinkedIn(url) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     // Set User-Agent
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

//     try {
//         await page.goto(url, { waitUntil: 'networkidle2' });

//         // Wait for the main elements to load
//         await page.waitForSelector('h1'); // Adjust based on your DOM structure

//         // Extract data
//         const profileData = await page.evaluate(() => {
//             let data = {};
//             data.name = document.querySelector('h1')?.innerText || null;
//             data.jobTitle = document.querySelector('.text-body-medium')?.innerText || null;
//             data.location = document.querySelector('.text-body-small')?.innerText || null;
//             data.summary = document.querySelector('.pv-about-section')?.innerText || null;
//             return data;
//         });

//         console.log(profileData);

//         // Save data to JSON file
//         fs.writeFileSync('data.json', JSON.stringify(profileData, null, 2));
//     } catch (error) {
//         console.error('Error occurred while crawling:', error);
//     } finally {
//         await browser.close();
//     }
// }

// // Run the function with a sample LinkedIn public profile URL
// crawlLinkedIn('https://www.linkedin.com/in/ritik-vishwakarma-294282299/');




















const puppeteer = require('puppeteer');
const fs = require('fs');

async function crawlLinkedInProfiles(urls) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    let allProfilesData = [];

    try {
        for (const url of urls) {
            try {
                console.log(`Scraping: ${url}`);
                await page.goto(url, { waitUntil: 'networkidle2' });

                // Wait for the main elements to load
                await page.waitForSelector('h1'); // Adjust based on your DOM structure

                // Extract data
                const profileData = await page.evaluate(() => {
                    let data = {};
                    data.name = document.querySelector('h1')?.innerText || null;
                    data.jobTitle = document.querySelector('.text-body-medium')?.innerText || null;
                    data.location = document.querySelector('.text-body-small')?.innerText || null;
                    data.summary = document.querySelector('.pv-about-section')?.innerText || null;
                    return data;
                });

                console.log(profileData);

                // Add data to the array
                allProfilesData.push({ url, ...profileData });

            } catch (innerError) {
                console.error(`Error scraping ${url}:`, innerError);
                allProfilesData.push({ url, error: innerError.message });
            }
        }

        // Save all data to JSON file
        fs.writeFileSync('data.json', JSON.stringify(allProfilesData, null, 2));
        console.log('Scraping completed. Data saved to data.json.');
    } catch (error) {
        console.error('Error occurred while crawling:', error);
    } finally {
        await browser.close();
    }
}

// Array of LinkedIn public profile URLs
const profileUrls = [
    'https://www.linkedin.com/in/ritik-vishwakarma-294282299/',
    'https://www.linkedin.com/in/ritik-tiwari-/',
    'https://www.linkedin.com/in/prashasti-gupta-b8645026a/', 
    'https://www.linkedin.com/in/yuvrajtomr/' // Add more URLs as needed
];

// Run the function with multiple LinkedIn public profile URLs
crawlLinkedInProfiles(profileUrls);
