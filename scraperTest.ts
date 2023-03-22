import dotenv from "dotenv";
import { scraper } from "./scraper";

dotenv.config();

if (process.env.JOBSDB_SEARCH_URL == undefined) {
  throw new Error();
}
if (process.env.JOBSDB_SELECTOR == undefined) {
  throw new Error();
}
if (process.env.JOBSDB_REGEX == undefined) {
  throw new Error();
}
if (process.env.CTGOODJOBS_SEARCH_URL == undefined) {
  throw new Error();
}
if (process.env.CTGOODJOBS_SELECTOR == undefined) {
  throw new Error();
}

const jobsdbScraper = new scraper(
  process.env.JOBSDB_SEARCH_URL,
  process.env.JOBSDB_SELECTOR,
  new RegExp(process.env.JOBSDB_REGEX)
);

const indeedScraper = new scraper(
  process.env.CTGOODJOBS_SEARCH_URL,
  process.env.CTGOODJOBS_SELECTOR,
  new RegExp("0")
);

async function main() {
  let result = await indeedScraper.getJobCountTest("nodejs");
  console.log(`nodejs Job count: ${result}`);
}

main();
