'use strict';
const fs = require('fs');
const cp = require('child_process');
const util = require('util');
const npmUserPackages = require('npm-user-packages');

const writeFile = util.promisify(fs.writeFile.bind(fs));
const mkdir = util.promisify(fs.mkdir.bind(fs));
const stat = util.promisify(fs.stat.bind(fs));
const exec = util.promisify(cp.exec.bind(cp));
const packageTemplate = require('./util/template');

let npmURL = 'https://npmjs.com/package/';

npmUserPackages('abranhe').then(data => {

  const README = [`
<p align="left">
<a href="https://www.npmjs.com/package/abranhe"><img src="https://cdn.abranhe.com/abraham/abrahamjs.png" width="30%"></a>
  <br>
  <br>
  <br>
  <b>abranhe</b>: All <a href="https://github.com/abranhe">
  @abranhe</a>'s node reusable modules
</p>

<p align="left">
	<a href="https://github.com/abranhe"><img src="https://abranhe.com/badge.svg"></a>
	<a href="https://github.com/abranhe/abranhe/blob/master/license"><img src="https://img.shields.io/github/license/abranhe/abranhe.svg" /></a>
	<a href="https://cash.me/$abranhe"><img src="https://cdn.abranhe.com/badges/cash-me.svg"></a>
	<a href="https://www.patreon.com/abranhe"><img src="https://cdn.abranhe.com/badges/patreon.svg" /></a>
	<a href="https://paypal.me/abranhe/10"><img src="https://cdn.abranhe.com/badges/paypal.svg" /></a>
</p>

> I update it each month

# Install

\`\`\`
$ npm install abranhe
\`\`\`

## Included packages:
`];

  data.sort((a,b) => a.name.localeCompare(b.name));

  for (var pkg = 0; pkg < data.length; pkg++){
    // console.log(data[pkg].name)
    packageTemplate.dependencies[`${data[pkg].name}`] = `^${data[pkg].version}`;
    README.push(`${pkg + 1} - [${data[pkg].name}@${data[pkg].version}](${npmURL+data[pkg].name}): ${data[pkg].description}  `);
  }

  README.push(`
# Team

|[![Carlos Abraham Logo](https://avatars3.githubusercontent.com/u/21347264?s=50)](https://abranhe.com)|
| :-: |
| [Carlos Abraham](https://github.com/abranhe) |

# License

[MIT](https://github.com/abranhe/abranhe/blob/master/license) License © [Carlos Abraham](https://github.com/abranhe/)
`);

  try {
    stat('./build');
  } catch (err) {
    mkdir('./build');
  }
  writeFile('./build/package.json', JSON.stringify(packageTemplate, null , 2));
  writeFile('./build/readme.md', README.join('\n'));
  writeFile('./readme.md', README.join('\n'));
  exec('cd ./build && npm publish');
});
