const articlesPerPage = 6;
let currentPage = 1;
let articles = [];
let airtableApiKey;
let endpoint;

// Load environment variables
async function loadConfig() {
    try {
        const islocal = window.location.hostname === 'localhost';
        if (!islocal) {
            // En production
            const response = await fetch('/.netlify/functions/config');
            const data = await response.json();
            articles = data.records.map(record => ({
                title: record.fields.Titre,
                text: record.fields.Resume,
                img: record.fields.Image?.[0]?.url,
                date: record.createdTime,
                images: record.fields.Image,
            }))
                .filter(article => article.title !== undefined);
            displayArticles();
        } else {
            // En local
            const response = await fetch('/config');
            const config = await response.json();

            airtableApiKey = config.airtableApiKey;
            const baseId = config.baseId;
            const tableName = config.tableName;
            endpoint = `${config.baseUrl}/${baseId}/${tableName}`;
            loadArticles();
        }

    } catch (error) {
        console.error('Error in loadConfig:', error);
    }
}

async function loadArticles() {
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${airtableApiKey}`
            }
        });
        const data = await response.json();
        articles = data.records.map(record => ({
            title: record.fields.Titre,
            text: record.fields.Resume,
            img: record.fields.Image?.[0]?.url,
            date: record.createdTime,
            images: record.fields.Image,
        }))
            .filter(article => article.title !== undefined);
        displayArticles();
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

// Fetch articles from Airtable
function displayArticles() {
    const container = document.getElementById('blog-container');
    container.innerHTML = '';

    const start = (currentPage - 1) * articlesPerPage;
    const end = Math.min(start + articlesPerPage, articles.length);
    const visibleArticles = articles.slice(start, end);

    visibleArticles.forEach((article, index) => {
        const articleElement = document.createElement('div');
        articleElement.className = 'col-lg-4 col-md-6 article';
        articleElement.innerHTML = `
            <img src="${article.img}" alt="${article.title}">
            <h3>${article.title}</h3>
            <small>${formatDate(article.date)}</small>
            <p>${article.text}</p>
        `;
        container.appendChild(articleElement);
    });

    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = end >= articles.length;
}

// Format date
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Pagination controls
document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage * articlesPerPage < articles.length) {
        currentPage++;
        displayArticles();
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayArticles();
    }
});

// Initial load of configuration
loadConfig();
