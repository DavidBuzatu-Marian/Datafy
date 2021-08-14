import express from 'express';
import { handleErrors, checkNotSucceeded } from '../handlers/errors';
import { Request, Response } from 'express';
import { check } from 'express-validator';
import {
  changeDirectory,
  gitCommitLatestChangesAndSwitchToMain,
  pullLatestChangesToBlog,
  replaceAll,
  switchToBlogTitleBranch,
  updateAndRebaseBlogWithRemote,
  writeBlogToFile,
} from '../handlers/blog';

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
      pullLatestChangesToBlog(res);
      updateAndRebaseBlogWithRemote(res);
      changeDirectory('Blogs');
      switchToBlogTitleBranch(res, blogTitleWithDash);
      writeBlogToFile(res, blog.content, blogTitleWithDash);
      replaceAll(res, /\\n/g, '\n\n', blogTitleWithDash);
      replaceAll(res, /\"/g, '', blogTitleWithDash);
      gitCommitLatestChangesAndSwitchToMain(res, blogTitleWithDash);
      changeDirectory('..');

      return res.status(200);
    } catch (err) {
      handleErrors(res, err);
    }
  }
);

module.exports = router;
