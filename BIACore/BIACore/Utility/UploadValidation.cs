using BIACore.Log;
using BIACore.Model;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;

namespace BIACore.Utility
{
    public static class UploadValidation
    {
        public enum UploadValidationError
        {
            BIAFileSize,
            AppFileSize,
            BIAExtensionNotAllowed,
            AppExtensionNotAllowed,
            MimeType,
            MagicNumber,
            UnknownException
        }

        public class UploadValidationResponse
        {
            public bool Success { get; set; }
            public UploadValidationError? UploadValidationError { get; set; }
            public string Message { get; set; }
        }

        private const int BIAMaxFileBytes = 20000000;

        public static UploadValidationResponse Validate(HttpPostedFile postedFile, string validExtensions = null, int? maxFileBytes = null)
        {
            if (postedFile == null)
                throw new ArgumentNullException("postedFile");

            return Validate(postedFile.InputStream, postedFile.ContentType, Path.GetExtension(postedFile.FileName).Substring(1), validExtensions, maxFileBytes);
        }

        public static UploadValidationResponse Validate(Stream fileStream, string mimeType, string fileExtension, string validExtensions = null, int? maxFileBytes = null)
        {
            if (fileStream == null)
                throw new ArgumentNullException("fileStream");

            if (mimeType == null)
                throw new ArgumentNullException("mimeType");

            if (fileExtension == null)
                throw new ArgumentNullException("fileExtension");

            if (maxFileBytes == null)
                maxFileBytes = Settings.UploadValidation.MaxFileBytes;

            if (validExtensions == null)
                validExtensions = Settings.UploadValidation.ValidExtensions;

            // sanitize: remove whitespace and .'s
            mimeType = mimeType.Trim();
            fileExtension = fileExtension.Trim().Replace(".", "");
            validExtensions = string.Join(",", validExtensions.Split(',').Select(x => x.Trim().Replace(".", "")));

            return ValidateAll(fileStream, mimeType, fileExtension, validExtensions, (int)maxFileBytes);
        }

        private static UploadValidationResponse ValidateAll(Stream fileStream, string mimeType, string fileExtension, string validExtensions, int maxFileBytes)
        {
            //if (BIACore.Settings.Config.BIAEnvironment == "DEV")
            if(1==1)
            {
                UploadValidationResponse response = null;
                bool valid = true;
                List<string> errorList = new List<string>();

                try
                {
                    if (!ValidateFileSize(fileStream, BIAMaxFileBytes))
                    {
                        valid = false;
                        errorList.Add("BIAFileSize");

                        if (response == null)
                        {
                            response = new UploadValidationResponse()
                            {
                                Success = false,
                                UploadValidationError = UploadValidationError.BIAFileSize,
                                Message = "The file size cannot exceed " + (BIAMaxFileBytes / 1000000d).ToString("0.00") + "MB."
                            };
                        }
                    }

                    if (!ValidateFileSize(fileStream, maxFileBytes))
                    {
                        valid = false;
                        errorList.Add("AppFileSize");

                        if (response == null)
                        {
                            response = new UploadValidationResponse()
                            {
                                Success = false,
                                UploadValidationError = UploadValidationError.AppFileSize,
                                Message = "The file size cannot exceed " + (maxFileBytes / 1000000d).ToString("0.00") + "MB."
                            };
                        }
                    }

                    List<UploadExtension> uploadExtensionList = Web.Client.Post<List<UploadExtension>>(API.URL(API.UPLOAD_EXTENSION),
                                new { Extension = fileExtension });

                    if (uploadExtensionList.Count == 0)
                    {
                        valid = false;
                        errorList.Add("BIAFileExtension");

                        if (response == null)
                        {
                            response = new UploadValidationResponse()
                            {
                                Success = false,
                                UploadValidationError = UploadValidationError.BIAExtensionNotAllowed,
                                Message = "The file extension is not allowed."
                            };
                        }
                    }

                    if (!ValidateFileExtension(fileExtension, validExtensions))
                    {
                        valid = false;
                        errorList.Add("AppFileExtension");

                        if (response == null)
                        {
                            response = new UploadValidationResponse()
                            {
                                Success = false,
                                UploadValidationError = UploadValidationError.AppExtensionNotAllowed,
                                Message = "File type not allowed.  Allowable file types are \"" + validExtensions + "\"."
                            };
                        }
                    }

                    if (valid)
                    {
                        if (!ValidateMimeType(mimeType, uploadExtensionList))
                        {
                            valid = false;
                            errorList.Add("MimeType");

                            if (response == null)
                            {
                                response = new UploadValidationResponse()
                                {
                                    Success = false,
                                    UploadValidationError = UploadValidationError.MimeType,
                                    Message = "File extension does not match its content."
                                };
                            }
                        }

                        if (!ValidateMagicNumber(fileStream, fileExtension, uploadExtensionList))
                        {
                            valid = false;
                            errorList.Add("MagicNumber");

                            if (response == null)
                            {
                                response = new UploadValidationResponse()
                                {
                                    Success = false,
                                    UploadValidationError = UploadValidationError.MagicNumber,
                                    Message = "File extension does not match its content."
                                };
                            }
                        }
                    }
                }
                catch (Exception e)
                {
                    LogFactory.Exception(e);

                    valid = false;
                    errorList.Add("UnknownException");

                    response = new UploadValidationResponse()
                    {
                        Success = false,
                        UploadValidationError = UploadValidationError.UnknownException,
                        Message = "Validation failed"
                    };
                }

                LogFactory.UploadValidation("Upload Validation{0}Source: {1}{0}FileSize: {2}{0}FileExtension: {3}{0}MimeType: {4}{0}Result: {5}{0}Errors: {6}",
                    Environment.NewLine, GetStackTrace(), fileStream.Length, fileExtension, mimeType, valid.ToString(), errorList.Count > 0 ? string.Join(",", errorList.ToArray()) : "N/A");

                if (response != null)
                {
                    return response;
                }
                else
                {
                    return new UploadValidationResponse()
                    {
                        Success = true,
                        UploadValidationError = null
                    };
                }
            }
            else
            {
                return new UploadValidationResponse()
                {
                    Success = false,
                    UploadValidationError = UploadValidationError.UnknownException,
                    Message = "Validator not enabled"
                };
            }
        }

        private static bool ValidateFileSize(Stream fileStream, int maxFileBytes)
        {
            try
            {
                return fileStream != null && fileStream.Length <= maxFileBytes;
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
            }

            return false;
        }

        private static bool ValidateFileExtension(string fileExtension, string validFileExtensions)
        {
            try
            {
                return validFileExtensions.Split(',').Any(x => string.Equals(x, fileExtension, StringComparison.InvariantCultureIgnoreCase));
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
            }

            return false;
        }

        private static bool ValidateMimeType(string mimeType, List<UploadExtension> uploadExtensionList)
        {
            try
            {
                return uploadExtensionList.Any(x => x.mime_type.Split(',').Any(y => string.Equals(y.Trim(), mimeType.Trim(), StringComparison.InvariantCultureIgnoreCase)));
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
            }

            return false;
        }

        private static bool ValidateMagicNumber(Stream fileStream, string fileExtension, List<UploadExtension> uploadExtensionList)
        {
            bool valid = false;

            try
            {
                //csv and txt are exception to this. 
                if (string.Equals(fileExtension, "csv", StringComparison.InvariantCultureIgnoreCase)
                || string.Equals(fileExtension, "txt", StringComparison.InvariantCultureIgnoreCase))
                    return true;

                BinaryReader reader = new BinaryReader(fileStream);
                foreach (UploadExtension uploadExtension in uploadExtensionList)
                {
                    int offSet = uploadExtension.offset;
                    string magicNumber = uploadExtension.magic_number_net.Trim();

                    reader.BaseStream.Position = offSet;
                    byte[] data = reader.ReadBytes(100); // Read 16 bytes into an array  0x10
                    string dataHex = BitConverter.ToString(data);

                    if (dataHex.Contains(magicNumber.Trim()))
                    {
                        valid = true;
                        break;
                    }
                }
            }
            catch (Exception e)
            {
                LogFactory.Exception(e);
            }

            fileStream.Position = 0;

            return valid;
        }

        private static string GetStackTrace()
        {
            int upMethods = 1;
            MethodBase caller = new StackTrace().GetFrame(upMethods).GetMethod();
            while (caller != null && caller.DeclaringType != null && caller.DeclaringType.ToString() == "BIACore.Utility.UploadValidation")
            {
                upMethods++;
                caller = new StackTrace().GetFrame(upMethods).GetMethod();
            }
            return (caller == null || caller.DeclaringType == null) ? string.Empty :
                 string.Format("{0}:{1}", caller.DeclaringType.ToString(), caller.Name);
        }
    }
}
