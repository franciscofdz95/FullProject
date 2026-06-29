using System;
using System.Diagnostics;
using System.Reflection;

namespace BIACore.Provider
{
    public static class ConnectionUser
    {
        internal static string EncryptAuthKey(string authKey)
        {
            if (BIACore.Settings.Config.Testnet) //TODO, this logic should change once we officially move to TestNet..
                return BIACore.Utility.Encryption.AES256.Encrypt(authKey, ConnectionProtectedKey.ENCRYPT_DECRYPT_KEY);
            else
            {
                //return BIACore.Utility.Encryption.EncryptRIGHT.Encrypt(authKey);

                return BIACore.Utility.Encryption.Hashicorp.Encrypt(authKey);

            }

        }

        internal static string DecryptAuthKey(string encryptString)
        {
            if (BIACore.Settings.Config.Testnet)
                return BIACore.Utility.Encryption.AES256.Decrypt(encryptString, ConnectionProtectedKey.ENCRYPT_DECRYPT_KEY);
            else
            {
                //return BIACore.Utility.Encryption.EncryptRIGHT.Decrypt(encryptString);

                if (IsBIACore()) return BIACore.Utility.Encryption.Hashicorp.DecryptInternal(encryptString).Result;
                else return BIACore.Utility.Encryption.Hashicorp.Decrypt(encryptString);

            }
        }

        private static bool IsBIACore()
        {
            int upMethods = 0;
            bool properCallingLocation = false;
            StackFrame test = null;
            try
            {
                MethodBase caller = new StackTrace().GetFrame(upMethods).GetMethod();

                while (caller != null)
                {
                    if (caller.DeclaringType.ToString() == "BIACore.WebAPI.ConnectionInit" && caller.Name == "InitializeConnections")
                    {
                        properCallingLocation = true;
                        break;
                    }
                    upMethods++;
                    test = new StackTrace().GetFrame(upMethods);
                    if (test != null) caller = new StackTrace().GetFrame(upMethods).GetMethod();
                    else caller = null;
                }
            }
            catch (Exception ex)
            { //do nothing
                return properCallingLocation;
            }
            return properCallingLocation;
        }
        
        public static string EncryptAuthKeyForSaving(string authKey)
        {
            int upMethods = 1;
            bool properCallingLocation = false;
            MethodBase caller = new StackTrace().GetFrame(upMethods).GetMethod();
            while (caller != null)
            {
                if (caller.DeclaringType.ToString() == "BIASecurity.WebAPI.Controller.BIASecurityController" && caller.Name == "AddEditConnectionUser")
                {
                    properCallingLocation = true;
                    break;
                }
                upMethods++;
                caller = new StackTrace().GetFrame(upMethods).GetMethod();
            }

            if (properCallingLocation) return ConnectionUser.EncryptAuthKey(authKey);
            else return null;
        }
    }
}
