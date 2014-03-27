angular-linkedin-directive
==========================

Angular directive for linkedin JS API login 

Please see the example for usage.  Directive offers two possible callback 
attributes, one for simple authentication, the other for retrieving the 
LinkedIn user's profile information.  If you need to change the information 
thats being passed back from linkedin, you will need to edit line 105 which 
specifies the fields which linkedin will pass back.

LinkedIn's JS API will not work with iOS Safari because that browser blocks 
javascript communication between parent and child browser windows.  This 
directive simply hides the linkedin login button for iOS Safari.

Note that you will need to replace "LINKEDIN_API_KEY" on line 26 of 
the directive with your own LinkedIn JS API key for this directive to function.

