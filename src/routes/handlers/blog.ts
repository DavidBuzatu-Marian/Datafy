import shell from 'shelljs';
import { logger } from '../../logger/logger';
import { Response } from 'express';

export const pullLatestChangesToBlog = (res: Response) => {
  if (shell.exec('git pull origin main').code !== 0) {
    logger.error('Error! Git update main failed!');
    throw new Error('Something went wrong in blogs');
  }
};

export const updateAndRebaseBlogWithRemote = (res: Response) => {
  if (shell.exec('git submodule update --remote --rebase').code !== 0) {
    logger.error('Error! Git update for submodule failed!');
    throw new Error('Something went wrong in blogs');
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
      logger.error('Error! Cannot checkout to new branch');
      res.status(500).json('Error! Something went wrong');
    }
  } else {
    if (shell.exec(`git checkout ${fileName}`).code !== 0) {
      logger.error('Error! Cannot checkout to branch');
      res.status(500).json('Error! Something went wrong');
    }
  }
};

export const writeBlogToFile = (
  res: Response,
  content: String,
  fileName: String
) => {
  if (shell.exec(`echo "${content}" > ${fileName}.md`).code !== 0) {
    logger.error('Error! writing to file failed!');
    throw new Error('Something went wrong in blogs');
  }
};

export const replaceAll = (
  res: Response,
  regex: RegExp,
  replacement: string,
  fileName: string
) => {
  if (shell.sed('-i', regex, replacement, `${fileName}.md`).code !== 0) {
    logger.error('Error! Sed failed!');
    throw new Error('Something went wrong in blogs');
  }
};

export const gitCommitLatestChangesAndSwitchToMain = (
  res: Response,
  fileName: String
) => {
  // add files and commit
  if (shell.exec('git add .').code !== 0) {
    logger.error('Error! Git add for submodule failed!');
    throw new Error('Something went wrong in blogs');
  }
  if (shell.exec(`git commit -m "Updated ${fileName}.md"`).code !== 0) {
    logger.error('Error! Git commit for submodule failed!');
    throw new Error('Something went wrong in blogs');
  }
  if (shell.exec(`git push -u origin ${fileName}`).code !== 0) {
    logger.error('Error! Git update for submodule failed!');
    throw new Error('Something went wrong in blogs');
  }
  if (shell.exec(`git checkout main`).code !== 0) {
    logger.error('Error! Git checkout to main failed!');
    throw new Error('Something went wrong in blogs');
  }
};

export const gitCommitLatestChangesOnMainProject = (
  res: Response,
  fileName: String
) => {
  if (shell.exec('git add .').code !== 0) {
    logger.error('Error! Git add for main failed!');
    throw new Error('Something went wrong in blogs');
  }
  if (shell.exec(`git commit -m "Updated ${fileName}.md"`).code !== 0) {
    logger.error('Error! Git commit for main failed!');
    throw new Error('Something went wrong in blogs');
  }
  if (shell.exec(`git push`).code !== 0) {
    logger.error('Error! Git update for main failed!');
    throw new Error('Something went wrong in blogs');
  }
};
