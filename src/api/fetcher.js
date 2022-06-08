function updateOptions(options) {
    const update = { ...options };
    if (sessionStorage.sessionToken) {
        update.headers = {
            ...update.headers,
            Authorization: `${sessionStorage.sessionToken}`,
        };
    }
    return update;
}

export default function fetcher(url, options) {
    return fetch(url, updateOptions(options));
}