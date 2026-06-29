using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Flote.WebAPI
{
    /// <summary>
    /// SQL Procedure list
    /// </summary>
    public class DBConstants
    {

        //Coding Sheet Excel Export
        public const string GetShipmentSummary = "appObject.usp_GetShipmentSummary_FV2";
        public const string GetContainerSummary = "appObject.usp_GetContainerSummary_FV2";
        public const string GetMBLSummary = "appObject.usp_GetMBLSummary_FV2";
        public const string GetShipmentDetails = "AppDynObject.usp_getShipmentDetails_FV2";
        public const string GetInvoiceVAT = "appObject.usp_GetInvoiceVAT_FV2";
        public const string GetInvoiceHeader = "appObject.usp_GetInvoiceHeader_FV2";
        public const string PrintCodingSheetDetails = "appObject.usp_PrintCodingSheetDetails_FV2";
        public const string ReviewCodingSheetDetails = "appObject.usp_ReviewCodingSheetDetails_FV2";
        public const string Bills = "AppDynObject.usp_Bills_FV2";
        public const string LocationShipmentTP = "AppDynObject.usp_LocationShipment_TP_FV2";
        public const string LocationShipmentDEP = "AppDynObject.usp_LocationShipment_DEP_FV2";
        public const string LocationOceanMBL = "AppDynObject.usp_LocationOceanMBL_FV2";
        public const string GetLocationVendor = "AppDynObject.usp_GetLocationVendor_FV2";
        public const string VendorShipmentReport = "AppDynObject.usp_VendorShipmentReport_FV2";
        public const string GetVendor = "AppDynObject.usp_GetVendor_FV2";
        public const string AccrualMonthlyReport = "AppDynObject.usp_AccrualMonthlyReport_FV2";
        public const string AccrualMonthlyDetailReport = "AppDynObject.usp_AccrualMonthlyDetailReport_FV2";
        public const string AccrualAccuracyReport = "AppDynObject.usp_AccrualAccuracyReport_FV2";
        public const string GetSelectedChargesForBill = "AppDynObject.usp_GetSelectedChargesForBill_FV2";
        public const string GetOceanMBL = "AppDynObject.usp_GetOceanMBL_FV2";
        public const string RemoveRejectedStatus = "appObject.usp_RemoveRejectedStatus_FV2";

        // Common Flote Controller
        public const string GetInvoiceLocationData = "appObject.usp_GetInvoiceLocationData_FV2";
        public const string LoadInvalidImage = "appObject.usp_LoadInvalidImage_FV2";
        public const string ApproveInvoice = "appObject.usp_ApproveInvoice_FV2";
        public const string InsertInvoiceRejectionStatus = "appObject.usp_InsertInvoiceRejectionStatus_FV2";
        public const string RemoveInvoiceFromBatch = "appObject.usp_RemoveInvoiceFromBatch_FV2";
        public const string UpdateInvoiceStatus = "appObject.usp_UpdateInvoiceStatus_FV2";
        public const string MoveInvoicetoArchived = "appObject.usp_MoveInvoicetoArchived_FV2";
        public const string MoveInvoicetoApproved = "appObject.usp_MoveInvoicetoApproved_FV2";
        public const string MoveInvoicebacktoScan = "appObject.usp_MoveInvoicebacktoScan_FV2";
        public const string DisableUnapproved = "appObject.usp_DisableUnapproved_FV2";
        public const string IsReProcessInvoice = "appObject.usp_IsReProcessInvoice_FV2";
        public const string CheckInvoiceHasNULLValues = "appObject.usp_Check_Invoice_Has_NULL_Values_FV2";
        public const string GetApprovedInvoiceCountByWeek = "AppDynObject.usp_GetApprovedInvoiceCountByWeek_FV2";
        public const string GetSCACCode = "appObject.usp_GetSCACCode_FV2";
        public const string GetBatchDetails = "appObject.usp_GetBatchDetails_FV2";
        public const string GetBatchDetailsArchiveBatch = "appObject.usp_GetBatchDetails_ArchiveBatch_FV2";
        public const string IsDataExists = "AppDynObject.usp_IsDataExists_FV2";
        public const string GetReferenceNotes = "appObject.usp_FLOTE_Get_ReferenceNotes_FV2";
        public const string GetUserNameById = "appObject.usp_GetUserNameById_FV2";
        public const string GetBypassImageByLocCode = "appObject.usp_GetBypassImageByLocCode_FV2";
        public const string GetAPUTFlag = "appObject.usp_GetAPUTFlag_FV2";
        public const string GetSecurity = "appObject.usp_GetSecurity_FV2";
        public const string GetUserPreference = "appObject.usp_GetUserPreference_FV2";
        public const string InsertUpdateUserPerferences = "appObject.usp_InsertUpdateUserPerferences_FV2";
        public const string GetLastUpdated = "appObject.usp_GetLastUpdated_FV2";
        public const string GetAdminMessage = "appObject.usp_Get_Admin_Message_FV2";
        public const string UpdateAdminMessage = "appObject.usp_Update_Admin_Message_FV2";
        public const string UpdateAdminMessageByUser = "appObject.usp_UpdateAdminMessageByUser_FV2";
        public const string IsReadByUser = "appObject.usp_IsReadByUser_FV2";
        public const string GetValuePayByRLoc = "appObject.usp_GetValuePayByRLoc_FV2";
        public const string GetValuePayUpdateAction = "appObject.usp_GetValuePayUpdateAction_FV2";
        public const string GetCompanyCodesAll = "appObject.usp_GetCompanyCodesAll_FV2";
        public const string GetCompanyCodesByUserId = "appObject.usp_GetCompanyCodesByUserId_FV2";
        public const string GetAputUserList = "appObject.usp_GetAputUserList_FV2";
        public const string GetUserProfile = "appObject.usp_Get_User_Profile_FV2";
        public const string AddCompanyToUser = "appObject.usp_Add_Company_to_User_FV2";
        public const string DeleteCompanyToUser = "appObject.usp_Delete_Company_to_User_FV2";

        //Scanned Documents
        public const string GetImageNumberByInvoice = "appObject.usp_GetImageNumberByInvoice_FV2";
        public const string SetInvoiceImage = "appObject.usp_SetInvoiceImage_FV2";
        public const string FetchCompanyCode = "appObject.usp_FetchCompanyCode_FV2";

        //Filter
        public const string RollingMonthsMon = "appObject.usp_RollingMonthsMon_FV2";
        public const string RollingMonths = "appObject.usp_RollingMonths_FV2";
        public const string AutoCompCarrier = "appObject.usp_AutoCompCarrier_FV2";
        public const string AutoCompChargeCode = "appObject.usp_AutoCompChargeCode_FV2";
        public const string AutoCompCompanyCode = "appObject.usp_AutoCompCompanyCode_FV2";
        public const string AutoCompContainer = "appObject.usp_AutoCompContainer_FV2";
        public const string AutoCompCountry = "appObject.usp_AutoCompCountry_FV2";
        public const string AutoCompleteLocation = "AppDynObject.usp_AutoCompleteLocation_FV2";
        public const string GetCurrency = "appObject.usp_GetCurrency_FV2";
        public const string AutoCompInvRefNo = "appObject.usp_AutoCompInvRefNo_FV2";
        public const string AutoCompLocation = "appObject.usp_AutoCompLocation_FV2";
        public const string GetMBLCostBasis = "appObject.usp_GetMBLCostBasis_FV2";
        public const string AutoCompMBL = "appObject.usp_AutoCompMBL_FV2";
        public const string GetRemotePrintLocations = "appObject.usp_GetRemotePrintLocations_FV2";
        public const string GetServiceCodes = "appObject.usp_GetServiceCodes_FV2";
        public const string AutoCompShipment = "appObject.usp_AutoCompShipment_FV2";
        public const string FilterUserId = "demo.Filter_UserId";
        public const string GetValuePayList = "appObject.usp_GetValuePayList_FV2";
        public const string AutoCompVendor2 = "appObject.usp_AutoCompVendor2_FV2";
        public const string AccName = "AppDynObject.usp_AccName_FV2";
        public const string AutoCompVendor = "AppDynObject.usp_autoCompVendor_FV2";
        public const string GetCurrency_FV2 = "appObject.usp_GetCurrency_FV2_FV2";
        public const string GetOriginTp = "appObject.usp_GetOrigin_TP_FV2";
        public const string GetDestCc = "appObject.usp_GetDest_CC_FV2";
        public const string GetDestTp = "appObject.usp_GetDest_TP_FV2";
        public const string GetOriginCc = "appObject.usp_GetOrigin_CC_FV2";
        public const string GetEPAOrig = "appObject.usp_GetEPAOrig";
        public const string GetLocCountry = "appObject.usp_GetLocCountry";
        public const string GetLocRegion = "appObject.usp_GetLocRegion";
        public const string GetEPADest = "appObject.usp_GetEPADest";
        public const string GetDivisionOrig = "appObject.usp_GetDivisions_Orig";
        public const string GetDivisionDest = "appObject.usp_GetDivisions_Dest";
        public const string GetRegionOrig = "appObject.usp_GetRegion_Orig";
        public const string GetRegionDest = "appObject.usp_GetRegion_Dest";

        //Import Excel
        public const string GetColumnSpecList = "appObject.usp_GetColumnSpec_List_FV2";
        public const string GetWorkBookZeroRecords = "appObject.usp_GetWorkBookZeroRecords_FV2";
        public const string WorkbookControlByInvID = "appObject.usp_WorkbookControlByInvID_FV2";
        public const string WorkbookDataImportExcel = "appObject.usp_WorkbookDataImportExcel_FV2";
        public const string UpdateChargeCodeByChargeDesc = "appObject.usp_UpdateChargeCodeByChargeDesc_FV2";
        public const string GetMatchCarrierBOL = "appObject.usp_GetMatchCarrierBOL_FV2";
        public const string GetImportData = "AppDynObject.usp_GetImportData_FV2";
        public const string UpdateDataImport = "appObject.usp_UpdateDataImport_FV2";
        public const string DeleteDataImport = "appObject.usp_DeleteDataImport_FV2";
        public const string IsChargeDeleted = "appObject.usp_IsChargeDeleted_FV2";
        public const string DeleteAllByInvoiceID = "appObject.usp_DeleteAllByInvoiceID_FV2";
        public const string ValidateData = "appObject.usp_ValidateData_FV2";
        public const string UpdateMatchCBOL = "appObject.usp_UpdateMatchCBOL_FV2";
        public const string WorkbookCtrlInsert = "appObject.usp_WorkbookCtrlInsert_FV2";
        public const string GetfilterPaidDifferrentlyReason = "appObject.usp_Get_Paid_Differently_Reasons";

        //Report
        public const string BillsStatusSummary = "AppDynObject.usp_BillsStatusSummary_FV2";
        public const string GetInvoiceDetail = "AppDynObject.usp_GetInvoiceDetail_FV2";
        public const string GetInvoiceSumHeader = "appObject.usp_GetInvoiceSumHeader_FV2";
        public const string GetInvoiceSumVAT = "appObject.usp_GetInvoiceSumVAT_FV2";
        public const string GetBillDetailStatusInfo = "appObject.usp_GetBillDetailStatusInfo_FV2";
        public const string ClearInvoice = "appObject.usp_ClearInvoice_FV2";
        public const string UpdateInvoiceForBG = "appObject.usp_UpdateInvoiceForBG_FV2";
        public const string GetInvoicesMissingDocId = "appObject.usp_GetInvoicesMissingDocId_FV2";
        public const string CreateBatchforInvoices = "appObject.usp_CreateBatchforInvoices_FV2";
        public const string InsertInvoicesBatch = "appObject.usp_InsertInvoicesBatch_FV2";
        public const string SendAPBatchData_RFC16 = "AppDynObject.usp_SendAPBatchData_RFC16_FV2";
        public const string SendAPBatchData_RFC16_Next = "AppDynObject.usp_SendAPBatchData_RFC16_FV2_Next";
        public const string UpdateInvoiceBatch = "appObject.usp_UpdateInvoiceBatch_FV2";
        public const string GetEmailsOnAPUTBatch = "appObject.sp_get_emails_on_APUT_Batch_FV2";
        public const string UpdateInvoiceDetailReference = "appObject.usp_UpdateInvoiceDetailReference_FV2";
        public const string GetChargeCodeSummaryByCCNCBOL = "appObject.usp_GetChargeCodeSummaryByCCNCBOL_FV2";
        public const string GetCarrierBolSummaryByInvoiceId = "appObject.usp_GetCarrierBolSummaryByInvoiceId_FV2";
        public const string GetCbolAggregateData = "appObject.usp_GetCbolAggregateData_FV2";
        public const string ProcessExcelDataToFlote = "appObject.usp_ProcessExcelDataToFlote_FV2_NEW";
        public const string GetFolderNames = "appObject.usp_GetFolderNames_FV2";
        public const string GetSubfolderNames = "appObject.usp_GetSubfolderNames_FV2";
        public const string SaveScanFolder = "appObject.usp_SaveScanFolder_FV2";
        public const string PostCodingSheet = "AppDynObject.usp_PostCodingSheet";
        public const string BPSUnSelectedCharges = "AppDynObject.usp_BPS_UnSelectedCharges_FV2";
        public const string BPSSelectedCharges = "AppDynObject.usp_BPS_SelectedCharges_FV2";
        public const string InvoiceChargesDetails = "appObject.usp_InvoiceChargesDetails_FV2";
        public const string GetTarriffPointType = "appObject.get_tarriff_point_type";
        public const string GetCustomChargeCodeOptions = "appObject.get_Custom_Charge_Code_Options";
        public const string GetTWHCodes = "appObject.usp_GetTWHCodes_FV2";
        public const string ValidateTWHEntry = "appObject.usp_ValidateTWHEntry_FV2";
        public const string AddNonE2KCostEntry = "appObject.usp_AddNonE2KCostEntry_FV2";
        public const string AddTaxWithholdingEntry = "appObject.usp_AddTaxWithholdingEntry_FV2";
        public const string VATSubQuery = "appObject.usp_VAT_subquery_FV2";
        public const string GetVATCodesCF = "appObject.usp_GetVATCodesCF_FV2";
        public const string GetExistingCurrencyDetails = "appObject.usp_GetExistingCurrencyDetails_FV2";
        public const string PostInvoiceCurrency = "appObject.usp_PostInvoiceCurrency_FV2";
        public const string PostInvoiceLine = "appObject.usp_PostInvoiceLine_FV2";
        public const string CheckValidCurrency = "appObject.usp_CheckValidCurrency_FV2";
        public const string GetInvoiceDetailCountByVatId = "appObject.usp_GetInvoiceDetailCountByVatId_FV2";
        public const string UpdateInvoiceComment = "AppDynObject.usp_UpdateInvoiceComment_FV2";
        public const string VerifyInvoiceForSelCharges = "appObject.usp_VerifyInvoiceForSelCharges_FV2";
        public const string UpdateInvoiceVatIds = "appObject.usp_UpdateInvoiceVatIds_FV2";
        public const string GetSplitRemainder= "appObject.usp_GetSplitRemainder";
        public const string GetInvoiceLineCurrency= "appObject.usp_GetInvoiceLineCurrency_FV2";
        public const string IsInvoiceCurrencyExist= "appObject.usp_IsInvoiceCurrencyExist";
        public const string GetVATCodesDN = "appObject.usp_getVATCodesDN_FV2";
        public const string GetForEditInvoice = "appObject.usp_GetForEditInvoice_FV2";
        public const string GetRegion = "appObject.usp_GetRegion_FV2_FV2";
        public const string GetAccName = "AppDynObject.usp_GetAccName_FV2";
        public const string DeleteInvoiceVAT = "appObject.usp_DeleteInvoiceVAT_FV2";
        public const string UpdateDeleteInvoiceVatData = "appObject.usp_UpdateDeleteInvoiceVatData_FV2";
        public const string GetVendorByVendorLocation = "appObject.usp_GetVendorByVendorLocation_FV2";
        public const string InsertVendorLocation = "appObject.usp_InsertVendorLocation_FV2";
        public const string ReadInvoiceByInvRefNo = "appObject.usp_ReadInvoiceByInvRefNo_FV2";
        public const string InsertInvoice = "appObject.usp_InsertInvoice_FV2";
        public const string UpdateInvoiceInfo = "appObject.usp_UpdateInvoiceInfo_FV2";
        public const string ValidateUPSReference = "AppDynObject.usp_ValidateUPSReference_FV2";
        public const string CheckInvoiceDetailForExVatCode = "appObject.usp_CheckInvoiceDetailForExVatCode_FV2";
        public const string InsertInvoiceVAT = "appObject.usp_InsertInvoiceVAT_FV2";
        public const string SetInvoiceVAT = "appObject.usp_SetInvoiceVAT_FV2";
        public const string GetTWHCodesByLoc = "appObject.usp_GetTWHCodesByLoc_FV2";
        public const string UpdateInvCheckInfo = "appObject.usp_UpdateInvCheckInfo_FV2";
        public const string FLOTEGetReferenceNotes= "appObject.FLOTE_Get_ReferenceNotes";
        public const string SetReferenceNotes = "appObject.Flote_Set_ReferenceNotes";
        public const string HideReferenceNotes= "appObject.Flote_Hide_ReferenceNotes";
        public const string GetRegion1 = "appObject.usp_GetRegion_FV2";
        public const string GetPaidDifferrentlyReason = "appObject.usp_Get_Invoice_Paid_Differently_Reasons";
        public const string GetPaidDifferently = "AppDynObject.USP_GETPAIDDifferently";
        public const string GetInvoiceVendorPaymentDetails = "AppDynObject.usp_GetInvoiceVendorPaymentDetails_FV2";
    }
}
