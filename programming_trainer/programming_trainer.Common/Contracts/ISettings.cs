//@CodeCopy
namespace programming_trainer.Common.Contracts
{
    public partial interface ISettings
    {
        string? this[string key] { get; }
    }
}
