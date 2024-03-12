export const setCookie = (name, value, days) => {
    // concatenate cookie name and encoded value
    let cookie = name + "=" + encodeURIComponent(value);

    // if there's a value for days, add max-age to cookie
    if (days !== undefined) {
        cookie += "; max-age=" + days * 24 * 60 * 60;
    }
    // add path to cookie and then set
    cookie += "; path=/";
    document.cookie = cookie;
};

export const getCookieByName = name => {
    const cookies = document.cookie;

    // get the index of the cookie name and equal sign
    let start = cookies.indexOf(name + "=");
    if (start === -1) { // no cookie with that name
        return "";
    } else {
        // adjust so the name and equal sign aren't included in the result
        start = start + (name.length + 1);

        // get the index of the semi-colon at the end of the cookie value,
        let end = cookies.indexOf(";", start);
        if (end === -1) { // if last cookie, get length of cookie
            end = cookies.length;
        }

        // use the start and end indexes to get the cookie value
        const cookieValue = cookies.substring(start, end);

        // return the decoded cookie value
        return decodeURIComponent(cookieValue);
    }
};

export const deleteCookie = name =>
    document.cookie = name + "=''; max-age=0; path=/";


export const getUserDetails = () => {
    let userDetails = window.localStorage.userDetails;

    if (!userDetails) {
        userDetails = {};
    } else {
        userDetails = JSON.parse(userDetails);
    }

    return userDetails;
}