/* ====================================================================================================
NAME:			[Bill Tab  Panel]
BEHAVIOR:		Shows Bill Tab Panel.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Bills.TabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.App-View-Bills-TabPanel',
    activeTab: PgAtt.getBillTabCount(),
    title: 'Bills',
    previousTab: 'Home',
    items: [
        {
            xtype: 'App-View-Bills-Logged-Report',
            title: 'Logged',
            itemId: 'billLogged'
        },
        {
            xtype: 'App-View-Bills-Pending-Report',
            title: 'Pending',
            itemId: 'billPending'
        },
        {
            xtype: 'App-View-Bills-Verified-Report',
            title: 'Verified',
            itemId: 'billVerified'
        }
        ,
        {
            xtype: 'App-View-Bills-Approved-Report',
            title: 'Approved',
            itemId: 'billApproved'
        }
        ,
        {
            xtype: 'App-View-Bills-Printed-Report',
            title: 'Printed',
            itemId: 'billPrinted'
        }
        ,
        {
            xtype: 'App-View-Bills-Scanned-Report',
            title: 'Scanned',
            itemId: 'billScanned'
        }
        ,
        {
            xtype: 'App-View-Bills-Queued-Report',
            title: 'Queued',
            itemId: 'billQueued'
        }
        ,
        {
            xtype: 'App-View-Bills-Sent-Report',
            title: 'Sent',
            itemId: 'billSent'
        }
        ,
        {
            xtype: 'App-View-Bills-Archived-Report',
            title: 'Archived',
            itemId: 'billArchived'
        },
        {
            xtype: 'App-View-Bills-Paymentdetails-Report',
            title: 'Payment Details',
            itemId: 'billPaymentDetails'//,
            //hidden: true
        }
    ]
});