//@CustomCode
using programming_trainer.Logic.Entities.Data;
using programming_trainer.Logic.Entities.App;
using System.Globalization;

namespace programming_trainer.ConApp.Apps
{
    /// <summary>
    /// Partial class for StarterApp containing CSV import logic.
    /// </summary>
    public partial class StarterApp
    {
        #region constants
        private const string ProgrammingLanguageCsvPath = "Data/programming_language_set.csv";
        private const string CategoryCsvPath = "Data/category_set.csv";
        private const string StudentCsvPath = "Data/student_set.csv";
        #endregion constants

        #region partial method implementations
        /// <summary>
        /// Adds additional menu items after the standard menu items.
        /// </summary>
        partial void AfterCreateMenuItems(ref int menuIdx, List<MenuItem> menuItems)
        {
            var idx = menuIdx;
            menuItems.Add(new MenuItem
            {
                Key = $"{++idx}",
                Text = ToLabelText($"{nameof(ImportData).ToCamelCaseSplit()}", "Import data from CSV files"),
                Action = (self) =>
                {
#if DEBUG && DEVELOP_ON
                    PrintHeader();
                    var success = ImportData();
                    
                    if (success)
                    {
                        Console.ForegroundColor = ConsoleColor.Green;
                        PrintLine("===================================================");
                        PrintLine("SUCCESS - CSV Import completed!");
                        PrintLine("===================================================");
                        Console.ResetColor();
                    }
                    else
                    {
                        Console.ForegroundColor = ConsoleColor.Red;
                        PrintLine("===================================================");
                        PrintLine("FAILED - CSV Import failed!");
                        PrintLine("===================================================");
                        Console.ResetColor();
                    }
                    
                    PrintLine();
                    PrintLine("Press any key to continue...");
                    Console.ReadKey();
#endif
                },
#if DEBUG && DEVELOP_ON
                ForegroundColor = ConsoleApplication.ForegroundColor,
#else
                ForegroundColor = ConsoleColor.Red,
#endif
            });
            menuIdx = idx;
        }
        #endregion partial method implementations

        #region import methods
        /// <summary>
        /// Imports all data from CSV files.
        /// Returns true if successful, false otherwise.
        /// </summary>
        private bool ImportData()
        {
            try
            {
                PrintLine("Starting data import...");
                PrintLine();

                var plSuccess = ImportProgrammingLanguages();
                var catSuccess = ImportCategories();
                var studentSuccess = ImportStudents();

                PrintLine();
                PrintLine($"Programming Languages Import: {(plSuccess ? "SUCCESS" : "FAILED")}");
                PrintLine($"Categories Import: {(catSuccess ? "SUCCESS" : "FAILED")}");
                PrintLine($"Students Import: {(studentSuccess ? "SUCCESS" : "FAILED")}");

                return plSuccess && catSuccess && studentSuccess;
            }
            catch (Exception ex)
            {
                PrintLine($"CRITICAL ERROR: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Imports programming languages from CSV file.
        /// </summary>
        private bool ImportProgrammingLanguages()
        {
            try
            {
                if (!File.Exists(ProgrammingLanguageCsvPath))
                {
                    PrintLine($"ERROR: CSV file not found at: {ProgrammingLanguageCsvPath}");
                    return false;
                }

                var lines = File.ReadAllLines(ProgrammingLanguageCsvPath);
                
                if (lines.Length < 2)
                {
                    PrintLine("ERROR: Programming Languages CSV file is empty or contains only header.");
                    return false;
                }

                using var context = CreateContext();
                var dataLines = lines.Skip(1).ToArray();

                PrintLine($"Processing {dataLines.Length} programming languages...");

                int created = 0, skipped = 0;

                foreach (var line in dataLines)
                {
                    try
                    {
                        var columns = line.Split(';');
                        if (columns.Length != 3) { skipped++; continue; }

                        var name = columns[0].Trim();
                        var fileExtension = columns[1].Trim();
                        var isActive = bool.Parse(columns[2].Trim());

                        // Check if already exists
                        var task = Task.Run(async () => await context.ProgrammingLanguageSet.GetAsync());
                        if (task.Result.Any(pl => pl.Name == name))
                        {
                            skipped++;
                            continue;
                        }

                        var programmingLanguage = new ProgrammingLanguage
                        {
                            Name = name,
                            FileExtension = fileExtension,
                            IsActive = isActive
                        };

                        Task.Run(async () => await context.ProgrammingLanguageSet.AddAsync(programmingLanguage)).Wait();
                        created++;
                    }
                    catch (Exception lineEx)
                    {
                        PrintLine($"ERROR: {lineEx.Message}");
                        skipped++;
                    }
                }

                Task.Run(async () => await context.SaveChangesAsync()).Wait();

                Console.ForegroundColor = ConsoleColor.Cyan;
                PrintLine($"Programming Languages Created: {created}, Skipped: {skipped}");
                Console.ResetColor();
                
                return true;
            }
            catch (Exception ex)
            {
                PrintLine($"ERROR importing programming languages: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Imports categories from CSV file.
        /// </summary>
        private bool ImportCategories()
        {
            try
            {
                if (!File.Exists(CategoryCsvPath))
                {
                    PrintLine($"ERROR: CSV file not found at: {CategoryCsvPath}");
                    return false;
                }

                var lines = File.ReadAllLines(CategoryCsvPath);
                
                if (lines.Length < 2)
                {
                    PrintLine("ERROR: Categories CSV file is empty or contains only header.");
                    return false;
                }

                using var context = CreateContext();
                var dataLines = lines.Skip(1).ToArray();

                PrintLine($"Processing {dataLines.Length} categories...");

                int created = 0, skipped = 0;

                foreach (var line in dataLines)
                {
                    try
                    {
                        var columns = line.Split(';');
                        if (columns.Length != 2) { skipped++; continue; }

                        var name = columns[0].Trim();
                        var description = columns[1].Trim();

                        // Check if already exists
                        var task = Task.Run(async () => await context.CategorySet.GetAsync());
                        if (task.Result.Any(c => c.Name == name))
                        {
                            skipped++;
                            continue;
                        }

                        var category = new Category
                        {
                            Name = name,
                            Description = description
                        };

                        Task.Run(async () => await context.CategorySet.AddAsync(category)).Wait();
                        created++;
                    }
                    catch (Exception lineEx)
                    {
                        PrintLine($"ERROR: {lineEx.Message}");
                        skipped++;
                    }
                }

                Task.Run(async () => await context.SaveChangesAsync()).Wait();

                Console.ForegroundColor = ConsoleColor.Cyan;
                PrintLine($"Categories Created: {created}, Skipped: {skipped}");
                Console.ResetColor();
                
                return true;
            }
            catch (Exception ex)
            {
                PrintLine($"ERROR importing categories: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Imports students from CSV file.
        /// </summary>
        private bool ImportStudents()
        {
            try
            {
                if (!File.Exists(StudentCsvPath))
                {
                    PrintLine($"ERROR: CSV file not found at: {StudentCsvPath}");
                    return false;
                }

                var lines = File.ReadAllLines(StudentCsvPath);
                
                if (lines.Length < 2)
                {
                    PrintLine("ERROR: Students CSV file is empty or contains only header.");
                    return false;
                }

                using var context = CreateContext();
                var dataLines = lines.Skip(1).ToArray();

                PrintLine($"Processing {dataLines.Length} students...");

                int created = 0, skipped = 0;

                foreach (var line in dataLines)
                {
                    try
                    {
                        var columns = line.Split(';');
                        if (columns.Length != 5) { skipped++; continue; }

                        var firstName = columns[0].Trim();
                        var lastName = columns[1].Trim();
                        var email = columns[2].Trim();
                        var studentNumber = columns[3].Trim();
                        var registrationDateStr = columns[4].Trim();

                        if (!DateTime.TryParse(registrationDateStr, out var registrationDate))
                        {
                            skipped++;
                            continue;
                        }

                        // Check if already exists
                        var task = Task.Run(async () => await context.StudentSet.GetAsync());
                        if (task.Result.Any(s => s.Email == email || s.StudentNumber == studentNumber))
                        {
                            skipped++;
                            continue;
                        }

                        var student = new Student
                        {
                            FirstName = firstName,
                            LastName = lastName,
                            Email = email,
                            StudentNumber = studentNumber,
                            RegistrationDate = registrationDate
                        };

                        Task.Run(async () => await context.StudentSet.AddAsync(student)).Wait();
                        created++;
                    }
                    catch (Exception lineEx)
                    {
                        PrintLine($"ERROR: {lineEx.Message}");
                        skipped++;
                    }
                }

                Task.Run(async () => await context.SaveChangesAsync()).Wait();

                Console.ForegroundColor = ConsoleColor.Cyan;
                PrintLine($"Students Created: {created}, Skipped: {skipped}");
                Console.ResetColor();
                
                return true;
            }
            catch (Exception ex)
            {
                PrintLine($"ERROR importing students: {ex.Message}");
                return false;
            }
        }
        #endregion import methods
    }
}
