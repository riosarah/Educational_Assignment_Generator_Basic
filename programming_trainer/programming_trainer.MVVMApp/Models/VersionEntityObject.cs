//@GeneratedCode
/*****************************************************************************************
  Please note that this file is regenerated each time it is generated
  and all your changes will be overwritten in this file.
  If you still want to make changes, you can do this in 2 ways:
  
  1. Use a 'partial class name' according to the following pattern:
  
  #if GENERATEDCODE_ON
  namespace_name {
    partial class ClassName
    {
      partial void BeforeExecute(ref bool handled)
      {
        //... do something
        handled = true;
      }
    }
   }
  #endif
  
  2. Change the label //@GeneratedCode to //@CustomizedCode, for example.
     Alternatively, you can also remove the label or give it a different name.
*****************************************************************************************/
namespace programming_trainer.MVVMApp.Models
{
    using System;
    /// <summary>
    /// This model represents a transmission model for the 'VersionEntityObject' data unit.
    /// </summary>

    public partial class VersionEntityObject : programming_trainer.Common.Contracts.IVersionEntityObject
    {
        /// <summary>
        /// Initializes the class (created by the generator).
        /// </summary>
        static VersionEntityObject()
        {
            ClassConstructing();
            ClassConstructed();
        }
        /// <summary>
        /// This method is called before the construction of the class.
        /// </summary>
        static partial void ClassConstructing();
        /// <summary>
        /// This method is called when the class is constructed.
        /// </summary>
        static partial void ClassConstructed();

        /// <summary>
        /// Initializes a new instance of the <see cref="VersionEntityObject"/> class (created by the generator.)
        /// </summary>
        public VersionEntityObject()
        {
            Constructing();

            Constructed();
        }
        /// <summary>
        /// This method is called when the object is constructed.
        /// </summary>
        partial void Constructing();
        /// <summary>
        /// This method is called after the object has been initialized.
        /// </summary>
        partial void Constructed();
    }
}
