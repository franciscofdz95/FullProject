using BIACore.Extensions;
using System;
using System.IO;
using System.Security.Cryptography;

namespace BIACore.Utility.Encryption
{
    public static class AES256
    {

        private static string paddingStart = "kugQELfmNNmd7Q#ue3vv2&@q8wWzN%*h%!";
        private static string paddingEnd = "WzvbE8v&$*WEzqJ+gXw28-%2Ca9@34+sMs";
        private static string keyPadding = "zR3g_p$&@N8aKzbeveut4zUQq42vuv+k";
        private static int encryptionSize = 256;

        private static byte[] GetSecretIV()
        {
            string ivSecretString = "VerySecure";
            double ivPaddingLength = ((encryptionSize / 8) - ivSecretString.Length) / 2.0;
            string ivString = keyPadding.Substring(0, (int)Math.Floor(ivPaddingLength)) + ivSecretString + keyPadding.Substring(keyPadding.Length - (int)Math.Ceiling(ivPaddingLength), (int)Math.Ceiling(ivPaddingLength));
            return ivString.ToBytes();
        }

        private static byte[] GetSecretKey(string Key)
        {
            string keySecretString = Key;
            double keyPaddingLength = ((encryptionSize / 8) - keySecretString.Length) / 2.0;
            string keyString = keyPadding.Substring(0, (int)Math.Floor(keyPaddingLength)) + keySecretString + keyPadding.Substring(keyPadding.Length - (int)Math.Ceiling(keyPaddingLength), (int)Math.Ceiling(keyPaddingLength));
            return keyString.ToBytes();
        }

        public static string Encrypt(string stringToEncrypt, string Key)
        {
            string encryptedString = null;

            if (!string.IsNullOrWhiteSpace(stringToEncrypt))
            {

                using (RijndaelManaged AES256 = new RijndaelManaged())
                {
                    AES256.KeySize = encryptionSize;
                    AES256.BlockSize = encryptionSize;
                    AES256.Mode = CipherMode.CBC;

                    AES256.Key = GetSecretKey(Key);
                    AES256.IV = GetSecretIV();

                    ICryptoTransform encryptor = AES256.CreateEncryptor(AES256.Key, AES256.IV);

                    using (MemoryStream msEncrypt = new MemoryStream())
                    {
                        using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                        {
                            using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                            {
                                swEncrypt.Write(paddingStart + stringToEncrypt + paddingEnd);
                            }
                            encryptedString = Convert.ToBase64String(msEncrypt.ToArray());
                        }
                    }
                }
            }
            return encryptedString;
        }

        public static string Decrypt(string stringToDecrypt, string Key)
        {
            string decryptedValue = null, decryptedToken;

            if (!string.IsNullOrWhiteSpace(stringToDecrypt))
            {
                byte[] tokenBytes = Convert.FromBase64String(stringToDecrypt);

                using (RijndaelManaged AES256 = new RijndaelManaged())
                {
                    AES256.KeySize = encryptionSize;
                    AES256.BlockSize = encryptionSize;
                    AES256.Mode = CipherMode.CBC;

                    AES256.Key = GetSecretKey(Key);
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
                            decryptedValue = decryptedToken.Substring(paddingStart.Length, decryptedToken.Length - paddingStart.Length - paddingEnd.Length);
                        }
                    }
                }
            }
            return decryptedValue;
        }
    }
}
