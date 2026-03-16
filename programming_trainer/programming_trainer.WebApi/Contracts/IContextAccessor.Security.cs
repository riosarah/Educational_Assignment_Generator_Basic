//@CodeCopy
#if ACCOUNT_ON
namespace programming_trainer.WebApi.Contracts
{
    partial interface IContextAccessor
    {
        string SessionToken { set; }
    }
}
#endif
