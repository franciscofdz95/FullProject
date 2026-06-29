//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;

//namespace BIACore
//{
//    public static partial class Notify
//    {
//        public enum Frequency
//        {
//            Immediate,
//            Daily,
//            Weekly,
//        }

//        public static void Email(string Subject, string Message, Frequency Frequency)
//        {
//            try
//            {
//                Web.Client.Post(API.ExternalURL(API.NOTIFY_EMAIL), null);
//            }
//            catch { }
//        }
//    }
//}
