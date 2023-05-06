// eslint-disable import/no-extraneous-dependencies
import {
  danger, fail, message, warn,
} from 'danger';
// eslint-disable import/no-extraneous-dependencies
import spellcheck from 'danger-plugin-spellcheck';
import yarn from 'danger-plugin-yarn';

const commitMessage = () => {
  if (!danger.git.commits) {
    return;
  }
  danger.git.commits.forEach((commit) => {
    if (!commit.message.match(/^(feat:)|(fix:)|(major:)|(chore:)|(CI:)|(wip:)|(Merge pull request #)/gi)) {
      fail(`Commit message '${commit.message}' does match the correct format`);
    }
  });
};

const prSize = (threshold = 500) => {
  if (danger.github && danger.github.pr) {
    const size = danger.github.pr.additions + danger.github.pr.deletions;
    if (size > threshold) {
      warn(`PR size is ${size} lines. That's bigger than the recommended limit of ${threshold} lines.`);
    }
  } else {
    message('No GitHub API access available.');
  }
};

const assignee = () => {
  if (danger.github && danger.github.pr) {
    if (danger.github.pr.assignee === null) {
      fail('Please assign someone to merge this PR, and optionally include people who should review.');
    }
  } else {
    message('No GitHub API access available.');
  }
};

const reviews = () => {
  if (danger.github && danger.github.reviews) {
    danger.github.reviews.forEach((review) => {
      if (review.state === 'APPROVED') {
        message(`Thanks @${review.user.login} for the review!`);
      }
    });
  } else {
    message('No GitHub API access available.');
  }
};

const spelling = () => {
  if (danger.github) {
    spellcheck({
      ignore: ['Sparkle'],
    });
  } else {
    message('No GitHub API access available.');
  }
};

const yarnLock = () => {
  if (danger.github) {
    yarn();
  } else {
    message('No GitHub API access available.');
  }
};

const docs = () => {
  if (!danger.git) return;
  const files = danger.git.fileMatch('**/*.md');
  if (files.edited) {
    message('Thanks for the docs update ! - We :heart: our [documentarians](https://www.writethedocs.org/)!');
  }
};

const addedTests = () => {
  if (!danger.git) return;
  const app = danger.git.fileMatch('laughingpotato/frontend/src/**/*.ts');
  const tests = danger.git.fileMatch('laughingpotato/frontend/src/**/*test*');

  if (app.modified && !tests.modified) {
    warn('You have app changes without tests.');
  }
};

if (danger.github) {
  spelling();
  reviews();
  assignee();
  prSize();
}
commitMessage();
// yarnLock();
docs();
addedTests();

message('Looking good');
