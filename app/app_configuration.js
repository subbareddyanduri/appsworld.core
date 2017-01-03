var app_configuration = (function () {

    var request_env = 'local';   // local,dev_publish,.,uat_publish,int_publish,fra_publish,local_tst,dev_tst
    var request_module = 'core';

    var env_base_url = {
        ui:{
            local: 'http://localhost:',
            dev_publish: 'http://192.168.0.110:90/',
            test_publish: 'http://ziraff.southeastasia.cloudapp.azure.com:91/',
            uat_publish: '',
            int_publish: 'http://ziraff.southeastasia.cloudapp.azure.com:93/',
            fra_publish: 'http://ziraff.southeastasia.cloudapp.azure.com:905/',
            local_tst: 'http://202.153.45.142:91/',
            dev_tst: 'http://202.153.45.142:96/'
        },
        api: {
            local: 'http://localhost:',
            dev_publish: 'http://192.168.0.110:90/',
            test_publish: 'http://ziraff.southeastasia.cloudapp.azure.com:91/',
            uat_publish: '',
            int_publish: 'http://ziraff.southeastasia.cloudapp.azure.com:93/',
            fra_publish: 'http://ziraff.southeastasia.cloudapp.azure.com:905/',
            local_tst: 'http://202.153.45.142:91/',
            dev_tst: 'http://202.153.45.142:96/'
        }
        
    }

    // Published Web Links 
    var module_linking = {
        local: {
            core: env_base_url.ui[request_env] + '37046',
            admin: env_base_url.ui[request_env] + '37047',
            client: env_base_url.ui[request_env] + '37048',
            hr: env_base_url.ui[request_env] + '37049',
            bean: env_base_url.ui[request_env] + '37050',
            audit: env_base_url.ui[request_env] + '37051',
            doc: 'http://202.153.45.142:9001/_trust/',
            knowledge: env_base_url.ui[request_env] + '37058',
            workflow: env_base_url.ui[request_env] + '37059',
            tax: env_base_url.ui[request_env] + '37060'
        },
        dev_publish: {
            core: env_base_url.ui[request_env] + 'appsworld.core.dev',
            admin: env_base_url.ui[request_env] + 'appsworld.admin.dev',
            client: env_base_url.ui[request_env] + 'appsworld.client.dev',
            hr: env_base_url.ui[request_env] + 'appsworld.hr.dev',
            bean: env_base_url.ui[request_env] + 'appsworld.bean.dev',
            audit: env_base_url.ui[request_env] + 'appsworld.audit.dev',
            doc: 'http://202.153.45.142:9001/_trust/',
            knowledge: env_base_url.ui[request_env] + 'appsworld.knowledge.dev',
            workflow: env_base_url.ui[request_env] + 'appsworld.workflow.dev',
            tax: env_base_url.ui[request_env] + 'appsworld.tax.dev'
        },
        test_publish: {
            core: env_base_url.ui[request_env] + 'appsworld.core.tst',
            admin: env_base_url.ui[request_env] + 'appsworld.admin.tst',
            client: env_base_url.ui[request_env] + 'appsworld.client.tst',
            hr: env_base_url.ui[request_env] + 'appsworld.hr.tst',
            bean: env_base_url.ui[request_env] + 'appsworld.bean.tst',
            audit: env_base_url.ui[request_env] + 'appsworld.audit.tst',
            doc: env_base_url.ui[request_env] + 'http://202.153.45.142:9001/_trust/',
            knowledge: env_base_url.ui[request_env] + 'appsworld.knowledge.tst',
            workflow: env_base_url.ui[request_env] + 'appsworld.workflow.tst',
            tax: env_base_url.ui[request_env] + 'appsworld.tax.tst'
        },
        uat_publish: {

        },
        int_publish: {
            core: env_base_url.ui[request_env] + 'appsworld.core.int',
            admin: env_base_url.ui[request_env] + 'appsworld.admin.int',
            client: env_base_url.ui[request_env] + 'appsworld.client.int',
            hr: env_base_url.ui[request_env] + 'appsworld.hr.int',
            bean: env_base_url.ui[request_env] + 'appsworld.bean.int',
            audit: env_base_url.ui[request_env] + 'appsworld.audit.int',
            doc: env_base_url.ui[request_env] + 'http://202.153.45.142:9001/_trust/',
            knowledge: env_base_url.ui[request_env] + 'appsworld.knowledge.int',
            workflow: env_base_url.ui[request_env] + 'appsworld.workflow.int',
            tax: env_base_url.ui[request_env] + 'appsworld.tax.int'
        },
        fra_publish: {
            core: env_base_url.ui[request_env] + 'appsworld.core.fra',
            admin: env_base_url.ui[request_env] + 'appsworld.admin.fra',
            client: env_base_url.ui[request_env] + 'appsworld.client.fra',
            hr: env_base_url.ui[request_env] + 'appsworld.hr.fra',
            bean: env_base_url.ui[request_env] + 'appsworld.bean.fra',
            audit: env_base_url.ui[request_env] + 'appsworld.audit.fra',
            doc: env_base_url.ui[request_env] + 'http://202.153.45.142:9001/_trust/',
            knowledge: env_base_url.ui[request_env] + 'appsworld.knowledge.fra',
            workflow: env_base_url.ui[request_env] + 'appsworld.workflow.fra',
            tax: env_base_url.ui[request_env] + 'appsworld.tax.fra'
        },
        local_tst: {
            core: env_base_url.ui[request_env] + 'appsworld.core.loctst',
            admin: env_base_url.ui[request_env] + 'appsworld.admin.loctst',
            client: env_base_url.ui[request_env] + 'appsworld.client.loctst',
            hr: env_base_url.ui[request_env] + 'appsworld.hr.loctst',
            bean: env_base_url.ui[request_env] + 'appsworld.bean.loctst',
            audit: env_base_url.ui[request_env] + 'appsworld.audit.loctst',
            doc: env_base_url.ui[request_env] + 'http://202.153.45.142:9001/_trust/',
            knowledge: env_base_url.ui[request_env] + 'appsworld.knowledge.loctst',
            workflow: env_base_url.ui[request_env] + 'appsworld.workflow.loctst',
            tax: env_base_url.ui[request_env] + 'appsworld.tax.loctst'
        },
        dev_tst: {
            core: env_base_url.ui[request_env] + 'appsworld.core.devtst',
            admin: env_base_url.ui[request_env] + 'appsworld.admin.devtst',
            client: env_base_url.ui[request_env] + 'appsworld.client.devtst',
            hr: env_base_url.ui[request_env] + 'appsworld.hr.devtst',
            bean: env_base_url.ui[request_env] + 'appsworld.bean.devtst',
            audit: env_base_url.ui[request_env] + 'appsworld.audit.devtst',
            doc: env_base_url.ui[request_env] + 'http://202.153.45.142:9001/_trust/',
            knowledge: env_base_url.ui[request_env] + 'appsworld.knowledge.devtst',
            workflow: env_base_url.ui[request_env] + 'appsworld.workflow.devtst',
            tax: env_base_url.ui[request_env] + 'appsworld.tax.devtst'
        }
    }

    var identity = {
        authorities: {
            local: 'https://192.168.0.110/Identity',
            dev_publish: 'https://192.168.0.110/Identity',
            test_publish: 'https://awidentitytst.azurewebsites.net/Identity',
            uat_publish: '',
            int_publish: 'https://awidentityint.azurewebsites.net/identity/',
            fra_publish: 'https://awidentityfra.azurewebsites.net/identity/',
            local_tst: 'https://AWIdentityLocTst.AzureWebSites.net/identity',
            dev_tst: 'https://AWIdentityDevTst.AzureWebSites.net/identity'
        },
        cli_ids: {
            local: 'AppsWorldTokenManager',
            dev_publish: 'appsworlddev',
            test_publish: 'appsworldtst',
            uat_publish: '',
            int_publish: 'appsworldint',
            fra_publish: 'appsworldfra',
            local_tst: 'appsworldloctst',
            dev_tst: 'appsworlddevtst'
        },
        re_direct_uri: {
            local: module_linking[request_env][request_module] + '/callback.html',
            dev_publish: module_linking[request_env][request_module] + '/callback.html',
            test_publish: module_linking[request_env][request_module] + '/callback.html',
            uat_publish: module_linking[request_env][request_module] + '/callback.html',
            int_publish: module_linking[request_env][request_module] + '/callback.html',
            fra_publish: module_linking[request_env][request_module] + '/callback.html',
            local_tst: module_linking[request_env][request_module] + '/callback.html',
            dev_tst: module_linking[request_env][request_module] + '/callback.html',
        },
        post_logout_redirect_uris: {
            local: module_linking[request_env][request_module] + '/callback.html',
            dev_publish: module_linking[request_env][request_module] + '/callback.html',
            test_publish: module_linking[request_env][request_module] + '/callback.html',
            uat_publish: module_linking[request_env][request_module] + '/callback.html',
            int_publish: module_linking[request_env][request_module] + '/callback.html',
            fra_publish: module_linking[request_env][request_module] + '/callback.html',
            local_tst: module_linking[request_env][request_module] + '/callback.html',
            dev_tst: module_linking[request_env][request_module] + '/callback.html',
        },
        silent_redirect_uris: {
            local: module_linking[request_env][request_module] + '/frame.html',
            dev_publish: module_linking[request_env][request_module] + '/frame.html',
            test_publish: module_linking[request_env][request_module] + '/frame.html',
            uat_publish: module_linking[request_env][request_module] + '/frame.html',
            int_publish: module_linking[request_env][request_module] + '/frame.html',
            fra_publish: module_linking[request_env][request_module] + '/frame.html',
            local_tst: module_linking[request_env][request_module] + '/frame.html',
            dev_tst: module_linking[request_env][request_module] + '/frame.html',

        }
    }

    // API Service Configuration   

    var api_environment = {
        local: {
            client_api_service: env_base_url.api['dev_publish'] + 'AWClientDev/',
            bean_api_service: env_base_url.api['dev_publish'] + 'AWBeanDev/',
            hr_api_service: env_base_url.api['dev_publish'] + 'AWHrDev/',
            audit_api_service: env_base_url.api['dev_publish'] + 'AWAuditDev/',
            workflow_api_service: env_base_url.api['dev_publish'] + 'AWWorkflowDev/',
            admin_api_service: env_base_url.api['dev_publish'] + 'AWAdminDev/',
            analytics_api_service: env_base_url.api['dev_publish'] + 'AWAnalyticsDev/'
        },
        dev_publish: {
            client_api_service: env_base_url.api[request_env] + 'AWClientDev/',
            bean_api_service: env_base_url.api[request_env] + 'AWBeanDev/',
            hr_api_service: env_base_url.api[request_env] + 'AWHrDev/',
            audit_api_service: env_base_url.api[request_env] + 'AWAuditDev/',
            workflow_api_service: env_base_url.api[request_env] + 'AWWorkflowDev/',
            admin_api_service: env_base_url.api[request_env] + 'AWAdminDev/',
            analytics_api_service: env_base_url.api[request_env] + 'AWAnalyticsDev/'
        },
        test_publish: {
            client_api_service: env_base_url.api[request_env] + 'AWClientTst/',
            bean_api_service: env_base_url.api[request_env] + 'AWBeanTst/',
            hr_api_service: env_base_url.api[request_env] + 'AWHrTst/',
            audit_api_service: env_base_url.api[request_env] + 'AWAuditTst/',
            workflow_api_service: env_base_url.api[request_env] + 'AWWorkflowTst/',
            admin_api_service: env_base_url.api[request_env] + 'AWAdminTst/',
            analytics_api_service: env_base_url.api[request_env] + 'AWAnalyticsTst/'
        },
        uat_publish: {
            client_api_service: '',
            bean_api_service: '',
            hr_api_service: '',
            audit_api_service: '',
        },
        int_publish: {
            client_api_service: env_base_url.api[request_env] + 'AWClientInt/',
            bean_api_service: env_base_url.api[request_env] + 'AWBeanInt/',
            hr_api_service: env_base_url.api[request_env] + 'AWHrInt/',
            audit_api_service: env_base_url.api[request_env] + 'AWAuditInt/',
            workflow_api_service: env_base_url.api[request_env] + 'AWWorkflowInt/',
        },
        fra_publish: {
            client_api_service: env_base_url.api[request_env] + 'AWClientFra/',
            bean_api_service: env_base_url.api[request_env] + 'AWBeanFra/',
            hr_api_service: env_base_url.api[request_env] + 'AWHrFra/',
            audit_api_service: env_base_url.api[request_env] + 'AWAuditFra/',
            workflow_api_service: env_base_url.api[request_env] + 'AWWorkflowFra/',
            admin_api_service: env_base_url.api[request_env] + 'AWAdminFra/',
            analytics_api_service: env_base_url.api[request_env] + 'AWAnalyticsFra/'
        },
        local_tst: {
            client_api_service: env_base_url.api[request_env] + 'AWClientLocTst/',
            bean_api_service: env_base_url.api[request_env] + 'AWBeanLocTst/',
            hr_api_service: env_base_url.api[request_env] + 'AWHrLocTst/',
            audit_api_service: env_base_url.api[request_env] + 'AWAuditLocTst/',
            workflow_api_service: env_base_url.api[request_env] + 'AWWorkflowLocTst/',
            admin_api_service: env_base_url.api[request_env] + 'AWAdminLocTst/',
            analytics_api_service: env_base_url.api[request_env] + 'AWAnalyticsLocTst/'
        },
        dev_tst: {
            client_api_service: env_base_url.api[request_env] + 'AWClientDevTst/',
            bean_api_service: env_base_url.api[request_env] + 'AWBeanDevTst/',
            hr_api_service: env_base_url.api[request_env] + 'AWHrDevTst/',
            audit_api_service: env_base_url.api[request_env] + 'AWAuditDevTst/',
            workflow_api_service: env_base_url.api[request_env] + 'AWWorkflowDevTst/',
            admin_api_service: env_base_url.api[request_env] + 'AWAdminDevTst/',
            analytics_api_service: env_base_url.api[request_env] + 'AWAnalyticsDevTst/'
        }
    }

    // Configuration Settings

    var identity_cofiguration = {
        client_id: identity.cli_ids[request_env],
        authority: identity.authorities[request_env],
        re_direct_uri: identity.re_direct_uri[request_env],
        post_logout_redirect_uri: identity.post_logout_redirect_uris[request_env],
        silent_redirect_uris: identity.silent_redirect_uris[request_env]
    }

    var _cofiguration = {
        api_services: api_environment[request_env],
        module_linking: module_linking[request_env],
        identity_config: identity_cofiguration,
        current_module_link: module_linking[request_env][request_module],
        current_module: request_module
    }

    return {
        app_config: _cofiguration,
    }
})();
