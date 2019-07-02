(() => {
  fetch("/scrape").then(() => {
    const articlesDiv = document.getElementById("articles");
    fetch("/api/articles")
      .then(res => {
        return res.json();
      })
      .then(articles => {
        for (let i = 0; i < articles.length; i++) {
          const article = articles[i];
          const div = document.createElement("div");
          div.setAttribute("href", article.link);
          div.setAttribute("data-id", article._id);
          let commentsHtml = "";
          if (article.comments.length > 0) {
            for (let j = 0; j < article.comments.length; j++) {
              const comment = article.comments[j];
              commentsHtml += `<blockquote>${comment.body}<br>-${comment.author}</blockquote>`;
            }
          }
          div.innerHTML = `
          <h3>${article.headline}</h3>
          <p>${article.summary}</p>
          ${commentsHtml}
          <button class="commentButton" data-id="${article._id}">comment</button>`;
          articlesDiv.append(div);
        }
      })
      .then(() => {
        const allCommentButtons = document.querySelectorAll(".commentButton");
        console.log(allCommentButtons);
      })
      .catch(err => console.log(err));
  });
})();
