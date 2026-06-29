using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Data;
using System.Net.Mail;

using BIACore.Agent;
using BIACore.Agent.Task;

using BIACore.Model;
using BIACore.Provider;

namespace BIAService
{
    public static class Loop
    {
        // returns a SQL command that will update the Connection AuthKeys for each SQL Connection
        public static string ConvertConnectionEncryptions()
        {
            DataTable table = SQL.Execute(Connections.Security, "[conObject].[GetUser]");
            string UserId, AuthKey; //TODO: ConnectionID or UserID? Any better unique identifier?
            string plain_password, new_encryption;
            string return_command = "";
            foreach (DataRow dr in table.Rows)
            {
                UserId = dr["UserId"].ToString();
                AuthKey = dr["AuthKey"].ToString();

                //plain_password = BIACore.Utility.Encryption.EncryptRIGHT.Decrypt(AuthKey);
                //new_encryption = BIACore.Utility.Encryption.Hashicorp.Encrypt(plain_password);
                /* if above doesn't work, can try below */
                //new_encryption = BIACore.Utility.Encryption.Hashicorp.Encrypt(plain_password).GetAwaiter().GetResult();

                //return_command += "update [BIASecurity].[conData].[User2] set AuthKey = '" + new_encryption + "' where UserId = " + UserId + ";\n";

                //SQL.ExecuteSQLRaw(Connections.Security, return_command, null);
            }
            return return_command;
        }

        //static void Main()
        //{
        //    try
        //    {
        //        string sql_update_command = ConvertConnectionEncryptions();
        //    }
        //    catch { }
        //}
    }
}