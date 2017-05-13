class IndexView {
  constructor($dom, store, adapter) {
    this.store = store;
    this.adapter = adapter;
    this.$view = $dom.find('.mdisviewer_indexview');
    this.$body = this.$view.find('.mdisviewer_body');
  }

  show(path) {
    this.adapter.loadMDArray(path, (err, md_array) => {
      if (err) {
        return;
      }
      this._md_array = md_array;
    });
    this._showHeader(path);
    this._showBody();
  }

  _showHeader(path) {
    this.$view.find('.mdisviewer_header')
      .html(
        '<div class="mdisviewer_header_title">' +
          '<a href="' + path + '">' + 'demo-link' + '</a>' +
        '</div>'
      );
  }

  _showBody() {
    const generated_html_index = generate_html_index_from_md_array(this._md_array);
    this.$view.find('.mdisviewer_body')
      .html(
        '<div class="mdisviewer_md_list">' +
          generated_html_index
        + '</div>'
      );

    function generate_html_index_from_md_array(arr, header_index = 0) {
      var out = '';
      for(var i = 0; i < arr.length; i++) {
        const current_content = arr[i];
        if(typeof current_content === "string") {
          if (out.length > 0) {
            out += '</li><li>';
          }
          out += '<a href="#' + current_content + '">' + current_content + '</a>';
        } else {
          out += generate_html_index_from_md_array(current_content, header_index + 1);
        }
      }
      const ol_with_padding = '<ol style="padding: 0px 0px 0px ' + String(header_index * 10) + 'px;">';
      return ol_with_padding + '<li>' + out + '</li></ol>';
    }

  }
}
