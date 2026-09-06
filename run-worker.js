// Each run receives a new worker, keeping execution off the editor's UI thread.
self.onmessage = async ({data}) => {
  const send = self.postMessage.bind(self);
  const format = value => {
    if (typeof value === 'string') return value;
    if (value instanceof Error) return `${value.name}: ${value.message}`;
    if (typeof value === 'bigint') return `${value}n`;
    if (typeof value === 'undefined') return 'undefined';
    try { return JSON.stringify(value, null, 2) ?? String(value); }
    catch { return String(value); }
  };
  let count=0;
  for (const level of ['log','info','warn','error','debug','table']) {
    console[level] = (...args) => {
      if(count++ >= 200) return;
      send({type:'log',text:(level==='warn'||level==='error'?`${level.toUpperCase()}: `:'')+args.map(format).join(' ').slice(0,10000)});
    };
  }
  try {
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    await new AsyncFunction(data.code)();
    send({type:'done'});
  } catch (error) {
    send({type:'error',text:format(error)});
  }
};
