import request from 'supertest';
import app from '../../../server/server';
import crypto from 'crypto';

describe('save blog content', () => {
  it('should get blog title and content, save it and commit changes on blog submodule', async () => {
    const response = await request(app)
      .put('/api/blog/save')
      .send({
        title: 'This is a test blog',
        content:
          '<p>Posted on 10.10.2021</p><img src="https://i.ibb.co/C2K1gSk/pexels-lee-campbell-115655.jpg" alt="pexels-lee-campbell-115655"/>\\n# This is a test blog\\n\'["Database", "AWS"]\'\\n## This should be recognized as a sub-title\\n<p id="this should be recognized as a sub-title">Mauris maximus nec ligula sed ullamcorper. Quisque semper eget felis ut semper. Sed sem leo, malesuada sit amet imperdiet eu, iaculis a nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam erat volutpat. Mauris placerat eros id ligula posuere, at tincidunt orci pellentesque. Mauris lobortis tempus nisl, sit amet mollis nisl facilisis eu. Etiam congue libero ac est convallis, ac sollicitudin mi vulputate. Nunc sagittis mi malesuada augue bibendum pulvinar. Cras molestie ut leo eget vestibulum. In molestie sollicitudin metus eget facilisis. Cras sit amet cursus lorem.</p>\\n## This should be recognized as a sub-title as well\\n<p id="this should be recognized as a sub-title as well">Phasellus eu dui ac urna maximus rutrum. Nullam sodales velit id nisl sagittis finibus. Donec porttitor pulvinar porttitor. Duis eget odio sed augue porta interdum placerat et mauris. Duis auctor purus dapibus, ultricies eros sed, pretium eros. Nunc a mi in odio sagittis luctus. Suspendisse nec dignissim libero. Sed tincidunt molestie blandit. Vestibulum accumsan lobortis elit, id rutrum risus rutrum a. Nunc elementum, nunc a suscipit ultrices, neque tortor euismod felis, ac ultricies diam augue ut odio. Integer eget varius elit. Etiam aliquam vehicula facilisis. Nulla eget sollicitudin tellus, et porta mi.</p>\\n<p id="this should be recognized as a sub-title as well">Phasellus eu dui ac urna maximus rutrum. Nullam sodales velit id nisl sagittis finibus. Donec porttitor pulvinar porttitor. Duis eget odio sed augue porta interdum placerat et mauris. Duis auctor purus dapibus, ultricies eros sed, pretium eros. Nunc a mi in odio sagittis luctus. Suspendisse nec dignissim libero. Sed tincidunt molestie blandit. Vestibulum accumsan lobortis elit, id rutrum risus rutrum a. Nunc elementum, nunc a suscipit ultrices, neque tortor euismod felis, ac ultricies diam augue ut odio. Integer eget varius elit. Etiam aliquam vehicula facilisis. Nulla eget sollicitudin tellus, et porta mi.</p>\\n<p id="this should be recognized as a sub-title as well">Phasellus eu dui ac urna maximus rutrum. Nullam sodales velit id nisl sagittis finibus. Donec porttitor pulvinar porttitor. Duis eget odio sed augue porta interdum placerat et mauris. Duis auctor purus dapibus, ultricies eros sed, pretium eros. Nunc a mi in odio sagittis luctus. Suspendisse nec dignissim libero. Sed tincidunt molestie blandit. Vestibulum accumsan lobortis elit, id rutrum risus rutrum a. Nunc elementum, nunc a suscipit ultrices, neque tortor euismod felis, ac ultricies diam augue ut odio. Integer eget varius elit. Etiam aliquam vehicula facilisis. Nulla eget sollicitudin tellus, et porta sfsmi.' +
          crypto.randomBytes(20).toString('hex') +
          '</p>',
      });
    expect(response.statusCode).toEqual(200);
  }, 100000);
});
