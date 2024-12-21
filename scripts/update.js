import { 
  woyag, 
  // sevenDostavka,
  ozonWbDpr,
  globalExpress
} from './update/index.js';

async function main() {
  await woyag();
  // await sevenDostavka();
  await ozonWbDpr();
  await globalExpress();
}

main();
