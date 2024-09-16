// Example articles data
const articles = Array.from({ length: 50 }, (_, i) => ({
    title: `Article Title ${i + 1}`,
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum ${i + 1}.`,
    img: `https://via.placeholder.com/350x200?text=Article+${i + 1}`
}));

const articlesPerPage = 8;
let currentPage = 1;

function loadArticles() {
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