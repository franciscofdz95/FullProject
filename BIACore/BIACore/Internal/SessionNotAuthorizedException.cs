using System;

namespace BIACore.Internal
{
    class SessionNotAuthorizedException : Exception
    {
        public SessionNotAuthorizedException() { }
        public SessionNotAuthorizedException(string message) : base(message) { }
        public SessionNotAuthorizedException(string message, Exception inner) : base(message, inner) { }
    }
}
