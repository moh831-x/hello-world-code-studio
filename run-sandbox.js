// Execute user code in a worker owned by an opaque-origin sandbox, not WordPress.
// Its CSP denies network access, including requests carrying WordPress cookies.
class CodeStudioRunner {
  constructor(sourceURL) {
    this.sourceURL = sourceURL;
    this.stopped = false;
    this.frame = document.createElement('iframe');
    this.frame.hidden = true;
    this.frame.setAttribute('sandbox', 'allow-scripts');
    this.frame.setAttribute('aria-hidden', 'true');
    this.listener = event => {
      if(this.stopped || event.source !== this.frame.contentWindow) return;
      this.onmessage?.({data:event.data});
    };
    window.addEventListener('message',this.listener);
  }
  async postMessage(payload) {
    try {
      const response = await fetch(this.sourceURL);
      if(!response.ok) throw new Error('Could not load the JavaScript runtime.');
      const source = await response.text();
      if(this.stopped) return;
      const encode = value => JSON.stringify(value).replaceAll('<','\\u003c');
      const boot = `
        const worker = new Worker(URL.createObjectURL(new Blob([${encode(source)}], {type:'text/javascript'})));
        worker.onmessage = event => parent.postMessage(event.data, '*');
        worker.onerror = event => { event.preventDefault(); parent.postMessage({type:'error',text:event.message || 'JavaScript runtime error'}, '*'); };
        worker.postMessage(${encode(payload)});
        addEventListener('message', event => { if(event.source === parent && event.data === 'stop') worker.terminate(); });
      `;
      this.frame.srcdoc = '<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src &#39;none&#39;; script-src &#39;unsafe-inline&#39; &#39;unsafe-eval&#39; blob:; worker-src blob:; connect-src &#39;none&#39;;"><script>' + boot + '</script>';
      document.body.append(this.frame);
    } catch(error) {
      if(!this.stopped) this.onerror?.({message:error.message,preventDefault(){}});
    }
  }
  terminate() {
    this.stopped = true;
    this.frame.contentWindow?.postMessage('stop','*');
    this.frame.remove();
    window.removeEventListener('message',this.listener);
  }
}
