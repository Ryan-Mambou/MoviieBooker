import articles from "./data.js";

const filter = (data, filteringCriteria) => {
  return data.filter((article) => filteringCriteria(article));
};

const filteredArticles = filter(articles, (article) => article.quantity > 30);

console.log(filteredArticles);
