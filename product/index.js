const open = require('open');
const inquiry = require('./inquirer');
const buildByName = require('./buildByName');
const { buildByUrl } = require('./buildByUrl');
const { buildGitSH, getNPMBuildParams } = require('./util');
const Log = require('./log');

async function main() {
  const { name, isLink, ext, dist } = await inquiry();

  Log.ProgramStart();
  let res;

  if (isLink) {
    const result = await buildByUrl(name, dist, ext);
    res = [result];
  } else {
    res = name.map((n) => buildByName(n, dist, ext));
  }

  if (res && res[0] && getNPMBuildParams('open', true)) {
    if (ext === 'html') {
      await open(res[0].file, { allowNonzeroExitCode: true, background: true });
    }
  }

  buildGitSH(res, dist);

  Log.ProgramEnd();
  process.exit();
}

main();