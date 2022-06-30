import getGitAPI from "./getGitAPI";
import { nonGHRepo } from "./showErrors";
import * as gitURLparse from "git-url-parse";

export default async function getRepoInfo({ repoURL }: { repoURL?: string  }): Promise<{
  owner: string;
  repo: string;
  source: string;
  protocol: string;
} > {
  let gitAPI = await getGitAPI();
  let owner: string = "";
  let repo: string = "";
  let source: string = "";
  let protocol: string = "";
  if (!repoURL) {
    let config = await await gitAPI?.repositories[0]?.getConfig(
      "remote.origin.url"
    );
    if (config) {
      let parsed = gitURLparse(config);
      owner = parsed.owner;
      repo = parsed.name;
      source = parsed.source;
      protocol = parsed.protocol;
      if (!(source.includes("github"))) {
        nonGHRepo();
      }
    }
  } else {
    let parsed = gitURLparse(repoURL);
    owner = parsed.owner;
    repo = parsed.name;
    source = parsed.source;
    protocol = parsed.protocol;
    if (!(source.includes("github"))) {
      nonGHRepo();
    }
  }
  return { owner, repo, source, protocol };
}
