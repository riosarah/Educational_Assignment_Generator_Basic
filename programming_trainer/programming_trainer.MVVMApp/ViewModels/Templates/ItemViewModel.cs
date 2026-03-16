//@CodeCopy
using programming_trainer.MVVMApp.Models.Templates;

namespace programming_trainer.MVVMApp.ViewModels.Templates
{
    public partial class ItemViewModel : GenericItemViewModel<ItemModel>
    {
        private string _name = string.Empty;

        public string Name
        {
            get { return _name; }
            set
            {
                _name = value;
                OnPropertyChanged();
            }
        }

    }
}
