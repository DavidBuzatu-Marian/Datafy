import shell from 'shelljs';
import { logger } from '../../logger/logger';
import { Response } from 'express';

export const pullLatestChangesToBlog = (res: Response) => {
  if (shell.exec('git pull origin main').code !== 0) {
    throw new Error('Error! Git update main failed!');
  }
};

export const updateAndRebaseBlogWithRemote = (res: Response) => {
  if (shell.exec('git submodule update --remote --rebase').code !== 0) {
    throw new Error('Error! Git update for submodule failed!');
  }
};

export const changeDirectory = (to: string) => {
  if (shell.cd(to).code !== 0) {
    logger.error('Error! Already in Blogs!');
  }
};

export const switchToBlogTitleBranch = (res: Response, fileName: String) => {
  if (shell.exec(`git show-ref -q --heads ${fileName}`).code !== 0) {
    if (shell.exec(`git checkout -b ${fileName}`).code !== 0) {
      res.status(500).json('Error! Cannot checkout to new branch');
    }
  } else {
    if (shell.exec(`git checkout ${fileName}`).code !== 0) {
      res.status(500).json('Error! Cannot checkout to branch');
    }
  }
};

export const writeBlogToFile = (
  res: Response,
  content: String,
  fileName: String
) => {
  if (shell.exec(`echo "${content}" > ${fileName}.md`).code !== 0) {
    throw new Error('Error! writing to file failed!');
  }
};

export const replaceAll = (
  res: Response,
  regex: RegExp,
  replacement: string,
  fileName: string
) => {
  if (shell.sed('-i', regex, replacement, `${fileName}.md`).code !== 0) {
    throw new Error('Error! Sed failed!');
  }
};

export const gitCommitLatestChangesAndSwitchToMain = (
  res: Response,
  fileName: String
) => {
  // add files and commit
  if (shell.exec('git add .').code !== 0) {
    throw new Error('Error! Git add for submodule failed!');
  }
  if (shell.exec(`git commit -m "Updated ${fileName}.md"`).code !== 0) {
    throw new Error('Error! Git commit for submodule failed!');
  }
  if (shell.exec(`git push -u origin ${fileName}`).code !== 0) {
    throw new Error('Error! Git update for submodule failed!');
  }
  if (shell.exec(`git checkout main`).code !== 0) {
    throw new Error('Error! Git checkout to main failed!');
  }
};

export const gitCommitLatestChangesOnMainProject = (
  res: Response,
  fileName: String
) => {
  if (shell.exec('git add .').code !== 0) {
    throw new Error('Error! Git add for main failed!');
  }
  if (shell.exec(`git commit -m "Updated ${fileName}.md"`).code !== 0) {
    throw new Error('Error! Git commit for main failed!');
  }
  if (shell.exec(`git push`).code !== 0) {
    throw new Error('Error! Git update for main failed!');
  }
};
