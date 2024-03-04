interface BiblioSucessfulResult {
  success: true;
  content: {
    author: string;
    title: string;
    url: string;
  }
};

interface BiblioFailedResult {
  success: false;
  content: string;
};

type BiblioResult = BiblioSucessfulResult | BiblioFailedResult;

interface ArticleData {
  author: string;
  siteName: string;
  title: string;
  url: string;
}
