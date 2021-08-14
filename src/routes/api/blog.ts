import express from 'express';
import { handleErrors, checkNotSucceeded } from '../handlers/errors';
import { Request, Response } from 'express';
import { check } from 'express-validator';
import shell from 'shelljs';
import { logger } from '../../logger/logger';

const router = express.Router();

class Blog {
  title: String;
  content: String;
  getTitle(): String {
    return this.title;
  }
  getContent(): String {
    return this.content;
  }
}

router.post(
  '/save',
  [
    check('title', 'Title is mandatory').not().isEmpty(),
    check('content', 'Content is mandatory').not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      if (checkNotSucceeded(req)) {
        return res.status(400).json('Error! Checks have failed!');
      }
      const blog: Blog = Object.assign(new Blog(), req.body);
      const blogTitleWithDash = blog.title.split(' ').join('-');
      // update local repo
      if (shell.exec('git pull origin main').code !== 0) {
        logger.error('Error! Git update main submodule failed!');
        return res.status(500).json('Error! Something went wrong');
      }
      // run script to fetch remote changes
      if (shell.exec('git submodule update --remote --rebase').code !== 0) {
        logger.error('Error! Git update for submodule failed!');
        return res.status(500).json('Error! Something went wrong');
      }
      // cd into submodule
      shell.cd('Blogs');
      // change to branch of blog title
      if (
        shell.exec(`git show-ref -q --heads ${blogTitleWithDash}`).code !== 0
      ) {
        // create branch
        shell.exec(`git checkout -b ${blogTitleWithDash}`);
      } else {
        // checkout to existing brach
        shell.exec(`git checkout ${blogTitleWithDash}`);
      }
      // // write to file
      if (
        shell.exec(`echo "${blog.content}" > ${blogTitleWithDash}.md`).code !==
        0
      ) {
        logger.error('Error! writing to file failed!');
        return res.status(500).json('Error! Something went wrong');
      }
      // replace \n
      if (
        shell.sed('-i', /\\n/g, '\n\n', `${blogTitleWithDash}.md`).code !== 0
      ) {
        logger.error('Error! Sed failed!');
        return res.status(500).json('Error! Something went wrong');
      }
      // remove "
      if (shell.sed('-i', /\"/g, '', `${blogTitleWithDash}.md`).code !== 0) {
        logger.error('Error! Sed failed!');
        return res.status(500).json('Error! Something went wrong');
      }
      // add files and commit
      if (shell.exec('git add .').code !== 0) {
        logger.error('Error! Git add for submodule failed!');
        return res.status(500).json('Error! Something went wrong');
      }
      if (
        shell.exec(`git commit -m "Updated ${blogTitleWithDash}.md"`).code !== 0
      ) {
        logger.error('Error! Git commit for submodule failed!');
        return res.status(500).json('Error! Something went wrong');
      }
      if (shell.exec(`git push -u origin ${blogTitleWithDash}`).code !== 0) {
        logger.error('Error! Git update for submodule failed!');
        return res.status(500).json('Error! Something went wrong');
      }
      if (shell.exec(`git checkout main`).code !== 0) {
        logger.error('Error! Git checkout to main failed!');
        return res.status(500).json('Error! Something went wrong');
      }
      // update main
      shell.cd('..');
      if (shell.exec('git add .').code !== 0) {
        logger.error('Error! Git add for main failed!');
        return res.status(500).json('Error! Something went wrong');
      }
      if (
        shell.exec(`git commit -m "Updated ${blogTitleWithDash}.md"`).code !== 0
      ) {
        logger.error('Error! Git commit for main failed!');
        return res.status(500).json('Error! Something went wrong');
      }
      if (shell.exec(`git push`).code !== 0) {
        logger.error('Error! Git update for main failed!');
        return res.status(500).json('Error! Something went wrong');
      }
      return res.status(200);
    } catch (err) {
      handleErrors(res, err);
    }
  }
);

module.exports = router;
