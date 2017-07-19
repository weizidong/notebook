import fs from 'fs'
import path from 'path'

export const createFolder = (to) => {
  const folders = path.dirname(to).split('/');
  let p = '';
  while (folders.length) {
    p += folders.shift() + '/';
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
  }
};
export const writeFile = (from, to) => {
  createFolder(to)
  fs.writeFileSync(to, fs.readFileSync(from));
}
