var module_linking_config = (function () {
    'use strict';    
    var publishEnv = {
        core: 'http://202.153.45.142/appsworld.core.newtest',
        admin: 'http://202.153.45.142/appsworld.admin.newtest',
        client: 'http://202.153.45.142/appsworld.client.newtest',
        hr: 'http://202.153.45.142/appsworld.hr.newtest',
        bean: 'http://202.153.45.142/appsworld.bean.newtest',
        audit: 'http://202.153.45.142/appsworld.audit.newtest',
        doc: 'http://202.153.45.142:9001/_trust/',
        knowledge: 'http://202.153.45.142/appsworld.knowledge.newtest',
        workflow: 'http://202.153.45.142/appsworld.workflow.newtest',
        tax: 'http://202.153.45.142/appsworld.tax.newtest'
    }
    var devEnv = {       
        core: 'http://localhost:37046',
        admin: 'http://localhost:37047',
        client: 'http://localhost:37048',
        hr: 'http://localhost:37049',       
        bean: 'http://localhost:37050',
        audit: 'http://localhost:37051',
        doc: 'http://202.153.45.142:9001/_trust/',
        knowledge: 'http://localhost:37058',
        workflow: 'http://localhost:37059',
        tax: 'http://localhost:37060'
    }
    return {
        publishEnv: publishEnv,
        devEnv:devEnv
    }
})();