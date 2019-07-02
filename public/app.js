const addComment = (comment, articleId) => {
  fetch(`/api/comment/${articleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      author: comment.author || "anonymous",
      body: comment.body
    })
  })
    .then(() => {
      console.log("comment sent.");
      // TODO: rerender article here
    })
    .catch(err => console.log(err));
};

(() => {
  fetch("/scrape").then(() => {
    const articlesDiv = document.getElementById("articles");
    fetch("/api/articles")
      .then(res => {
        return res.json();
      })
      .then(articles => {
        articlesDiv.innerHTML = "";
        for (let i = 0; i < articles.length; i++) {
          const article = articles[i];
          const div = document.createElement("div");
          div.setAttribute("href", article.link);
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
          <p><a href="${article.link}">${article.summary}</a></p>
          ${commentsHtml}
          <button class="commentButton" data-id="${article._id}">comment</button>`;
          articlesDiv.append(div);
        }
      })
      .then(() => {
        const commentButtons = document.querySelectorAll(".commentButton");
        for (let i = 0; i < commentButtons.length; i++) {
          const commentButton = commentButtons[i];
          const articleId = commentButton.getAttribute("data-id");
          commentButton.addEventListener("click", event => {
            event.preventDefault();
            thisButton = event.target;
            console.log(articleId);
            const commentInput = document.createElement("input");
            commentInput.setAttribute("type", "text");
            commentInput.setAttribute(
              "data-id",
              thisButton.getAttribute("data-id")
            );
            thisButton.parentNode.insertBefore(
              commentInput,
              thisButton.nextSibling
            );
            thisButton.setAttribute("hidden", true);
            commentInput.focus();
            commentInput.addEventListener("keypress", event => {
              if (event.key === "Enter") {
                commentInput.value;
                addComment(commentInput.value, articleId);
                thisButton.setAttribute("hidden", false);
                commentInput.remove();
              }
            });
          });
        }
      })
      .catch(err => console.log(err));
  });
})();
