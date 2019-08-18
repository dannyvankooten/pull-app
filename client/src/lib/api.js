function request(method, path, args) {
  args = {...args, ...{
      method: method,
      credentials: 'include',
      headers: {...args.headers || {}}, ...{
          'Accept': 'application/json',
        }
   }};

  const base = window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'http://pull-app.dvk.co';

  return window.fetch(base + path, args)
      .then(r => r.json())
}

function get(path) {
  return request('GET', path, {});
}

function post(path, data) {
  return request('POST', path, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

function date(utcDatetimeString) {
  utcDatetimeString = utcDatetimeString.replace(' ', 'T');
  utcDatetimeString = utcDatetimeString + "Z";
  let d = new Date(utcDatetimeString);
  return d;
}

export default { get, post, date }