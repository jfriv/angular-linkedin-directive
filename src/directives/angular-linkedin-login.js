angular.module('linkedinExample').directive('linkedinLogin',
        ['$rootScope', '$interval',
            function ($rootScope, $interval) {
                return {
                    restrict: 'AE',
                    replace: true,
                    templateUrl: '/src/directives/angular-linkedin-login-ptl.html',
                    scope: true,
                    compile: function (tElem, tAttrs) {

                        var linkedinLibLoaded = false,
                            linkedinLibInitialized = false;
            
                        window.linkedinLibInit = function(){
                            linkedinLibInitialized = true;
                        };
            
                        if(!linkedinLibLoaded){
                
                            linkedinLibLoaded = true;
                
                            $.getScript("//platform.linkedin.com/in.js?async=true", function success() {
                                IN.init({
                                    onLoad: "linkedinLibInit",
                                    api_key: "LINKEDIN_API_KEY",
                                    credentials_cookie: true
                                });
                            });
                
                        }

                        return function (scope, elem, attrs) {
                            
                            scope._buttonText = tAttrs.linkedinButtonText || 'Connect';
                            var _authorizedHandlerName = tAttrs.linkedinAuthorized || null;
                            var _authorizedHandler = _authorizedHandlerName ? scopescope[_authorizedHandlerName] : null;
                            var _profileDataHandlerName = tAttrs.linkedinProfileData || null;
                            var _profileDataHandler = _profileDataHandlerName ? scope[_profileDataHandlerName] : null;
                            var _successMsg = tAttrs.linkedinSuccessMsg || 'Linkedin Connection Authorized';
                            var ua = navigator.userAgent || 'unknown';
                            var _iOS = BrowserUtil.iOS();
                            var _iOSinterval = null;
                            
                            if(!_authorizedHandler && !_profileDataHandler){
                                throw "You must provide a 'linkedin-authorize' or 'linkedin-profile-data' on the scope.";
                            }
                            if(_iOS){
                                // hide linkedin button for iOS because the LinkedIn JS API does not work, argh...
                                scope.linkedinMsg = scope.linkedinMsg || {};
                                scope.linkedinMsg.successMsg = true;
                                if(_profileDataHandler && typeof _profileDataHandler == 'function'){
                                    scope[_profileDataHandlerName]({hideLinkedin:true});
                                }else{
                                    scope[_authorizedHandlerName]({hideLinkedin:true});
                                }
                                return;
                            }
                            
                            scope.linkedinMsg = scope.linkedinMsg || {};
                            scope.linkedinMsg.loaded = false;
                            scope.linkedinMsg.showButton = true;
                            scope.linkedinMsg.message = tAttrs.linkedinMsg || null;
                            scope.linkedinMsg.loading = false;
                            scope.linkedinMsg.errorMsg = null;
                            scope.linkedinMsg.successMsg = null;
                            
                            scope.onLinkedinAuthClick = function($ev){
                                authorizeLinkedin();
                            };
                            
                            var authorizeLinkedin = function(){
                                scope.linkedinMsg.loading = true;
                                if(IN.User.isAuthorized()){
                                    linkedinAuthorized();
                                }else{
                                    IN.User.authorize(linkedinAuthorized);
                                    /*
                                    if(_iOS){
                                        _iOSinterval = $interval(function(count){
                                            var linkedinCookieFound = false;
                                            var cookies = document.cookie.split(';');
                                            for(var i=0;i<cookies.length;i++){
                                                if(cookies[i].indexOf('linkedin_oauth') !== -1){
                                                    var cookieParts = cookies[i].split('=');
                                                    if(cookieParts[1] && _.isEmpty(cookieParts[1])){
                                                        linkedinCookieFound = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            if(linkedinCookieFound || count >= 9){
                                                $interval.cancel(_iOSinterval);
                                                linkedinAuthorized();
                                            }
                                        }, 200, 10);
                                    }
                                    */
                                }
                            };

                            var linkedinAuthorized = function(){
                                if(_profileDataHandler && typeof _profileDataHandler == 'function'){
                                    IN.API.Profile("me")
                                        .fields('id','first-name','last-name','location','industry','headline','picture-urls::(original)','email-address')
                                        .result(function(data){
                                            linkedinDataTransform(data);
                                        })
                                        .error(function(err){
                                            scope.linkedinMsg.loading = false
                                            scope.linkedinMsg.errorMsg = 'Unable to get LinkedIn profile information.  Please re-authorize.';

                                        });
                                }else{
                                    scope.linkedinMsg.loading = false;
                                    scope.linkedinMsg.successMsg = _successMsg;
                                }
                                if(_authorizedHandlerName && typeof scope[_authorizedHandlerName] == 'function')
                                    scope.$apply(scope[_authorizedHandlerName]({auth:true}));
                            };
      
                            var linkedinDataTransform = function(linData){
                                var linUser = ( (linData && linData.values) ? linData.values[0] : null );
                                if(linUser){
                                    scope.linkedinMsg.showButton = false;
                                    scope.linkedinMsg.successMsg = _successMsg;
                                    var data = {
                                        user_email: linUser.emailAddress,
                                        first_name: linUser.firstName,
                                        last_name: linUser.lastName,
                                        industry: linUser.industry,
                                        headline: linUser.headline,
                                        linkedin_id: linUser.id,
                                        location: (linUser.location ? linUser.location.name : ''),
                                        country_code: (linUser.location ? linUser.location.country.code : ''),
                                        headline: linUser.headline,
                                        thumb_url: ((linUser.pictureUrls && linUser.pictureUrls._total > 0) ? linUser.pictureUrls.values[0] : '')
                                    };
                                    if(_profileDataHandlerName && typeof scope[_profileDataHandlerName] == 'function'){
                                        scope.$apply(scope[_profileDataHandlerName](data));
                                    }
                                }else{
                                    scope.linkedinMsg.loading = false;
                                    scope.linkedinMsg.successMsg = 'Unable to get LinkedIn profile information.  Please re-authorize.';
                                }
                            };
                
                        }
                    }
                }
            }
        ]);
