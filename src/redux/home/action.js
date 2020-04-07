const getLogoSrc = () => {
    return fetch('http://127.0.0.1:2323/testRedux', {
        method: 'POST',
    });
};

export {
    getLogoSrc,
};