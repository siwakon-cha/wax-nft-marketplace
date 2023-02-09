import axios from "axios";

const dev = process.env.NODE_ENV !== 'production';

export const get = (path, endpoint='api',
                    params = {}, headers = { 'Content-Type': 'application/json' }) => {
    let server;

    switch (endpoint) {
        case 'statistics': server = dev ? 'https://stats.hivebp.io' : 'https://stats.hivebp.io'; break;
        case 'set-api': server = dev ? 'https://sets.nfthive.io' : 'https://sets.nfthive.io'; break;
        case 'api': server = dev ? 'https://api.nfthive.io' : 'https://api.nfthive.io'; break;
    }

    return fetch(`${server}/${endpoint}/${path}`).then(res => {
        if (res.status === 200)
            return res.json();
        else
            return {error: res.statusText}
    });
}

export const getDelphiMedian = async () => {
    const body = {
        'code': 'delphioracle',
        'index_position': 'primary',
        'json': 'true',
        'key_type': 'i64',
        'limit': 1,
        'lower_bound': '',
        'reverse': 'true',
        'scope': 'waxpusd',
        'show_payer': 'false',
        'table': 'datapoints',
        'table_key': '',
        'upper_bound': ''
    };

    const url = 'https://api2.hivebp.io/v1/chain/get_table_rows';
    const res = await post(url, body);

    if (res && res.status === 200 && res.data && res.data.rows) {
        const row = res.data.rows[0];

        if (row.median)
            return row.median;
    }

    return null;
};


export const get_ext = (url) =>
    fetch(url).then(res => res.json());


export const post = (url, data) =>
    axios({
        method: 'post',
        url: url,
        data: data
    }).then(res => res);


export default get;
