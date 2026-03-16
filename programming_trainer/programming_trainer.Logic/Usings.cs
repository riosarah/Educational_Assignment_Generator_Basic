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
global using CommonEnums = programming_trainer.Common.Enums;
global using CommonContracts = programming_trainer.Common.Contracts;
global using CommonModels = programming_trainer.Common.Models;
global using CommonModules = programming_trainer.Common.Modules;
global using programming_trainer.Common.Extensions;
global using System.ComponentModel.DataAnnotations;
global using System.ComponentModel.DataAnnotations.Schema;
global using Microsoft.EntityFrameworkCore;
global using Validator = programming_trainer.Common.Modules.Validations.Validator;

