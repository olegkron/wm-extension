import sendMessage from "./sendVSCodeMessage.js";

const addActionButtons = () => {
  $("#ghHolder").append(`<p>Higlight a piece of code to start.</p>`);
  $("#ghHolder").append(
    `
    <div class="anim-fade-in">
      <p>We will fetch the commit history for you to understand the context of the code</p>
      <button class="git-blame btn btn-primary" type="button">View Commit History</button>
    </div>
        `
  );
  $("#ghHolder").append(
    `
    <div class="anim-fade-in">
      <p>Click this button to enrich your code with relevant information from GitHub:</p>
      <button class="run-watermelon btn btn-primary" type="button">View Pull Requests</button>
    </div>
    `
  );

  $(".run-watermelon").on("click", (event) => {
    sendMessage({ command: "run" });
  });
  $(".git-blame").on("click", (event) => {
    sendMessage({ command: "blame" });
  });
};
export default addActionButtons;
