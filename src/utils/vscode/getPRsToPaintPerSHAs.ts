import * as vscode from "vscode";
import countOrganizationQueries from "../countOrganizationQueries";
import getPRsPerSHAS from "../getPRsPerSHAS";
import getIssue from "../github/getIssue";
import getIssueComments from "../github/getIssueComments";
import getRepoInfo from "./getRepoInfo";
import { noLinesSelected, noSearchResults } from "./showErrors";
import getSHAArray from "../getSHAArray";
import getGitAPI from "../vscode/getGitAPI";

export default async function getPRsToPaintPerSHAs({
  arrayOfSHAs,
  octokit,
  owner,
  repo,
}: {
  arrayOfSHAs: string[];
  octokit: any;
  owner?: string;
  repo?: string;
}): Promise<
  | {
      user: any;
      userLink: string;
      title: string;
      comments: any[];
      created_at: any;
      body: string;
      avatar: string;
      url: string;
      repo_url: string;
    }[]
  | { errorText: string }
> {
  let { repoName } = await getRepoInfo();

  // takes the first 22 shas and creates a list to send to the gh api
  let joinedArrayOfSHAs = arrayOfSHAs.slice(0, 22).join();
  if (joinedArrayOfSHAs.length < 1) {
    // Running an experiment to see how users behave without this error prompt
    // But rather running a git blame for the whole class
    // noLinesSelected();
    // return { errorText: "No lines selected" };
    let gitAPI = await getGitAPI();

    const linecount = vscode.window.activeTextEditor?.document.lineCount as number;

    arrayOfSHAs = await getSHAArray(
      1,
      linecount,
      vscode.window.activeTextEditor?.document.uri.fsPath,
      gitAPI
    );
    joinedArrayOfSHAs = arrayOfSHAs.slice(0, 22).join();
    
  }

  let foundPRs = await getPRsPerSHAS({
    octokit,
    repoName,
    owner,
    shaArray: joinedArrayOfSHAs,
  });
  if (foundPRs?.length === 0) {
    noSearchResults();
    return { errorText: "No search results" };
  }

  // Increase organizational query counter value
  countOrganizationQueries({ organizationName: owner });

  // Fetch information
  let issuesWithTitlesAndGroupedComments: {
    user: any;
    userLink: string;
    title: string;
    comments: any[];
    created_at: any;
    body: string;
    avatar: string;
    url: string;
    repo_url: string;
  }[] = [];

  let prPromises = foundPRs.map(async (issue: { url: any }) => {
    let comments = await getIssueComments({
      octokit,
      issueUrl: issue.url,
    });
    let issueData = await getIssue({ octokit, issueUrl: issue.url });
    if (issueData.user.type.toLowerCase() !== "bot")
      issuesWithTitlesAndGroupedComments.push({
        created_at: issueData.created_at,
        user: issueData.user.login,
        userLink: issueData.user.html_url,
        title: issueData.title,
        url: issueData.html_url,
        body: issueData.body,
        avatar: issueData.user.avatar_url,
        repo_url: issueData.repository_url,
        comments: comments.map((comment: any) => {
          return comment;
        }),
      });
  });
  await Promise.all(prPromises);
  return issuesWithTitlesAndGroupedComments;
}
