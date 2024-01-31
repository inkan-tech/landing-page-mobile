!function (c, h, i, m, p) { m = c.createElement(h), p = c.getElementsByTagName(h)[0], m.async = 1, m.src = i, p.parentNode.insertBefore(m, p) }(document, "script", "https://chimpstatic.com/mcjs-connected/js/users/716e8fcfd71b495b7e4af1e92/a9a7638a80da74b7afc8254dd.js");

function showMailChimpPopup() {

    !function (c, h, i, m, p) { m = c.createElement(h), p = c.getElementsByTagName(h)[0], m.async = 1, m.src = i, p.parentNode.insertBefore(m, p) }(document, "script", "https://chimpstatic.com/mcjs-connected/js/users/716e8fcfd71b495b7e4af1e92/a9a7638a80da74b7afc8254dd.js");
    //unsetting the cookie
    document.cookie = "MCPopupClosed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "MCPopupSubscribed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Refresh the page and bypass the cache
    location.reload(true);
    // scroll down as the popup is triggered by that.
    window.scrollTo(0, 1500);
}

document.getElementById("show-popup").onclick = function () { showMailChimpPopup(); }
