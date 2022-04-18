while (!$) {
  console.log("no $");
}
const vscode = acquireVsCodeApi();

const startButton = document.getElementById("startButton");
const slackButton = document.getElementById("slackButton");

function sendMessage(message) {
  vscode.postMessage(message);
}

startButton.addEventListener("click", (event) => {
  sendMessage({ command: "run" });
});

slackButton.addEventListener("click", (event) => {
  fetch("https://app.watermelon.tools/api/analytics/github/search", {
    method: 'POST',
    mode: "cors",
    headers: {
      'Access-Control-Allow-Origin':'*',
    },
    body: {
      searchType: "slackButton"
    }
  }).then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

});

$(document).ready(function () {
  const addPRsToDoc = (prs) => {
    $("#ghHolder").append("<button id=`startButton`>Run Watermelon</button>")
    prs.forEach((pr, index) => {
      let mdComments = "";
      pr.comments.forEach((comment) => {
        mdComments += `
        <div class="comment">
        <div class="comment-header">
          <h5 class="comment-author">
          ${comment.user.login} on ${new Date(comment.created_at)}
          </h5>
        </div>
        <div class="comment-body">
      ${marked.parse(comment.body)}
        </div>
        </div>`;
      });
      $("#ghHolder").append(`
      <details ${!index ? "open" : ""}>
        <summary><a href="${pr.url}" target="_blank">${pr.title}</a></summary>
        <div>
          <div class="pr-owner">
            <p class="pr-poster">
              Author: ${pr.user}
            </p>
            <p class="pr-date">
              ${new Date(pr.created_at)}
            </p>
          </div>
          <div class="pr-body">
            ${marked.parse(pr.body)}
          </div>
          ${mdComments}
        </div>
      </details>
      `);
    });
    hljs.highlightAll();
    $("code").each(function (index, element) {
      // replace each with the clamped version and a see more button
      if ($(this).text().length > 100) {
        $(this).addClass("clamp");
        $(this).append("<button class='see-more'>See More</button>");
      }
      // now restore the text when the button was clicked
      $(this).on("click", ".see-more", function () {
        $(this).parent().removeClass("clamp");
        $(this).remove();
      });
    });
  };
  function setLoading() {
    $("#ghHolder").replaceWith(`
    <div id="ghHolder">
      <p>Loading...</p>
    </div>
    `);
  }
  function removeLoading() {
    $("#ghHolder p").remove();
  }

  window.addEventListener("message", (event) => {
    const message = event.data; // The JSON data our extension sent
    console.log(message);
    switch (message.command) {
      case "prs":
        removeLoading();
        addPRsToDoc(message.data);
        break;
      case "loading":
        setLoading();
        break;
    }
  });
});
