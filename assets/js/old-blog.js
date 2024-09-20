const airtableApiKey = 'patJhJXhi2Ot9Yqdl.446f54b6c107359ea68844f930c9cd52e88d61fead8a0c413065ae36cf05d44c';
const baseId = 'appEQKbikWFlqZlUs';
const endpoint = `https://api.airtable.com/v0/${baseId}/Table%201`;

const articlesPerPage = 8;
let currentPage = 1;
let articles = [];

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
            }));

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

// Initial load of articles
loadArticles();