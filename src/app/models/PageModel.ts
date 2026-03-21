import { Model } from 'ostovjs';

interface PageAttributes {
  title: string;
  url: string;
  content: string;
  tldr: string;
  loading: boolean;
  error: string;
}

class PageModel extends Model<PageAttributes> {
  defaults() {
    return {
      title: '',
      url: '',
      content: '',
      tldr: '',
      loading: false,
      error: '',
    };
  }

  hasContent(): boolean {
    return Boolean(this.get('content'));
  }

  hasTldr(): boolean {
    return Boolean(this.get('tldr'));
  }
}

export default PageModel;
