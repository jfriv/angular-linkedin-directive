BrowserUtil = {
    iOS: function(){
        var ua = navigator.userAgent.toLowerCase();
        var iOS = /(ipad|iphone|ipod)/.test( ua );
        console.log(iOS);
        return iOS;
    }
}