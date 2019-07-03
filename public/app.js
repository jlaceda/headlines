const articlesDiv = document.getElementById("articles");

setTimeout(() => {
  fetch("/scrape")
    .then(() => {
      console.log("Scrape Complete.");
    })
    .catch(err => {
      console.error("Scrape Error:", err);
    });
}, 250);

const addComment = (comment, articleId) => {
  fetch(`/api/comment/${articleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      author: comment.author || "anonymous",
      body: comment.body
    })
  })
    .then(res => {
      return res.json();
    })
    .then(article => {
      console.log("comment sent.");
      renderArticle(article);
    })
    .catch(err => console.log(err));
};

const renderArticle = article => {
  const div = document.createElement("div");
  div.classList = "article";
  div.setAttribute("data-id", article._id);
  let commentsHtml = "";
  console.log(article.comments);
  if (article.comments.length > 0) {
    for (let j = 0; j < article.comments.length; j++) {
      const comment = article.comments[j];
      commentsHtml += `<blockquote>${comment.body}<br>-<small>${comment.author}</small></blockquote>`;
    }
  }
  div.innerHTML = `
  <h2>${article.headline}</h2>
  <p><a target="_blank" href="${article.link}">${article.summary}</a></p>
  ${commentsHtml}
  <button class="commentButton" data-id="${article._id}">comment</button>`;
  const existingArticle = articlesDiv.querySelectorAll(
    `div[data-id=\"${article._id}\"]`
  )[0];
  if (existingArticle) {
    existingArticle.parentNode.insertBefore(div, existingArticle.nextSibling);
    existingArticle.remove();
  } else {
    articlesDiv.prepend(div);
  }
};

(async () => {
  // initially render articles
  const res = await fetch("/api/articles");
  const articles = await res.json();
  articlesDiv.innerHTML = "";
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    renderArticle(article);
  }
  // comment button functionality:
  const commentButtons = document.querySelectorAll(".commentButton");
  for (let i = 0; i < commentButtons.length; i++) {
    const commentButton = commentButtons[i];
    const articleId = commentButton.getAttribute("data-id");
    commentButton.addEventListener("click", event => {
      event.preventDefault();
      thisButton = event.target;

      const commentInput = document.createElement("input");
      commentInput.setAttribute("type", "text");
      commentInput.setAttribute("data-id", thisButton.getAttribute("data-id"));
      commentInput.setAttribute("placeholder", "Your Comment");

      const authorInput = document.createElement("input");
      authorInput.setAttribute("type", "text");
      authorInput.setAttribute("data-id", thisButton.getAttribute("data-id"));
      authorInput.setAttribute("placeholder", "Your Name (optional)");

      thisButton.parentNode.insertBefore(commentInput, thisButton.nextSibling);
      thisButton.parentNode.insertBefore(authorInput, thisButton.nextSibling);
      thisButton.setAttribute("hidden", true);
      authorInput.focus();

      commentInput.addEventListener("keypress", event => {
        const newComment = {
          body: commentInput.value,
          author: authorInput.value
        };
        if (event.key === "Enter") {
          addComment(newComment, articleId);
          thisButton.setAttribute("hidden", false);
          commentInput.remove();
          authorInput.remove();
        }
      });
    });
  }
})();
