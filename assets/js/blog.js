const articlesPerPage = 8;
let currentPage = 1;
let articles = [];
let airtableApiKey;
let endpoint;

// Load environment variables
async function loadConfig() {
    try {
        const isProduction = window.location.hostname !== 'localhost';
        if (isProduction) {
            // En production, utilisez le proxy Netlify
            const response = await fetch('/.netlify/functions/airtableProxy');
            const data = await response.json();
            articles = data.records.map(record => ({
                title: record.fields.Titre,
                text: record.fields.Resume,
                img: `https://via.placeholder.com/350x200?text=Article+${record.id}`
            }))
                .filter(article => article.title !== undefined);
        } else {
            // En local, chargez la configuration et utilisez-la directement
            const response = await fetch('/config');
            const config = await response.json();

            airtableApiKey = config.airtableApiKey;
            const baseId = config.baseId;
            const tableName = config.tableName;
            endpoint = `${config.baseUrl}/${baseId}/${tableName}`;

            await loadArticles();
        }

        // Affichage des articles (commun aux deux environnements)
        displayArticles();

    } catch (error) {
        console.error('Error in loadConfig:', error);
    }
}

// Fetch articles from Airtable
function displayArticles() {
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
            img: `https://via.placeholder.com/350x200?text=Article+${record.id}`
        }))
            .filter(article => article.title !== undefined);
        displayArticles();
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
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
