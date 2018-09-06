var htmlStr = require('./index.html')

/**
 * https://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables
 * https://help.disqus.com/customer/portal/articles/466258-how-can-i-capture-disqus-commenting-activity-in-my-own-analytics-tool-
 * https://github.com/divshot/disqus-comments/blob/master/disqus-comments.html
 * @type {Element}
 */

class FreelogAlphaDisqus extends HTMLElement {
  constructor() {
    super()
    let self = this;
    let shadowRoot = self.attachShadow({mode: 'closed'});
    try {
      this.widgetConfig = JSON.parse(this.dataset.widgetConfig)
    } catch (e) {
      try {
        this.widgetConfig = eval('(' + this.dataset.widgetConfig + ')')
      } catch (e) {
        this.widgetConfig = {}
      }
    }

    this.config = Object.assign({
      shortname: this.getAttribute('shortname') || 'disqus-freelog-com',
      identifier: location.href,
      title: document.title || location.href
    }, this.widgetConfig);

    shadowRoot.innerHTML = htmlStr
    self.root = shadowRoot
  }

  connectedCallback() {
    var config = this.config;

    if (config.shortname) {
      var disqus_shortname = config.shortname;
    } else {
      return console.error('Required: Please provide a Disqus shortname.');
    }
    var self= this;
    var disq = this.root.querySelector('#disqus');
    var clone = disq.cloneNode(true);
    var doc = document;
    clone.style.cssText = this.style.cssText
    doc.querySelector('#js-page-container').appendChild(clone)

    window.disqus_config = function () {
      if (config.identifier) this.page.identifier = config.identifier;
      if (config.title) this.page.title = config.title;
      if (config.url) this.page.url = config.url;
      if (config.categoryId) this.page.category_id = config.categoryId;
      this.callbacks.onReady = [function () {
        self.style.display = 'none'
      }];
    };
    var dsq = document.createElement('script');
    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = location.protocol + '//' + disqus_shortname + '.disqus.com/embed.js';
    (doc.getElementsByTagName('head')[0] || doc.getElementsByTagName('body')[0]).appendChild(dsq);
  }
}


customElements.define('freelog-alpha-disqus', FreelogAlphaDisqus);
