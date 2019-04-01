sessionStorage.clear();
	var LRObject = new LoginRadiusV2(raasoption);
     var lr_raas_settings = {};
	     lr_raas_settings.sociallogin = {};
		 	    lr_raas_settings.registration = {};
    lr_raas_settings.registration.containerid = "registration-container";
	
	    lr_raas_settings.login = {};
    lr_raas_settings.login.containerid = "login-container";
	
	    lr_raas_settings.sociallogin = {};
    lr_raas_settings.sociallogin.interfaceclass = ".interfacecontainerdiv";
    lr_raas_settings.sociallogin.containerid = "sociallogin-container";
    lr_raas_settings.sociallogin.interfaceid = "interfacecontainerdiv";
    lr_raas_settings.sociallogin.templateid = "loginradiuscustom_tmpl";
	
	    lr_raas_settings.instantlinklogin = {};
		    lr_raas_settings.resetpassword = {};
    lr_raas_settings.resetpassword.containerid = "resetpassword-container";
	    lr_raas_settings.forgotpassword = {};
    lr_raas_settings.forgotpassword.containerid = "forgotpassword-container";
	
    lr_raas_settings.emailverification = {};
	    raasoption.formValidationMessage = true;
		
		LRObject.LoginRadiusHostedPage = '';
		

$( document ).ready(function() {

 	var url = window.location.href;
	var domainName = url.substring(0, (url.indexOf('profile')-1));

	$("#url").text(url);
	$("#Pagedomain").text(domainName);
	$("button").click(function(){
		window.location.href = window.location.href;
	})	
	
	
});