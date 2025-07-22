# YouTube Daily Uploads Viewer

This project is a simple web application that allows you to track and view the videos uploaded yesterday by your favorite YouTube channels. You can add channels by their name or ID, and the application will fetch and display the videos published on the previous day.

## Features

* **Add Channels:** Easily add YouTube channels to your subscribed list by entering their name or Channel ID.
* **Remove Channels:** Remove channels from your list if you no longer wish to track them.
* **View Yesterday's Uploads:** Click a button to fetch and display all videos uploaded yesterday by the channels in your list.
* **Persistent Storage:** Your subscribed channels are saved in your browser's local storage, so they'll be there when you revisit the page.
* **Direct Video Links:** Click on a video card to open the video directly on YouTube.

## Technologies Used

* **HTML5:** For the basic structure of the web page.
* **CSS3:** For styling and layout.
* **JavaScript (ES6+):** For dynamic functionality, interacting with the YouTube Data API, and managing local storage.
* **YouTube Data API v3:** To fetch channel information and video uploads.

## Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository (or create the files manually):**
    If you have a Git repository, clone it:
    ```bash
    git clone <your-repository-url>
    cd yt_recap_project
    ```
    Otherwise, create three files in a new folder: `index.html`, `styles.css`, and `script.js`.

2.  **Add your YouTube Data API Key:**
    * Go to the [Google Cloud Console](https://console.cloud.google.com/).
    * Create a new project or select an existing one.
    * Navigate to "APIs & Services" > "Library" and enable the "YouTube Data API v3".
    * Go to "APIs & Services" > "Credentials" and create new API credentials (an API key).
    * **Important:** Restrict your API key to prevent unauthorized use.

    Open the `script.js` file and replace `'YOUR_API_KEY_HERE'` with your actual API key:

    ```javascript
    const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
    ```

3.  **Open `index.html`:**
    Simply open the `index.html` file in your web browser. You can do this by double-clicking the file or by right-clicking and choosing "Open with" your preferred browser.

## Usage

1.  **Add Channels:**
    * In the "Add Channel" input field, type the name of a YouTube channel (e.g., "PewDiePie") or its Channel ID (e.g., `UC-lHJZR3GqXM2R8_l9F1gWw`).
    * Click the "Add Channel" button. The channel will appear in the "Subscribed Channels" list.

2.  **Remove Channels:**
    * To remove a channel, click the "Remove" button next to its name in the "Subscribed Channels" list.

3.  **Search Yesterday's Videos:**
    * Click the "Search Yesterday's Videos" button.
    * The application will fetch and display all videos uploaded yesterday by the channels in your subscribed list.
    * If no videos are found, a message will indicate this.

4.  **View Videos:**
    * Click on any video card in the results section to open that video directly on YouTube in a new tab.
