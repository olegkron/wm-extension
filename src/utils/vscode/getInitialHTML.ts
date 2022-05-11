import * as vscode from "vscode";

export default function getInitialHTML(
  webview: vscode.Webview,
  stylesMainUri: vscode.Uri,
  darkLogo: vscode.Uri,
  lightLogo: vscode.Uri,
  nonce: string,
  scriptUri: vscode.Uri,
  author: string = "the author"
): string {
  let styleSources = [
    "'self'",
    webview.cspSource,
    "https://unpkg.com/@highlightjs/",
  ];
  let imageSources = [
    webview.cspSource,
    "https://uploads-ssl.webflow.com/",
    "https://*.githubusercontent.com",
    "https://*.github.com",
    "https://*.github.io",
    "https://cdn.webflow.com/",
    "https://codecov.io/",
    "https://i.imgur.com"
  ];
  let scriptSources = [
    `'nonce-${nonce}'`,
    "https://unpkg.com/@highlightjs/",
    "https://browser.sentry-cdn.com/",
    "https://cdn.jsdelivr.net/npm/marked/",
    "https://ajax.googleapis.com/ajax/libs/jquery/",
  ];
  let connectSources = [
    "https://*.ingest.sentry.io",
    "https://*.sentry.io",
    "https://*.sentry.dev",
  ];
  return `

  <!DOCTYPE html>
  <html lang="en">

      <head>
         <title>Watermelon</title>
         <meta http-equiv="Content-Security-Policy" content="default-src 'self' https://*.watermelon.tools;
         style-src ${styleSources.join(" ")};
         img-src ${imageSources.join(" ")};
         script-src ${scriptSources.join(" ")};
         connect-src ${connectSources.join(" ")}">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <meta charset="UTF-8">
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js" 
        async defer fetchpriority="low"
        nonce="${nonce}"
        ></script>
        <script src="https://unpkg.com/@highlightjs/cdn-assets@11.5.0/highlight.min.js" 
        async defer fetchpriority="low"
        ></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
        nonce="${nonce}"
        ></script>
        <script
        src="https://browser.sentry-cdn.com/6.19.6/bundle.min.js"
        nonce="${nonce}"
        integrity="sha384-XITe7oDiyULCpVPtGc52+ISVyD2MAEbbfpNsmYcfxClZXDw+IA906MSf6rhcdf3L"
        crossorigin="anonymous"
        nonce="${nonce}"
        ></script>
        <link rel="stylesheet"
        href="https://unpkg.com/@highlightjs/cdn-assets@11.5.0/styles/default.min.css" 
        async defer fetchpriority="low">
        <link href="${stylesMainUri}" rel="stylesheet">
     </head>
     <body>
     <picture class="wm-logo">
       <source
        width="300"
        srcset="${darkLogo}"
        media="(prefers-color-scheme: dark)">
       <img src="${lightLogo}" width="300"/>
     </picture>
        <p>Watermelon helps you get the context of your code.</p>
        <p>Help us by <a href="https://github.com/watermelontools/wm-extension">starring Watermelon on GitHub</a></p>
        <br/>
        <div id="ghHolder">
           <p>Higlight a piece of code to start.</p>
           <p>Click this button to enrich your code with relevant information from GitHub:</p>
           <button class='run-watermelon'>View Pull Requests</button>
           <p>We can help you document your code:</p>
           <button class='create-docs'>Create repo docs</button>
           <p>We will fetch the associated PRs and comments for you to understand the context of the code</p>
           <p>Alternatively, you can <a href="https://github.com/watermelontools/wm-extension#commands">run with our watermelon.start command</a></p>
        </div>
        <h2>Need help?</h2>
        <p>Send an issue on <a href="https://github.com/watermelontools/wm-extension/issues">GitHub</a> and join us on <a href="https://join.slack.com/t/watermelonusers/shared_invite/zt-15bjnr3rm-uoz8QMb1HMVB4Qywvq94~Q">Slack</a></p>
     </body>
     <footer>
      <script nonce="${nonce}" src="${scriptUri}" type="module"></script>
     </footer>
     </html>
  `;
}
