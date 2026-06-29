using Newtonsoft.Json;
using System;
using System.IO;
using System.Net;

namespace BIACore.Utility.Encryption
{
    /// <summary>
    /// EncryptRIGHT class used within Encryption project
    /// </summary>
    //public static class EncryptRIGHT
    //{

    //    class CryptResponse
    //    {
    //        public string EncryptRIGHTVersion;
    //        public string ApiVersion;
    //        public string ApiFunction;
    //        public string ReturnCode;
    //        public string ReturnText;
    //        public string SecureResult;
    //        public string ClearResult;
    //    }

    //    class CryptRequest
    //    {
    //        public string ApiUi = "1";
    //        public string ApiKey
    //        {
    //            get
    //            {
    //                if (BIACore.Settings.Config.Testnet)
    //                    return "RBPoSQDL7HMANlUGAO3odwACa4MAkxjY"; // TestNet
    //                else
    //                    return "g8t9OAD3km8AYi0QAPCjWADh5e4AeyNL";   // Production
    //            }
    //        }
    //        public string ApiFunction = "NcrSecureData"; // or NcrUnSecureData
    //        public string MessageType = "Informational";
    //        public string DppName = "PWDDPP";
    //        public string DppVersion = "Latest";
    //        public string ClearData = "";
    //        public string SecureData = "";
    //        public string ResultType = "JSON";
    //    }

    //    /// <summary>
    //    /// Encrypt
    //    /// </summary>
    //    /// <param name="crypttext"></param>
    //    /// <returns></returns>
    //    public static string Encrypt(string crypttext)
    //    {
    //        return Crypt("encrypt", crypttext);
    //    }

    //    /// <summary>
    //    /// Base64Encode
    //    /// </summary>
    //    /// <param name="plainText"></param>
    //    /// <returns></returns>
    //    public static string Base64Encode(string plainText)
    //    {
    //        var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
    //        return System.Convert.ToBase64String(plainTextBytes);
    //    }

    //    /// <summary>
    //    /// Base64Decode
    //    /// </summary>
    //    /// <param name="base64EncodedData"></param>
    //    /// <returns></returns>
    //    public static string Base64Decode(string base64EncodedData)
    //    {
    //        var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
    //        return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
    //    }

    //    /// <summary>
    //    /// Decrypt
    //    /// </summary>
    //    /// <param name="crypttext"></param>
    //    /// <returns></returns>
    //    public static string Decrypt(string crypttext)
    //    {
    //        return Crypt("decrypt", crypttext);
    //    }

    //    /// <summary>
    //    /// Crypt for encrypt and decrypt
    //    /// </summary>
    //    /// <param name="apifunction"></param>
    //    /// <param name="crypttext"></param>
    //    /// <returns></returns>
    //    public static string Crypt(string apifunction, string crypttext)
    //    {
    //        CryptRequest apirequest = new CryptRequest();

    //        if (apifunction == "encrypt")
    //        {
    //            apifunction = "NcrSecureData";
    //            apirequest.ClearData = Base64Encode(crypttext);
    //        }
    //        else
    //        {
    //            apifunction = "NcrUnSecureData";
    //            apirequest.SecureData = crypttext;
    //        }

    //        apirequest.ApiFunction = apifunction;

    //        string URL = null;
    //        if (BIACore.Settings.Config.Testnet)
    //            URL = "https://ncrypt-win.ams1907.com/EncryptRIGHTapi";  // TestNet
    //        else
    //            URL = "https://ncrypt-win.inside.ups.com/EncryptRIGHTapi"; // production

    //        string DATA;

    //        DATA = JsonConvert.SerializeObject(apirequest);

    //        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(URL);
    //        request.Method = "POST";
    //        request.ContentType = "application/json";
    //        request.ContentLength = DATA.Length;
    //        using (Stream webStream = request.GetRequestStream())
    //        using (StreamWriter requestWriter = new StreamWriter(webStream, System.Text.Encoding.ASCII))
    //        {
    //            requestWriter.Write(DATA);
    //        }

    //        try
    //        {
    //            //throw new Exception();

    //            WebResponse webResponse = request.GetResponse();
    //            using (Stream webStream = webResponse.GetResponseStream() ?? Stream.Null)
    //            using (StreamReader responseReader = new StreamReader(webStream))
    //            {
    //                string response = responseReader.ReadToEnd();
    //                CryptResponse encresp;

    //                try
    //                {
    //                    encresp = JsonConvert.DeserializeObject<CryptResponse>(response);
    //                }
    //                catch
    //                {
    //                    return null;
    //                }

    //                if (apifunction == "NcrSecureData")
    //                {
    //                    crypttext = encresp.SecureResult;
    //                }
    //                else
    //                {
    //                    // The replace is to correct for C# escaping \ in the string on encryption! Do not remove M.Erdmann
    //                    crypttext = Base64Decode(encresp.ClearResult);
    //                }
    //            }
    //        }
    //        catch (Exception e)
    //        {
    //            BIACore.Log.LogFactory.Exception(e);
    //        }

    //        return crypttext;
    //    }

    //}
}
