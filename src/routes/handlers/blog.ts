import shell from 'shelljs';
import { logger } from '../../logger/logger';
import { Blog } from '../api/blog';
import fs from 'fs';
import axios, { AxiosResponse } from 'axios';

interface RepositoryBlog {
  name: string;
  url: string;
}

export const saveBlog = (blog: Blog) => {
  pullLatestChanges('main');
  updateAndRebaseBlogWithRemote();
  changeDirectory('Blogs');
  switchToBlogTitleBranch(blog.title);
  pullLatestChanges(blog.title);
  writeBlogToFile(blog.content, blog.title);
  replaceAll(/\\n/g, '\n\n', blog.title);
  gitCommitLatestChangesAndSwitchToMain(blog.title);
  changeDirectory('..');
};

export const gitMergeBranchIntoMain = (branchName: String) => {
  const mergeCommandResult = shell.exec(
    `git merge --strategy-option=theirs ${branchName}`
  );
  if (mergeCommandResult.code !== 0) {
    throw new Error(`Git update main failed! Code: ${mergeCommandResult.code}`);
  }
};

export const pullLatestChanges = (branchName: string) => {
  const pullCommandResult = shell.exec(`git pull origin ${branchName}`);
  if (pullCommandResult.code !== 0) {
    throw new Error(`Git update main failed! Code: ${pullCommandResult.code}`);
  }
};

export const updateAndRebaseBlogWithRemote = () => {
  const updateCommandResult = shell.exec(
    'git submodule update --remote --rebase'
  );
  if (updateCommandResult.code !== 0) {
    throw new Error(
      `Git update for submodule failed! Code: ${updateCommandResult.code}`
    );
  }
};

export const changeDirectory = (to: string) => {
  if (shell.cd(to).code !== 0) {
    logger.error('Already in Blogs!');
  }
};

export const switchToBlogTitleBranch = (fileName: String) => {
  if (shell.exec(`git show-ref -q --heads ${fileName}`).code !== 0) {
    if (shell.exec(`git checkout -b ${fileName}`).code !== 0) {
      throw new Error('Cannot checkout to new branch');
    }
  } else {
    if (shell.exec(`git checkout ${fileName}`).code !== 0) {
      throw new Error('Cannot checkout to branch');
    }
  }
};

export const writeBlogToFile = (content: string, fileName: String) => {
  fs.writeFileSync(`${fileName}.md`, content);
};

export const replaceAll = (
  regex: RegExp,
  replacement: string,
  fileName: string
) => {
  if (shell.sed('-i', regex, replacement, `${fileName}.md`).code !== 0) {
    throw new Error('Sed failed!');
  }
};

export const gitCommitLatestChangesAndSwitchToMain = (fileName: String) => {
  // add files and commit
  if (shell.exec('git add .').code !== 0) {
    throw new Error('Git add for submodule failed!');
  }
  if (shell.exec(`git commit -m "Updated ${fileName}.md"`).code !== 0) {
    throw new Error('Git commit for submodule failed!');
  }
  if (shell.exec(`git push -u origin ${fileName}`).code !== 0) {
    throw new Error('Git update for submodule failed!');
  }
  if (shell.exec(`git checkout main`).code !== 0) {
    throw new Error('Git checkout to main failed!');
  }
};

export const gitCommitLatestChangesOnMainProject = (fileName: string) => {
  if (shell.exec('git add .').code !== 0) {
    throw new Error('Git add for main failed!');
  }
  if (shell.exec(`git commit -m "Updated ${fileName}.md"`).code !== 0) {
    throw new Error('Git commit for main failed!');
  }
  gitPushBranch(fileName);
};

export const gitPushBranch = (branchName: string) => {
  if (shell.exec(`git push -u origin ${branchName}`).code !== 0) {
    throw new Error(`Git push for ${branchName} failed!`);
  }
};

export const getBlogsFromMain = async () => {
  const blogsFromGitHub = await getBlogsFromGitHub();
  let requestsForBlog: Promise<AxiosResponse<any>>[] = [];
  blogsFromGitHub.data.forEach((blog: RepositoryBlog) => {
    requestsForBlog.push(axios.get(blog.url));
  });
  let blogsPromises: PromiseSettledResult<AxiosResponse<any>>[] =
    await Promise.allSettled(requestsForBlog);
  let blogs: Blog[] = [];
  blogsPromises.map((blog) => {
    if (blog.status === 'fulfilled' && blog.value.data.name !== 'README.md') {
      blogs.push({
        title: blog.value.data.name,
        url: blog.value.data.url,
        content: blog.value.data.content,
      });
    }
  });
  return blogs;
};

const getBlogsFromGitHub = async () => {
  return await axios.get(
    'https://api.github.com/repos/DavidBuzatu-Marian/Blogs/contents'
  );
};
