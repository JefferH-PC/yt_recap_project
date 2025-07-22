const API_KEY = 'YOUR_API_KEY_HERE';

const channelNameInput = document.getElementById('channelName');
const addChannelBtn = document.getElementById('addChannelBtn');
const channelListUl = document.getElementById('channelList');
const searchVideosBtn = document.getElementById('searchVideosBtn');
const videosResultsDiv = document.getElementById('videoResults');

let channels = JSON.parse(localStorage.getItem('youtubeChannels')) || [];

function saveChannels() {
    localStorage.setItem('youtubeChannels', JSON.stringify(channels));
}

function displayChannels() {
    channelListUl.innerHTML = '';
    if (channels.length === 0) {
        channelListUl.innerHTML = '<li class="no-content">No channels added yet.</li>';
        return;
    }
    channels.forEach((channel, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="channelName">${channel.name}</span>
            <button data-index="${index}" class="removeBtn">Remove</button>
        `;
        channelListUl.appendChild(li);
    });
}

async function addChannel() {
    const input = channelNameInput.value.trim();
    if (!input) {
        alert('Please enter a channel name or ID');
        return;
    }

    let channelID = input;
    let channelName = input;

    if (!input.startsWith('UC') || input.length !== 24) {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(input)}&type=channel&key=${API_KEY}`);
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const firstResult = data.items[0];
                channelID = firstResult.id.channelId;
                channelName = firstResult.snippet.channelTitle;
            } else {
                alert('Could not find a channel with that name.');
                return;
            }
        } catch (error) {
            console.error('Error searching for channel:', error);
            alert('Error searching for channel.');
            return;
        }
    } else {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelID}&key=${API_KEY}`);
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                channelName = data.items[0].snippet.title;
            } else {
                alert('Invalid channel ID.');
                return;
            }
        } catch (error) {
            console.error('Error fetching channel details:', error);
            alert('Error fetching channel details.');
            return;
        }
    }

    if (channels.some(channel => channel.id === channelID)) {
        alert('This channel is already in your list!');
        return;
    }

    channels.push({ id: channelID, name: channelName });
    saveChannels();
    displayChannels();
    channelNameInput.value = '';
}

function removeChannel(event) {
    if (event.target.tagName === 'BUTTON') {
        const index = parseInt(event.target.dataset.index);
        channels.splice(index, 1);
        saveChannels();
        displayChannels();
    }
}

function getYesterdayDate() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday.toISOString();
}

async function searchDailyVideos() {
    videosResultsDiv.innerHTML = '<h2>Loading videos...</h2>';

    const publishedAfter = getYesterdayDate();
    const allVideos = [];
    const uniqueVideoIds = new Set();

    if (channels.length === 0) {
        videosResultsDiv.innerHTML = '<p class="no-content">Please add some YouTube channels first.</p>';
        return;
    }

    for (const channel of channels) {
        try {
            const channelDetailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channel.id}&key=${API_KEY}`);
            const channelDetailsData = await channelDetailsResponse.json();
            if (channelDetailsData.items && channelDetailsData.items.length > 0) {
                const uploadsPlaylistId = channelDetailsData.items[0].contentDetails.relatedPlaylists.uploads;
                let nextPageToken = null;
                let pageCount = 0;
                const maxPages = 10;

                while (pageCount < maxPages) {
                    const playlistItemsResponse = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`);
                    const playlistItemsData = await playlistItemsResponse.json();

                    if (playlistItemsData.items) {
                        for (const item of playlistItemsData.items) {
                            const publishedAt = new Date(item.snippet.publishedAt);
                            const yesterdayDate = new Date(getYesterdayDate());
                            if (publishedAt.toDateString() === yesterdayDate.toDateString()) {
                                if (!uniqueVideoIds.has(item.snippet.resourceId.videoId)) {
                                    allVideos.push({
                                        id: item.snippet.resourceId.videoId,
                                        title: item.snippet.title,
                                        thumbnail: item.snippet.thumbnails.medium.url,
                                        publishedAt: item.snippet.publishedAt,
                                        channelTitle: item.snippet.channelTitle
                                    });
                                    uniqueVideoIds.add(item.snippet.resourceId.videoId);
                                }
                            } else if (publishedAt < yesterdayDate) {
                                break;
                            }
                        }
                    }

                    if (!playlistItemsData.nextPageToken) break;
                    nextPageToken = playlistItemsData.nextPageToken;
                    pageCount++;
                }
            }
        } catch (error) {
            console.error(`Error fetching videos for ${channel.name}:`, error);
        }
    }

    console.log(allVideos); // para depuração
    displayVideos(allVideos);
}

function displayVideos(videos) {
    videosResultsDiv.innerHTML = '';
    if (videos.length === 0) {
        videosResultsDiv.innerHTML = '<p class="no-content">No videos found from yesterday for the selected channels.</p>';
        return;
    }

    videos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    videos.forEach(video => {
        const videoCard = document.createElement('a');
        videoCard.href = `https://www.youtube.com/watch?v=${video.id}`;
        videoCard.target = '_blank';
        videoCard.classList.add('video-card');
        videoCard.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}">
            <div class="video-card-content">
                <h3>${video.title}</h3>
                <p class="published-at">Published: ${new Date(video.publishedAt).toLocaleDateString()}</p>
            </div>
        `;
        videosResultsDiv.appendChild(videoCard);
    });
}

addChannelBtn?.addEventListener('click', addChannel);
channelListUl?.addEventListener('click', removeChannel);
searchVideosBtn?.addEventListener('click', searchDailyVideos);

displayChannels();
