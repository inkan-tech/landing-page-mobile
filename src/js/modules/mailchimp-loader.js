/**
 * Deferred Mailchimp Popup Script Loader
 * Loads Mailchimp popup script after a delay to improve initial page performance
 */

// Defer Mailchimp popup script
setTimeout(function() {
  !function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/716e8fcfd71b495b7e4af1e92/38d3020ee67bdafdc3231e2272e1fa06.js");
}, 5000);  // Load after 5 seconds (increased from 3)