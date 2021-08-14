import express from 'express';
import { handleErrors, checkNotSucceeded } from '../handlers/errors';
import { Request, Response } from 'express';
import { check } from 'express-validator';
import {
  changeDirectory,
  gitMergeBranchIntoMain,
  gitPushBranch,
  saveBlog,
} from '../handlers/blog';

const router = express.Router();

export class Blog {
  title: string;
  content: String;
  getTitle(): string {
    return this.title;
  }
  getContent(): String {
    return this.content;
  }
}

router.put(
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
      let blog: Blog = Object.assign(new Blog(), req.body);
      blog.title = blog.title.split(' ').join('-');
      saveBlog(blog);

      return res.status(200).json(`Blog: ${blog.title} saved successfully!`);
    } catch (err) {
      handleErrors(res, err);
    }
  }
);

router.put(
  '/publish',
  [
    check('title', 'Title is mandatory').not().isEmpty(),
    check('content', 'Content is mandatory').not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      if (checkNotSucceeded(req)) {
        return res.status(400).json('Error! Checks have failed!');
      }
      let blog: Blog = Object.assign(new Blog(), req.body);
      blog.title = blog.title.split(' ').join('-');
      saveBlog(blog);
      changeDirectory('Blogs');
      gitMergeBranchIntoMain(blog.title);
      gitPushBranch('main');

      return res.status(200).json(`Blog: ${blog.title} saved successfully!`);
    } catch (err) {
      handleErrors(res, err);
    }
  }
);

module.exports = router;
