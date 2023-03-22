import axios from "axios";
import cheerio from "cheerio";

export class scraper {
  constructor(
    private readonly searchUrl: string,
    private readonly selector: string,
    private readonly regex: RegExp
  ) {}

  async getJobCount(jobKeyword: string): Promise<string> {
    //TODO convert keyword to search string

    let html = await axios.get(
      this.searchUrl.replace("${jobKeyword}", jobKeyword)
    );
    const $ = cheerio.load(html.data);
    if (this.regex === undefined) {
      return $(this.selector).text();
    } else {
      let regexTemp = this.regex;
      let result = $(this.selector).filter(function (
        this: cheerio.Element,
        i,
        el
      ) {
        return regexTemp.test($(this).text());
      });
      //TODO split the text correctly
      return result.text().split("1-30 of ")[1].split(" jobs ")[0];
    }
  }
}
