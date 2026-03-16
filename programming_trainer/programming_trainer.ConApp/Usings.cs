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

global using CommonContracts = programming_trainer.Common.Contracts;
global using CommonModules = programming_trainer.Common.Modules;
global using programming_trainer.Common.Extensions;
