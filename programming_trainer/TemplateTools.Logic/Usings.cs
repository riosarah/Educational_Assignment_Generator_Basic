//@CodeCopy

#if IDINT_ON
global using IdType = System.Int32;
#elif IDLONG_ON
    global using IdType = System.Int64;
#elif IDGUID_ON
    global using IdType = System.Guid;
#else
global using IdType = System.Int32;
#endif
global using Common = programming_trainer.Common;
global using CommonModules = programming_trainer.Common.Modules;
global using programming_trainer.Common.Extensions;
global using CommonStaticLiterals = programming_trainer.Common.StaticLiterals;
global using TemplatePath = programming_trainer.Common.Modules.Template.TemplatePath;
