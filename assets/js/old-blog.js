const articlesPerPage = 8;
let currentPage = 1;
let articles = [];
let airtableApiKey; 
let endpoint;

// Load environment variables
async function loadConfig() {
    try {
        const isProduction = window.location.hostname !== 'localhost';
        const response = await fetch(isProduction ? '/.netlify/functions/config' : '/config');
        const config = await response.json();

        airtableApiKey = config.airtableApiKey;
        const baseId = config.baseId;
        const tableName = config.tableName;
        endpoint = `${config.baseUrl}/${baseId}/${tableName}`;

        loadArticles();
    } catch (error) {
        console.error('Error fetching config:', error);
    }
}

// Fetch articles from Airtable
function loadArticles() {
    fetch(endpoint, {
        headers: {
            'Authorization': `Bearer ${airtableApiKey}`
        }
    })
        .then(response => response.json())
        .then(data => {
            articles = data.records.map(record => ({
                title: record.fields.Titre,
                text: record.fields.Resume,
                img: `https://via.placeholder.com/350x200?text=Article+${record.id}`
            }))
            .filter(article => article.title !== undefined);

            const container = document.getElementById('blog-container');
            container.innerHTML = '';

            const start = (currentPage - 1) * articlesPerPage;
            const end = Math.min(start + articlesPerPage, articles.length);
            const visibleArticles = articles.slice(start, end);

            visibleArticles.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.className = 'col-lg-3 col-md-6 article';
                articleElement.innerHTML = `
                    <img src="${article.img}" alt="${article.title}">
                    <h3>${article.title}</h3>
                    <p>${article.text}</p>
                `;
                container.appendChild(articleElement);
            });

            document.getElementById('prev-btn').disabled = currentPage === 1;
            document.getElementById('next-btn').disabled = end >= articles.length;
        })
        .catch(error => console.error('Error fetching articles:', error));
}

// Pagination controls
document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage * articlesPerPage < articles.length) {
        currentPage++;
        loadArticles();
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadArticles();
    }
});

// Initial load of configuration
loadConfig();
