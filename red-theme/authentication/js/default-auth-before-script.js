var _queryString = window.location.search.replace("?", "");

var successMessages = {
  Register: "A verification email has been sent to your provided email address, please check your email for further instructions",
  SocialLogin: "A verification email has been sent to your provided email address, please check your email for further instructions",
  PasswordReset: "Password was reset successfully",
  PasswordForgot: "A verification email has been sent to your provided email address, please check your email for further instructions",
  EmailVerify: "Email verification complete, now you may log in",
  InstantLink: "Instant Link For Login has been sent to your provided email id, check email for further instruction",
  ResendOTP: "OTP has been sent to your provided phone number. "
};

var lr_raas_settings = window.lr_raas_settings || {};

//Registration
lr_raas_settings.registration = {};
lr_raas_settings.registration.containerid = "registration-container";

lr_raas_settings.registration.success = function (response) {
  lr_raas_settings.login.success(response, 'register');
  if (response.access_token) {
    redirectToReturnUrl(response.access_token);
  } else {
    if (_queryString.indexOf('return_url') != -1) {
      registrationSuccess('register');
    } else {
      setMessage(successMessages.Register);
      resetForm('loginradius-registration');
    }
  }
};

lr_raas_settings.registration.error = function (errors) {
  if (!errors[0].rule)
    setMessage(errors[0].Message, true);
};

//Login 
lr_raas_settings.login = {};

lr_raas_settings.login.containerid = "login-container";
lr_raas_settings.login.success = function (response, flag) {
  if (response.access_token) {
    console.log(response.access_token)
    redirectToReturnUrl(response.access_token);
  } else {
    if (response.AccountSid || (response.IsPosted && response.Data && response.Data.AccountSid)) {
      setMessage(successMessages.ResendOTP);
    } else if (_queryString.indexOf('return_url') != -1) {
      registrationSuccess('register');
    } else {
      if (flag == 'register') {
        setMessage(successMessages.Register);
        resetForm('loginradius-registration');
      } else {
        setMessage(successMessages.InstantLink);
        resetForm('loginradius-login');
      }
    }
  }
};

lr_raas_settings.login.error = function (errors) {
  if (!errors[0].rule)
    setMessage(errors[0].Description, true);
};

// Social log in
lr_raas_settings.sociallogin = {};
lr_raas_settings.sociallogin.interfaceclass = ".interfacecontainerdiv";
lr_raas_settings.sociallogin.containerid = "sociallogin-container";
lr_raas_settings.sociallogin.interfaceid = "interfacecontainerdiv";
lr_raas_settings.sociallogin.templateid = "loginradiuscustom_tmpl";

lr_raas_settings.sociallogin.success = function (response, data) {
  if (response.IsPosted) {
    if (_queryString.indexOf('return_url') != -1) {
      registrationSuccess('register');
    } else {
      setMessage(successMessages.SocialLogin);
      resetForm('loginradius-registration');
      showLogin();
    }
  } else {
    redirectToReturnUrl(response.access_token);
  }
};
lr_raas_settings.sociallogin.error = function (errors) {
  if (!errors[0].rule)
    setMessage(errors[0].Message, true);
};


lr_raas_settings.instantlinklogin = {};
lr_raas_settings.instantlinklogin.success = function (response) {
  redirectToReturnUrl(response.access_token);
};
lr_raas_settings.instantlinklogin.error = function (errors) {
  if (!errors[0].rule)
    setMessage(errors[0].Message, true);
};


lr_raas_settings.resetpassword = {};
lr_raas_settings.resetpassword.containerid = "resetpassword-container";
lr_raas_settings.resetpassword.success = function (response) {

  setMessage(successMessages.PasswordReset);
  showLogin();
};
lr_raas_settings.resetpassword.error = function (errors) {
  if (!errors[0].rule)
    setMessage(errors[0].Description, true);
};
if (window.location.search.indexOf('vtoken') > -1 && window.location.search.indexOf('vtype=reset') > -1) {
  $("#lr-social-login,#lr-traditional-login, nav, .logo, .link-group").hide();
  $("#resetpassword-container,#lr-raas-resetpassword").show();
}

lr_raas_settings.forgotpassword = {};
lr_raas_settings.forgotpassword.containerid = "forgotpassword-container";
lr_raas_settings.forgotpassword.success = function (response) {
  if (response.IsPosted && response.Data && response.Data.AccountSid) {
    setMessage(successMessages.ResendOTP);
  } else if (_queryString.indexOf('return_url') != -1) {
    registrationSuccess('forgotpassword');
  } else {
    if (raasoption.phoneLogin) {
      setMessage(successMessages.PasswordReset);
      showLogin();
    } else {
      setMessage(successMessages.PasswordForgot);
      resetForm('loginradius-forgotpassword');
    }
  }
};
lr_raas_settings.forgotpassword.error = function (errors) {
  if (!errors[0].rule)
    setMessage(errors[0].Message, true);
};

//Verification
lr_raas_settings.emailverification = {};
lr_raas_settings.emailverification.success = function (response) {
  if (response.access_token) {
    redirectToReturnUrl(response.access_token);
  } else {
    setMessage(successMessages.EmailVerify);
  }
};
lr_raas_settings.emailverification.error = function (errors) {
  if (!errors[0].rule)
    setMessage(errors[0].Message, true);
};

raasoption.formValidationMessage = true;
raasoption.instantLinkLogin = false;

var forgotpasswordurl = window.location.href.replace("action=forgotpassword&", "").replace("action=login&", "");
var emailverifyurl = window.location.href.replace("action=register&", "");

raasoption.forgotPasswordUrl = raasoption.forgotPasswordUrl || encodeURIComponent(forgotpasswordurl);
raasoption.verificationUrl = raasoption.verificationUrl || encodeURIComponent(emailverifyurl);
raasoption.callbackUrl = window.location;
//raasoption.templateName = window.lr_raas_settings.sociallogin.templateid;
raasoption.hashTemplate = true;
// raasoption.callbackUrl = window.location.href.split('?')[0];
raasoption.passwordlessLogin = false;
raasoption.passwordlessLoginOTP = false;
raasoption.askOptionalFieldsOnRegistration = false;
raasoption.usernameLogin = true;
raasoption.phoneLogin = false;

var LRObject = new LoginRadiusV2(raasoption);

LRObject.registrationFormSchema = [{
  "IsMandatory": true,
  "type": "string",
  "name": "username",
  "rules": "",
  "options": "",
  "DataSource": null,
  "ParentDataSource": null,
  "Parent": "",
  "Checked": true,
  "display": "User Name",
  "permission": "w"
}, {
  "type": "password",
  "name": "password",
  "display": "Password",
  "rules": "required|min_length[6]|max_length[32]",
  "options": null,
  "permission": "r"
}, {
  "type": "string",
  "name": "emailid",
  "display": "Email Id",
  "rules": "required|valid_email",
  "options": null,
  "permission": "r"
}];

var queryString = LRObject.util.parseQueryString(window.location.search.replace("?", ""));

for (var i = 0; i < LRObject.registrationFormSchema.length; i++) {
  if (LRObject.registrationFormSchema[i].name == "birthdate") {
    showBirthdateDatePicker();
  }
}

LRObject.$hooks.register('startProcess', function () {
  visibleLoadingSpinner(true);
});

LRObject.$hooks.register('endProcess', function () {
  visibleLoadingSpinner(false);
});

LRObject.$hooks.register('socialLoginFormRender', function () {
  //on social login form render
  $("#lr-traditional-login,#lr-raas-registration,#resetpassword-container,#lr-social-login,#interfacecontainerdivn").hide();
  $("#lr-raas-sociallogin").show();
});

LRObject.$hooks.call('mapValidationMessages', [{
  rule: "required",
  message: "The %s field is required."
}, {
  rule: "valid_email",
  message: "That doesn't look like a valid email."
}]);

if (queryString.action === "register") {
  showRegister();
} else if (queryString.action === "login") {
  showLogin();
} else if (queryString.action === "forgotpassword") {
  showForgotPassword();
}

LRObject.$hooks.call('customizeFormPlaceholder', {
  'emailid': 'Email',
  'password': 'Password',
  'username': 'Username', 
  'confirmpassword': 'Confirm password'
});

LRObject.$hooks.call('setButtonsName', {
  login: 'Login',
  registration: 'Sign up',
  forgotpassword: 'Submit'
});

$(".lr-raas-forgot-password").click(showForgotPassword);
$(".lr-raas-login-link").click(showLogin);
$(".lr-register-link").click(showRegister);

function showForgotPassword() {
  $("#lr-traditional-login,#registration-container,#resetpassword-container,#lr-social-login,.logo, nav, .link-group, .wrapper").hide();
  $("#lr-raas-forgotpassword").show();
  if ($('.cancel-forgot-pw').length == 0) {
    $('#loginradius-submit-send').wrap("<div class='forgot-pw-form-button-div'>");
    $('<input type="button" value="cancel" class="cancel-forgot-pw">').insertAfter('#loginradius-submit-send').click(showLogin);
  }
}

function showLogin() {
  $("#lr-social-login,#lr-traditional-login, .link-group, nav, .logo").show();
  $("#registration-container,#lr-raas-forgotpassword,#resetpassword-container,#lr-raas-sociallogin,#lr-raas-resetpassword").hide();
  $('.login-tab').addClass('active');
  $('.register-tab').removeClass('active');
  $('.wrapper').css({
    'display': 'block'
  });
}

function showRegister() {
  $("#lr-traditional-login,#lr-raas-forgotpassword,#resetpassword-container,#lr-raas-resetpassword, .link-group").hide();
  $("#registration-container").show();
  $('.login-tab').removeClass('active');
  $('.register-tab').addClass('active');
  $('.wrapper').css({
    'display': 'none'
  });
}

function setMessage(msg, isError) {
  if (isError) {
    jQuery("#lr-raas-message").show().removeClass("loginradius-raas-success-message").addClass("loginradius-raas-error-message").text(msg).delay(10000).fadeOut(300);
  } else {
    jQuery("#lr-raas-message").show().removeClass("loginradius-raas-error-message").addClass("loginradius-raas-success-message").text(msg).delay(10000).fadeOut(300);
  }

  visibleLoadingSpinner(false);
}

function redirectToReturnUrl(token) {
  if (queryString.return_url) {
    window.location = queryString.return_url.indexOf('?') > -1 ? queryString.return_url + '&token=' + token : queryString.return_url + '?token=' + token;
  } else {
    window.location = 'profile.aspx';
  }
}

function resetForm(formname) {
  clearForm(document.getElementsByName(formname)[0]);
}

function registrationSuccess(action) {
  window.location = queryString.return_url.indexOf('?') > -1 ? queryString.return_url + '&action_completed=' + action : queryString.return_url + '?action_completed=' + action;
}


function visibleLoadingSpinner(isvisible) {
  if (isvisible) {
    $("#loading-spinner").show();
  } else {
    $("#loading-spinner").hide();
  }
}


function clearForm(myFormElement) {

  var elements = myFormElement.elements;

  myFormElement.reset();

  for (i = 0; i < elements.length; i++) {

    var field_type = elements[i].type.toLowerCase();

    switch (field_type) {

      case "text":
      case "password":
      case "textarea":
        elements[i].value = "";
        break;

      case "radio":
      case "checkbox":
        if (elements[i].checked) {
          elements[i].checked = false;
        }
        break;

      case "select-one":
      case "select-multi":
        elements[i].selectedIndex = -1;
        break;

      default:
        break;
    }
  }
}

function showBirthdateDatePicker() {
  var maxYear = new Date().getFullYear();
  var minYear = maxYear - 100;
  $('body').on('focus', ".loginradius-birthdate", function () {
    $('.loginradius-birthdate').datepicker({
      dateFormat: 'mm-dd-yy',
      maxDate: new Date(),
      minDate: "-100y",
      changeMonth: true,
      changeYear: true,
      yearRange: (minYear + ":" + maxYear)
    });
  });
}