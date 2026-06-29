using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using BIACore.Extensions;

namespace BIACore.Server
{
    public class Token
    {
        private static string paddingStart = "N%*h%!kugQELfmNNmd7Q#ue3vv2&@q8wWz";
        private static string paddingEnd = "4+sMsWzvbE8v&$*WEzqJ+gXw28-%2Ca9@3";
        private static string keyPadding = "uv+kzR3g_p$&@N8aKzbeveut4zUQq42v";
        private static int encryptionSize = 256;

        private static byte[] GetSecretIV()
        {
            string ivSecretString = "Pickle";
            double ivPaddingLength = ((encryptionSize / 8) - ivSecretString.Length) / 2.0;
            string ivString = keyPadding.Substring(0, (int)Math.Floor(ivPaddingLength)) + ivSecretString + keyPadding.Substring(keyPadding.Length - (int)Math.Ceiling(ivPaddingLength), (int)Math.Ceiling(ivPaddingLength));
            return ivString.ToBytes();
        }

        private static byte[] GetSecretKey()
        {
            string keySecretString = "PickleKumquat";
            double keyPaddingLength = ((encryptionSize / 8) - keySecretString.Length) / 2.0;
            string keyString = keyPadding.Substring(0, (int)Math.Floor(keyPaddingLength)) + keySecretString + keyPadding.Substring(keyPadding.Length - (int)Math.Ceiling(keyPaddingLength), (int)Math.Ceiling(keyPaddingLength));
            return keyString.ToBytes();
        }

        public static string GetToken(string encryptString)
        {
            string token = null;

            if (!string.IsNullOrWhiteSpace(encryptString))
            {

                using (RijndaelManaged AES256 = new RijndaelManaged())
                {
                    AES256.KeySize = encryptionSize;
                    AES256.BlockSize = encryptionSize;
                    AES256.Mode = CipherMode.CBC;

                    AES256.Key = GetSecretKey();
                    AES256.IV = GetSecretIV();

                    ICryptoTransform encryptor = AES256.CreateEncryptor(AES256.Key, AES256.IV);

                    using (MemoryStream msEncrypt = new MemoryStream())
                    {
                        using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                        {
                            using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                            {
                                swEncrypt.Write(paddingStart + encryptString + paddingEnd);
                            }
                            token = Convert.ToBase64String(msEncrypt.ToArray());
                        }
                    }
                }
            }
            return token;
        }

        public static string GetTokenValue(string token)
        {
            string tokenValue = null, decryptedToken;

            if (!string.IsNullOrWhiteSpace(token))
            {
                byte[] tokenBytes = Convert.FromBase64String(token);

                using (RijndaelManaged AES256 = new RijndaelManaged())
                {
                    AES256.KeySize = encryptionSize;
                    AES256.BlockSize = encryptionSize;
                    AES256.Mode = CipherMode.CBC;

                    AES256.Key = GetSecretKey();
                    AES256.IV = GetSecretIV();

                    ICryptoTransform decryptor = AES256.CreateDecryptor(AES256.Key, AES256.IV);

                    using (MemoryStream msDecrypt = new MemoryStream(tokenBytes))
                    {
                        using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                            {
                                decryptedToken = srDecrypt.ReadToEnd();
                            }
                            tokenValue = decryptedToken.Substring(paddingStart.Length, decryptedToken.Length - paddingStart.Length - paddingEnd.Length);
                        }
                    }
                }
            }
            return tokenValue;
        }
    }
}