/* ====================================================================================================
NAME:			[Flote Images and Admin Message]
BEHAVIOR:		shows Flote Images and Admin Message.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
04/25/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Home.FloteImagesMsg', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Home-FloteImagesMsg',  
    items: [
            
            {
                xtype: 'box',
                id: 'myImage', //id needed : Dom is calling outside extjs.
                baseCls: 'UPS_WhiteRight',
                autoEl: {
                    tag: 'img',
                    style: 'margin-left:10px; margin-right:10px;  margin-top:10px; width:90%; margin-bottom:10px; border: 2px solid black',
                    src: 'images/FLOTE_splash_image.jpg'   //	Remove animated GIF on HOME page. Use 1 static Image. Sriram
                }
            }

    ]

});