export const getDomainWithTld = () => {
    const currentUrl = window.location.href;
    const urlObject = new URL(currentUrl);
    urlObject.pathname = '/';

    return urlObject.href;
};
