/// <reference path="../../app_configuration.js" />
var config = {
    client_id: app_configuration.app_config.identity_config.client_id,
    redirect_uri: app_configuration.app_config.identity_config.re_direct_uri,
    post_logout_redirect_uri: app_configuration.app_config.identity_config.post_logout_redirect_uri,
    response_type: "id_token token",
    scope: "openid profile email role companyId",
    authority: app_configuration.app_config.identity_config.authority,
    silent_redirect_uri: app_configuration.app_config.identity_config.silent_redirect_uri,
    silent_renew: true
}
     var mgr = new OidcTokenManager(config);
        if (!mgr.expired) {
           
        }
       else if (window.location.hash) {
            //alert(gettokenid());
            if(gettokenid() != null){
                mgr.processTokenCallbackAsync().then(function () {
                    //console.log("Successfully Obtained Token", mgr.access_token);
                }, function (error) {
                    //console.error("Problem Getting Token : " + (error.message || error));
                });
            }else{
                //alert("redirectForToken");
                window.localStorage.removeItem('userInfo');
                mgr.redirectForToken();
            }
           }
           else if (mgr.expired) {
            window.localStorage.removeItem('userInfo');
            mgr.redirectForToken();
        }
   
var mgr = new OidcTokenManager(config);
if (!mgr.expired) {

}
else if (window.location.hash) {
    //alert(gettokenid());
    if (gettokenid() != null) {
        mgr.processTokenCallbackAsync().then(function () {
            
                    console.log("Successfully Obtained Token", mgr.access_token);
        }, function (error) {
                    console.error("Problem Getting Token : " + (error.message || error));
        });
    } else {
              //  alert("redirectForToken");
        mgr.redirectForToken();
    }
}
else if (mgr.expired) {
    window.localStorage.removeItem('userInfo');
    mgr.redirectForToken();
}

function gettokenid() {
    var hash = window.location.hash.substr(1);
    //if(hash.contains('id_Token')!==-1)
    var result = hash.split('&').reduce(function (result, item) {
        var parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
    }, {});

    //alert(result);
    if (result.id_token || result.access_token) {
        id_token = result.id_token;
        return id_token;
    }
}

function logout() {
    window.localStorage.removeItem('userInfo');
    mgr.redirectForLogout();
}

