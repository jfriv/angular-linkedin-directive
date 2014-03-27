describe("linkedinLogin", function () {
    var $rootScope,
        $compile,
        $scope,
        el,
        getScriptSpy,
        INinitSpy,
        INUserIsAuthorizedSpy,
        INUserAuthorizeSpy,
        INAPIProfileSpy,
        $body = $('body'),
        fullHtml = '<div linkedin-login linkedin-button-text="Authorize" linkedin-success-msg="Success!" linkedin-authorized="onAuthorized" linkedin-profile-data="onProfileData"></div>',
        authOnlyHtml = '<div linkedin-login linkedin-button-text="Authorize" linkedin-success-msg="Success!" linkedin-authorized="onAuthorized"></div>',
        linkedinProfileData = {
          "_total": 1,
          "values": [{
            "_key": "~",
            "emailAddress": "james@jamesroberts.name",
            "firstName": "James",
            "headline": "Lead Developer at Honest Buildings",
            "id": "1234",
            "industry": "Marketing and Advertising",
            "lastName": "Roberts",
            "location": {
              "country": {"code": "us"},
              "name": "Greater Seattle Area"
            },
            "pictureUrls": {
              "_total": 1,
              "values": ["http://m.c.lnkd.licdn.com/mpr/mprx/0_1p_n01148nEr8WTGldCZyt-V8bnrbMSGlfjRJ-3qDtcP8Z0u12GsU4iYx0V"]
            }
          }]
        },
        transformedUserData = {
            "user_email":"james@jamesroberts.name",
            "first_name":"James",
            "last_name":"Roberts",
            "industry":"Marketing and Advertising",
            "headline":"Lead Developer at Honest Buildings",
            "linkedin_id":"1234",
            "location":"Greater Seattle Area",
            "country_code":"us",
            "thumb_url":"http://m.c.lnkd.licdn.com/mpr/mprx/0_1p_n01148nEr8WTGldCZyt-V8bnrbMSGlfjRJ-3qDtcP8Z0u12GsU4iYx0V"
        };

    window.IN = {
        init: function(params){
            window[params.onLoad]([]);
        },
        User: {
            isAuthorized: function(){
                return false;
            },
            authorize: function(authCallback){
                authCallback(true);
            }
        },
        API: {
            Profile: function(name){
                return {
                    fields: function(f){
                        return {
                            result: function(resCallback){
                                resCallback(linkedinProfileData);
                                return {
                                    error: function(errCallback){
                                        errCallback({message: 'some error'});
                                    }
                                }
                            }
                        }
                    }
                };
            }
        }
    };
    
    beforeEach(function () {

        //Instantiate module
        angular.module('linkedinExample');

        inject(function ($injector, _$compile_) {
            $rootScope = $injector.get('$rootScope');
            $compile = _$compile_;
            $scope = $rootScope.$new();
            $scope.linkedinMsg = {successMsg:null};
            $scope.onAuthorized = jasmine.createSpy("onAuthorized");
            $scope.onProfileData = jasmine.createSpy("onProfileData");
            getScriptSpy = spyOn($, 'getScript').andCallFake(function(url, s){
                s();
            });
            INinitSpy = spyOn(window.IN, 'init').andCallThrough();
            INUserIsAuthorizedSpy = spyOn(IN.User, 'isAuthorized').andCallThrough();
            INUserAuthorizeSpy = spyOn(IN.User, 'authorize').andCallThrough();
            INAPIProfileSpy = spyOn(IN.API, 'Profile').andCallThrough();
            el = $compile(angular.element(fullHtml))($scope);
        });

        $body.append(el);
        $rootScope.$digest();
    });

    afterEach(function () {
        $body.empty();
    });

    describe("compile time", function () {
        it("Should throw an error if the element is compiled without an 'linkedin-authorize' or 'linkedin-profile-data' attribute", function () {
            expect(function () {
                $compile(angular.element('<div linkedin-login></div>'))($scope);
                $scope.$digest();
            }).toThrow();
        });
        
        it("Should initialize LinkedIn 'IN' on the window object and set linkedinLibInitialized to true",function(){
            expect(getScriptSpy).toHaveBeenCalled();
            expect(INinitSpy).toHaveBeenCalledWith({ onLoad : 'linkedinLibInit', api_key : 'LINKEDIN_API_KEY', credentials_cookie : true });
            expect(window.linkedinLibInit).toBeTruthy();
        });
        
        
    });

    describe("link time", function () {
        var myScope;
        beforeEach(function () {
            myScope = $scope.$$childTail;
        });
        
        it("Should go through authorization and return profile data when scope.onLinkedinAuthClick() is called",function(){
            myScope.onLinkedinAuthClick();
            expect(INUserIsAuthorizedSpy).toHaveBeenCalled();
            expect(INUserAuthorizeSpy).toHaveBeenCalled();
            expect(INAPIProfileSpy).toHaveBeenCalled();
            expect($scope.onProfileData).toHaveBeenCalledWith(transformedUserData);
        });
        
        it("Should only call onAuthorized when onProfileData attribute is not set", function(){
            el = $compile(angular.element(authOnlyHtml))($scope);
            $scope.$digest();
            myScope = $scope.$$childTail;
            myScope.onLinkedinAuthClick();
            expect(INUserIsAuthorizedSpy).toHaveBeenCalled();
            expect(INUserAuthorizeSpy).toHaveBeenCalled();
            expect(INAPIProfileSpy).not.toHaveBeenCalled();
            expect($scope.onAuthorized).toHaveBeenCalledWith({auth:true});
        });
        
        it("Should call authorized directly and return profile data when already authenticated.",function(){
            
            IN.User.isAuthorized = function(){ return true; };
            INUserIsAuthorizedSpy = spyOn(IN.User, 'isAuthorized').andCallThrough();
            el = $compile(angular.element(authOnlyHtml))($scope);
            $scope.$digest();
            myScope = $scope.$$childTail;
            myScope.onLinkedinAuthClick();
            expect(INUserIsAuthorizedSpy).toHaveBeenCalled();
            expect(INUserAuthorizeSpy).not.toHaveBeenCalled();
            expect(INAPIProfileSpy).not.toHaveBeenCalled();
            expect($scope.onAuthorized).toHaveBeenCalledWith({auth:true});
            
        });
        
        it("Should set scope.linkedInErrorMsg when trying to transform bad data from LinkedIn.",function(){
            
            IN.User.isAuthorized = function(){ return true; };
            INUserIsAuthorizedSpy = spyOn(IN.User, 'isAuthorized').andCallThrough();
            linkedinProfileData = null;
            el = $compile(angular.element(fullHtml))($scope);
            $scope.$digest();
            myScope = $scope.$$childTail;
            myScope.onLinkedinAuthClick();
            expect(INUserIsAuthorizedSpy).toHaveBeenCalled();
            expect(INAPIProfileSpy).toHaveBeenCalled();
            expect(myScope.linkedinMsg.errorMsg).toEqual('Unable to get LinkedIn profile information.  Please re-authorize.');
            
        });
        
        
    });

    describe("iOS", function () {
        it("Should set linkedinMsg.successMsg to true, call onAuthorized and return if userAgent is iOS", function(){
            BrowserUtil.iOS = function(){return true;};
            el = $compile(angular.element(authOnlyHtml))($scope);
            $scope.$digest();
            expect($scope.linkedinMsg.successMsg).toBeTruthy();
            expect($scope.onAuthorized).toHaveBeenCalledWith({ hideLinkedin : true });
        });
        it("Should set linkedinMsg.successMsg to true, call onProfileData and return if userAgent is iOS", function(){
            var profileDataOnlyHtml = '<div hb-linkedin hb-linkedin-button-text="Authorize" hb-linkedin-success-msg="Success!" hb-linkedin-profile-data="onProfileData"></div>';
            BrowserUtil.iOS = function(){return true;};
            el = $compile(angular.element(profileDataOnlyHtml))($scope);
            $scope.$digest();
            expect($scope.linkedinMsg.successMsg).toBeTruthy();
            expect($scope.onProfileData).toHaveBeenCalledWith({ hideLinkedin : true });
        });
        
    });
    
});
