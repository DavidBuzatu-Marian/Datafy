import shell from 'shelljs';
import { logger } from '../../logger/logger';
import { Blog } from '../api/blog';

export const saveBlog = (blog: Blog) => {
  pullLatestChanges('main');
  updateAndRebaseBlogWithRemote();
  changeDirectory('Blogs');
  switchToBlogTitleBranch(blog.title);
  pullLatestChanges(blog.title);
  writeBlogToFile(blog.content, blog.title);
  replaceAll(/\\n/g, '\n\n', blog.title);
  replaceAll(/\"/g, '', blog.title);
  gitCommitLatestChangesAndSwitchToMain(blog.title);
  changeDirectory('..');
};

export const gitMergeBranchIntoMain = (branchName: String) => {
  if (
    shell.exec(`git merge --strategy-option=theirs ${branchName}`).code !== 0
  ) {
    throw new Error('Git update main failed!');
  }
};

export const pullLatestChanges = (branchName: string) => {
  if (shell.exec(`git pull origin ${branchName}`).code !== 0) {
    throw new Error('Git update main failed!');
  }
};

export const updateAndRebaseBlogWithRemote = () => {
  if (shell.exec('git submodule update --remote --rebase').code !== 0) {
    throw new Error('Git update for submodule failed!');
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

export const writeBlogToFile = (content: String, fileName: String) => {
  if (shell.exec(`echo "${content}" > ${fileName}.md`).code !== 0) {
    throw new Error('writing to file failed!');
  }
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
