
function request(method, path, args) {
    args = {...args, ...{
            method: method,
            credentials: 'include',
            mode: 'cors',
            headers: {...args.headers || {}}, ...{
                'Accept': 'application/json',
            }
        }};

    const base = __DEV__ ? 'http://192.168.1.59:3001/api' : 'https://pull-app.dvk.co/api';
    return window.fetch(base + path, args)
        .then(r => r.json())
}

function get(path) {
    return request('GET', path, {});
}

function post(path, data) {
    return request('POST', path, {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(data)
    })
}

function del(path) {
    return request('DELETE', path, {});
}

function date(utcDatetimeString) {
    utcDatetimeString = utcDatetimeString.replace(' ', 'T');
    utcDatetimeString = utcDatetimeString + "Z";
    return new Date(utcDatetimeString);
}

export default { get, post, del, date }
