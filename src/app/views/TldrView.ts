import { View } from 'ostovjs';
import template from '../templates/tldr.hbs';
import type PageModel from '../models/PageModel';
import { marked } from 'marked';

class TldrView extends View {
  declare model: PageModel;

  constructor(options: { model: PageModel }) {
    super({
      ...options,
      tagName: 'div',
      className: 'tldr',
    });
  }

  initialize() {
    this.listenTo(this.model, 'change', this.render);
  }

  render() {
    const tldr = this.model.get('tldr');
    (this.el as HTMLElement).innerHTML = template({
      pageTitle: this.model.get('title'),
      pageUrl: this.model.get('url'),
      tldr: tldr ? marked.parse(tldr) : '',
      loading: this.model.get('loading'),
      error: this.model.get('error'),
    });
    return this;
  }

  updateContent(text: string) {
    const contentEl = (this.el as HTMLElement).querySelector('.tldr__content');
    if (contentEl) {
      contentEl.innerHTML = marked.parse(text || '') as string;
    }
  }
}

export default TldrView;
