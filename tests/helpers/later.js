export default function later(callback, timeout = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                callback(resolve, reject);
                resolve();
            } catch (e) {
                reject(e);
            }
        }, timeout);
    });
}
