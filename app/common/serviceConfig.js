/// <reference path="../app_configuration.js" />
(function () {
    'use strict';

    var serviceId = 'serviceConfig';
    angular.module('appsworld').factory(serviceId, [serviceConfig]);

    function serviceConfig() {

        var serverName = {          
            clientCursor: app_configuration.app_config.api_services.client_api_service,
            clientCursorServerclient: app_configuration.app_config.api_services.client_api_service,
            authRemoteServerBean: app_configuration.app_config.api_services.bean_api_service,
            auditRemoteServer: app_configuration.app_config.api_services.audit_api_service,
            hrmsRemoteServer: app_configuration.app_config.api_services.hr_api_service,
            workflowRemoteServer: app_configuration.app_config.api_services.workflow_api_service,
            adminRemoteServer: app_configuration.app_config.api_services.admin_api_service,
            analyticsRemoteServer:app_configuration.app_config.api_services.analytics_api_service,
        }
        var serviceName = {          
            authService: 'api/beanmaster/',//not using this in bean
            clientService: 'breeze/ClientCursor/',
            clientAuthService: 'api/lead/',
            elasticSearchService: 'api/ElasticSearch/',
            commonService: 'api/Common/',
            companyService:'api/company/',
            opportunityService: 'api/Opportunity/',
            newopportunityService: 'api/clientcursor/',
            mastermanagementService: 'breeze/mastermanagement/',
            leadService: 'breeze/Leads/',
            accountService: 'breeze/Account/',
            AzureStorageService: 'breeze/AzureStorage/',
            StorageService: 'api/AzureStorage/',
            QuotationService: 'api/quotation/',
            activityService: 'api/',
            gridMetaData: 'api/user/',
            activityloopup: 'breeze/ClientCursor/',
            remainderService: 'api/reminder/',
            templateService: 'api/template/',
            auditService: 'api/auditclient/',
            workFlowService: 'api/workflow/',
            workflowclient: 'api/Workflowclient/',
            workflowcase: 'api/Case/',
            workflowCaseInvoice: 'api/Invoice/',
            hrmsService: 'api/hr/',
            adminEmpService: 'api/employee/',
            ccApiService: 'api/clientcursor/',
            hrmsRecruitment: 'api/recruitments/',
            hrmsLeaveManagement: 'api/leavemng/',
            calenderSetUp: 'api/common/',
            hrmsTimelog: 'api/timelog/',
            department:'api/department/',
            campaign:'api/campaign/',

            //bean cursor
            //authService: 'api/beanmaster/',//not using this in bean
            beanAuthService: 'api/mastermodule/',//bean new
            invoiceService: 'api/invoice/',//bean new
            debitNoteService: 'api/debitnote/',//bean new
            journalService: 'api/journal/',
            vendorbillService: 'api/bill/',
            receiptService: 'api/receipt/',
            bankreconciliationservice: 'api/bank/',
            revaluationService: 'api/revaluation/',
            openingBalanceService: 'api/openingbalance/',
            masterService: 'api/master/',
            paymentService: 'api/payment/',
            withdrawalService: 'api/bankwithdrawal/',
            cashsaleService:'api/cashsales/',
            //Audit Curser
            trialbalanceService: 'api/trialbalance/',
            leadsheetService: 'api/leadsheet/',
            auditControlCodeService: 'api/controlcodes/',
            materialityService: 'api/materiality/',
            workprogramService: 'api/workprogram/',
            generalLedgerService: 'api/generalledger/',
            foreignExchangeService: 'api/foreignexchange/',
            adjustmentsService: 'api/adjustment/',
            legendService: 'api/legend/',
            activityservice:'api/activity/',
            payRoll: 'api/payroll/',
            bladesService: 'api/blade/'
        }

        var service = {          
            remoteServer: serverName.clientCursorServerclient,
            newRemoteServer: serverName.identityAuth,
            curserRemoteServer: serverName.authRemoteServer,
            checkRemoteServer: serverName.clientCursorServerclient,
            authenticationRemoteServer: serverName.authRemoteServer + serviceName.authService,//not using this in bean
            commonRemoteServer: serverName.authRemoteServer + serviceName.commonService,
            clientCursorRemoteServer: serverName.clientCursorServerclient + serviceName.clientService,
            clientCursorNewRemoteServer: serverName.newClientCursorServerclient + serviceName.clientAuthService,
            elasticSearchRemoteServer: serverName.authRemoteServer + serviceName.elasticSearchService,
            opportunityRemoteServer: serverName.authRemoteServer + serviceName.opportunityService,
            newOpportunityRemoteServer: serverName.newClientCursorServerclient + serviceName.newopportunityService,
            baseRemoteServer: serverName.authRemoteServer,
            mastermanagementRemoteServer: serverName.clientCursorServerclient + serviceName.mastermanagementService,
            clientCursorClientRemoteServer: serverName.clientCursorServerclient + serviceName.clientService,
            leadRemoteServer: serverName.authRemoteServer + serviceName.leadService,
            leadCursorServer: serverName.clientCursorServerclient + serviceName.leadService,
            clientCursorClientRemoteServerapi: serverName.newClientCursorServerclient + serviceName.clientService,
             campaignRemoteServerapi: serverName.newClientCursorServerclient + serviceName.clientAuthService,
            accountRemoteServerapi: serverName.clientCursorServerclient + serviceName.accountService,
            apiCursorsRemoteServer: serverName.apiCursors + serviceName.commonService,
            AzureStorageRemoteServer: serverName.clientCursorServerclient + serviceName.AzureStorageService,
            QuotationRemoteServer: serverName.identityAuth + serviceName.QuotationService,
            activityRemoteServer: serverName.identityAuth + serviceName.activityService,
            activityElasticSearch: serverName.apiCursors + serviceName.activityService,
            activityRemoteServerlead: serverName.identityAuth + serviceName.activityService,
            activityRemoteServerleadlookup: serverName.clientCursor + serviceName.activityloopup,
            activityRemoteServerleadopp: serverName.apiCursors + serviceName.activityService,
            remainderRemoteServer: serverName.identityAuth + serviceName.remainderService,
            gridMetaDataRemoteServer: serverName.adminRemoteServer + serviceName.gridMetaData,
            templateRemoteServer: serverName.identityAuth + serviceName.templateService,
            auditClientRemoteServer: serverName.auditRemoteServer + serviceName.auditService,
            workflowRemoteServer: serverName.identityAuth + serviceName.workFlowService,
            workflowRemoteServerClient: serverName.identityAuth + serviceName.workflowclient,
            newWorkflowServerClient: serverName.workflowRemoteServer + serviceName.workflowclient,
            workflowRemoteServerCase: serverName.identityAuth + serviceName.workflowcase,
            workflowRemoteServerCaseInvoice: serverName.workflowRemoteServer + serviceName.workflowCaseInvoice,
            hrmsRemoteServer: serverName.hrmsRemoteServer + serviceName.hrmsService,
            departmentServer: serverName.identityAuth + serviceName.department,
            newDepartmentServer: serverName.workflowRemoteServer + serviceName.department,
            hrmsRecruitment: serverName.hrmsRemoteServer + serviceName.hrmsRecruitment,
            leaveManagementRemoteServer: serverName.hrmsRemoteServer + serviceName.hrmsLeaveManagement,
            calenderSetUp: serverName.hrmsRemoteServer + serviceName.calenderSetUp,
            hrmsTimelog: serverName.workflowRemoteServer + serviceName.hrmsTimelog,
            adminEmpRemoteServer: serverName.identityAuth + serviceName.adminEmpService,
            newAdminEmpRemoteServer: serverName.workflowRemoteServer + serviceName.masterService,
            ccApiRemoteServer: serverName.identityAuth + serviceName.ccApiService,
            authCommonServer: serverName.identityAuth + serviceName.commonService,
            hrCursorsRemoteServer:serverName.hrmsRemoteServer+serviceName.commonService,
            clientMasterRemoteServer: serverName.newClientCursorServerclient + serviceName.masterService,
            adminSgRemoteServer: serverName.adminRemoteServer + serviceName.masterService,

            //bean cursor
            //authenticationRemoteServer: serverName.authRemoteServer + serviceName.authService,//not using this in bean
            beanAuthenticationRemoteServer: serverName.authRemoteServerBean + serviceName.beanAuthService,//bean new
            invoiceRemoteServer: serverName.authRemoteServerBean + serviceName.invoiceService,//bean new
            debitNoteRemoteServer: serverName.authRemoteServerBean + serviceName.debitNoteService,//bean new
            journalRemoteServer: serverName.authRemoteServerBean + serviceName.journalService,
            vendorBillRemoteServer: serverName.authRemoteServerBean + serviceName.vendorbillService,
            receiptRemoteServer: serverName.authRemoteServerBean + serviceName.receiptService,
            bankreconciliationServer: serverName.authRemoteServerBean + serviceName.bankreconciliationservice,
            revaluationRemoteServer: serverName.authRemoteServerBean + serviceName.revaluationService,
            openingBalanceRemoteServer: serverName.authRemoteServerBean + serviceName.openingBalanceService,
            bankWithdrawalRemoteServer: serverName.authRemoteServerBean + serviceName.withdrawalService,
            cashsalesRemoteServer:serverName.authRemoteServerBean + serviceName.cashsaleService,

            //workweek setup
            workflowWorkWeekServer:serverName.workflowRemoteServer+serviceName.hrmsTimelog,
            workflowRemoteScheduleServer: serverName.workflowRemoteServer + serviceName.workflowcase,
            workFlowMasterRemoteServer: serverName.workflowRemoteServer + serviceName.masterService,
            PaymentRemoteServer: serverName.authRemoteServerBean + serviceName.paymentService,
            workflowquickRemoteServer: serverName.workflowRemoteServer + serviceName.workflowclient,
            //Audit Curser
            auditClientRemoteServerLocal: serverName.auditRemoteServer + serviceName.auditService,
            audittrialbalanceCursorRemoteServer: serverName.auditRemoteServer + serviceName.trialbalanceService,
            auditleadsheetCursorRemoteServer: serverName.auditRemoteServer + serviceName.leadsheetService,
            auditcontrolCodeCursorRemoteServer: serverName.auditRemoteServer + serviceName.auditControlCodeService,
            auditmaterialityCursorRemoteServer: serverName.auditRemoteServer + serviceName.materialityService,
            auditworkprogramCursorRemoteServer: serverName.auditRemoteServer + serviceName.workprogramService,
            auditgeneralLedgerCursorRemoteServer: serverName.auditRemoteServer + serviceName.generalLedgerService,
            auditforeignExchangeCursorRemoteServer: serverName.auditRemoteServer + serviceName.foreignExchangeService,
            auditadjustmentsCursorRemoteServer: serverName.auditRemoteServer + serviceName.adjustmentsService,
            auditcommonServicesCursorRemoteServer: serverName.auditRemoteServer + serviceName.legendService,
            commonServicesCursorRemoteServer: serverName.authRemoteServer + serviceName.commonService,
            adminRemoteServer:serverName.adminRemoteServer+serviceName.commonService,
            companyRemoteServer:serverName.adminRemoteServer+serviceName.companyService,
            activityremoteserver: serverName.identityAuth + serviceName.activityservice,
            payrollServer: serverName.hrmsRemoteServer + serviceName.payRoll,
            bladesRemoteServer:serverName.analyticsRemoteServer+serviceName.bladesService,
        }

        return service;
    }

})();
