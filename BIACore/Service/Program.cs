using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ServiceProcess;

using BIACore.Log;
using BIACore;
using BIACore.Agent;
using BIACore.Agent.Task;
using System.Security.Claims;

namespace BIAService
{
    public class Program
    {

        public static string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

        public static string Reverse(string s)
        {
            char[] charArray = s.ToCharArray();
            Array.Reverse(charArray);
            return new string(charArray);

        }
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main(string[] args)
        {
            BIACore.Provider.ConnectionStrings.GetApplicationConnections();
            if (System.Diagnostics.Debugger.IsAttached)
            {
                string EncodeValue;
                string DecodeValue;
                string TestValue;

                //string temp1 = BIACore.Utility.Token.GetTokenValue("eWdbDsQNaQgCjGfox9xwp4NNnHu1990G+4NKWu5xMjhaqK4iKTBz3bMuzqrE1i9x/5jq6DipQN1SBt4ugVOzPTQwSjKEpVgvAC/8yZO3CDPxdX74woQsDkxgPbmCjQtCdx6Sfsy53YAQT7TWc4dSmagpq5E6bJat2qeTSD1PRYt0i/dsETJViq2VuKcvYHcTzq5L5YHicd6NK0RDIHT15iJhh0cyMIpXYCdJkaJCCe0SVBLItKRDb19LHMxELyYGSCi7YiqWF7b4DISk3qoOQJarDjSg9/Mb/hBoWEnwP2Jl0+84+pKPzKaT37b2zV16N6kCc8j1KP6nEKUpD1HuFg==");
                //string temp1 = BIACore.Utility.Token.GetTokenValue("eWdbDsQNaQgCjGfox9xwp4NNnHu1990G+4NKWu5xMjiU61B80q2sjYfwSRi+qc7EukhGbPJMm1ltONO/uObbsxiV+ivJQoyBYdFy1SUhRTEz7lqxx6nlsGgpEDtkHMCkMGZiHoz+NAt75VsZBCA5MEIizfXREDM0BrWEcZgbJCoqnyL43F4VWB9SbrPMEJYhAA75AcYsiOxC95ucfL0L5Sa+lzL3iCJQlX9aeTQIR8Lm/kOhPeO076yJeYIpt1JdtFxA5dFuQbycJyylyE/BdXMdc4FppTYJpNEBcMGkqHl0Yr81mELwnT6vkJHjCxG9axEhNurK0wkiRDnjvUNRww==");
                //temp1 = Reverse(temp1);
                //string temp1 = BIACore.Utility.Encryption.Hashicorp.Encrypt("hAwk-kaput~5585");

                string temp1 = BIACore.Utility.Encryption.AES256.Encrypt("Chain$1916", "WORKING as intended?");

                string temp2 = BIACore.Utility.Encryption.AES256.Decrypt("GkuEm9kwHK+JZemo2l8UJddWnIk+IakmtKPE7m1eZLXAI7PwdZGEVhzE0Q6siB6abVJbMTynwtbQSMluz3r0G7Qtl5yaNxhCk+dkhXEueAI4wbVuu+fUBP7VuD7ZZ2NL", "WORKING as intended?");

                Console.WriteLine(temp1);
                Console.WriteLine(temp2);
                Console.ReadKey();

                //Console.WriteLine(BIAService.Loop.ConvertConnectionEncryptions());
                //Console.WriteLine(AppDomain.CurrentDomain.BaseDirectory.ToString());
                //string TestValue2;
                //Console.Write("Press Ctrl-Break to escape\n");
                //do
                //{
                //    //string test = @"ABC123!@#$%^&*()_+-=/?.><,}]{[:;`~'\|";
                //    TestValue = "hiDe0ut~9778";
                //    //Console.WriteLine(BIACore.Utility.Randomizer.GetRandomID());
                //    Console.Write("INPUT: ");
                //    TestValue = Console.ReadLine();
                //    var KeyName = "Test";
                //    //EncodeValue = BIACore.Utility.Encryption.EncryptRIGHT.Encrypt(TestValue);
                //    //Task<int> returnedTaskTResult = GetTaskOfTResultAsync();
                //    //int intResult = await returnedTaskTResult;
                //    //Task<string> returnEncrypt = BIACore.Utility.Encryption.Hashicorp.Encrypt(KeyName, TestValue);
                //    //var EncodeValue2 = await returnEncrypt;

                //    var EncodeValue2 = BIACore.Utility.Encryption.Hashicorp.Encrypt(TestValue);
                //    //var EncodeValue2 = task1.GetAwaiter().GetResult();

                //    //DecodeValue = BIACore.Utility.Encryption.EncryptRIGHT.Decrypt(EncodeValue);

                //    var DecodeValue2 = BIACore.Utility.Encryption.Hashicorp.Decrypt(EncodeValue2);
                //    //var DecodeValue2 = task2.GetAwaiter().GetResult();

                //    //Console.Write("Test Value:      " + TestValue + "\n");
                //    //Console.Write("Encoded Return:  " + EncodeValue + "\n");
                //    Console.Write("Encoded Return 2:  " + EncodeValue2 + "\n");
                //    //Console.Write("Decoded Confirm: " + DecodeValue + "\n");
                //    Console.Write("Decoded Confirm 2: " + DecodeValue2 + "\n");
                //    //Console.Write("MATCH? " + (TestValue == DecodeValue).ToString() + "\n");
                //    //TestValue2 = "aE93ZXZlcn41MjAz";
                //    //Console.Write("Test Value2:      " + Base64Decode(TestValue2) + "\n");
                //    //Console.ReadKey();
                //} while (true);

                //Local Debugging run
                //Task.Email Email = new Task.Email();
                //Email.Run();
                //Task.ADSMNotify ADSMNotify = new Task.ADSMNotify();
                //ADSMNotify.Run();
                //Task.Notifications Notifications = new Task.Notifications();
                //Notifications.Run();
                //Task.WebConfigScan WebConfigScan = new Task.WebConfigScan();
                //WebConfigScan.Run();
                //Task.AppPing appPing = new Task.AppPing();
                //appPing.Run();
                //Task.RequestAccess Request = new Task.RequestAccess();
                //Request.Run();
                //Task.UserLookup Lookup = new Task.UserLookup();
                //Lookup.Run();
            }
            else
            {
                if (BIACore.Settings.Agent.Environment == "PROD")
                {
                    //Production
                    TaskManager t = new TaskManager(new List<BaseTask>() {
                    new Task.Email(),
                    new Task.MyReports(),
                    new Task.RequestAccess(),
                    new Task.UserLookup()
                });
                    t.Run(args);
                }
                else
                {
                    //Dev
                    TaskManager t = new TaskManager(new List<BaseTask>() {
                    new Task.Email(),
                    new Task.MyReports(),
                    //new Task.ADSMNotify(),
                    new Task.Notifications(),
                    //new Task.AppPing(),
                    new Task.WebConfigScan(),
                    new Task.RequestAccess(),
                    new Task.UserLookup()
                });
                    t.Run(args);
                }
            }
        }
    }
}
