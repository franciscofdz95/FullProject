/* ====================================================================================================
NAME:				[ Shipment  Report Controller]
BEHAVIOR:		Returns  Shipment reports data for selected filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/16/2016        Sheetal Karre		 Created.
 ======================================================================================================*/
using System;
using System.Web.Http;

using BIACore.Web.Model;
using biafilter = Flote.WebAPI.WebAPI.Model;
using BIACore.Model;
using System.Data;
using System.Collections.Generic;

namespace Flote.WebAPI.WebAPI.Controller
{
    public partial class WebApiReportController
    {
        /// <summary>
        /// Shipement reports details.
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("ShipmentRpt")]
        public ClientResult ShipmentRpt([FromBody] biafilter.Filter param)
        {
            try
            {
                param.PageName = "ShipmentRpt";
                return LoadPagedClientResult(DBConstants.GetShipmentDetails, param.ToDBParameter());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

        /// <summary>
        /// Return Shipment Summary
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns> 
        [HttpPost]
        [ActionName("ShipmentSummary")]
        public object ShipmentSummary([FromBody]  dynamic info)
        {
            try
            {
                return LoadSingle(DBConstants.GetShipmentSummary, new DBParameter("@shipment_number", DbType.AnsiString, info["ShipmentNumber"].Value));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

        /// <summary>
        /// Return Container Summary
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns> 
        [HttpPost]
        [ActionName("ContainerSummary")]
        public object ContainerSummary([FromBody]  dynamic info)
        {
            try
            {
                return LoadClientResult(DBConstants.GetContainerSummary, new DBParameter("@shipment_number", DbType.AnsiString, info["ShipmentNumber"].Value));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }

        /// <summary>
        /// Return MBL Summary
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns> 
        [HttpPost]
        [ActionName("MBLSummary")]
        public object MBLSummary([FromBody]  dynamic info)
        {
            try
            {
                return LoadClientResult(DBConstants.GetMBLSummary, new DBParameter("@shipment_number", DbType.AnsiString, info["ShipmentNumber"].Value));
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// View/Edit the shipment note summary.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("ViewShipmentNotes")]
        public object ViewShipmentNotes([FromBody]  dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@frn_id", DbType.Int32, 0));
                args.Add(new DBParameter("@frn_type", DbType.AnsiString, "SHP"));
                args.Add(new DBParameter("@key_id", DbType.AnsiString, info["ShipmentNumber"].Value));

                return LoadClientResult(DBConstants.FLOTEGetReferenceNotes, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Add the notes to shipment.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        [HttpPost]
        [ActionName("AddShipmentNote")]
        public object AddShipmentNote([FromBody]  dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@frn_notes", DbType.Int32, info["Notes"].Value));
                args.Add(new DBParameter("@frn_type", DbType.AnsiString, "SHP"));
                args.Add(new DBParameter("@key_id", DbType.AnsiString, info["ShipmentNumber"].Value));
                args.Add(new DBParameter("@usr_name", DbType.AnsiString, BIACore.Security.User.userId));
                return LoadResult(DBConstants.SetReferenceNotes, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        /// <summary>
        /// Delete the shipment Note By NoteId.
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
         [HttpPost]
         [ActionName("DeleteShipmentNoteByNoteId")]
        public object DeleteShipmentNoteByNoteId([FromBody]  dynamic info)
        {
            try
            {
                List<DBParameter> args = new List<DBParameter>();
                args.Add(new DBParameter("@frn_id", DbType.Int32, info["NoteId"].Value));                
                return LoadResult(DBConstants.HideReferenceNotes, args.ToArray());
            }
            catch (Exception ex)
            {
                BIACore.Log.LogFactory.Exception(ex);
                return null;
            }
        }
        
    }
}
