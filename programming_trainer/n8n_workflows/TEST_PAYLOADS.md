# N8N Workflow Test Payloads

Diese Datei enthält Beispiel-Payloads für manuelle Tests der n8n Workflows.

---

## ?? Workflow 1: C# Aufgaben Generator

### Test-URL (Development)
```
POST http://localhost:5678/webhook-test/generate-assignment
```

### Beispiel 1: Bubble Sort Aufgabe

```json
{
  "assignmentId": 42,
  "studentId": 1,
  "studentPrompt": "Erstelle eine Aufgabe über Sortieralgorithmen mit Bubble Sort",
  "categoryId": 2,
  "programmingLanguageId": 1
}
```

### Beispiel 2: Fibonacci Rekursion

```json
{
  "assignmentId": 43,
  "studentId": 1,
  "studentPrompt": "Ich möchte eine Aufgabe über rekursive Funktionen, speziell die Fibonacci-Folge",
  "categoryId": 3,
  "programmingLanguageId": 1
}
```

### Beispiel 3: Liste filtern und sortieren

```json
{
  "assignmentId": 44,
  "studentId": 2,
  "studentPrompt": "Eine Aufgabe über LINQ: Eine Liste von Produkten filtern (Preis > 50€) und nach Name sortieren",
  "categoryId": 4,
  "programmingLanguageId": 1
}
```

### Beispiel 4: Async/Await mit API

```json
{
  "assignmentId": 45,
  "studentId": 2,
  "studentPrompt": "Aufgabe über async/await: Mehrere API-Calls parallel ausführen und Ergebnisse kombinieren",
  "categoryId": 5,
  "programmingLanguageId": 1
}
```

### Beispiel 5: JavaScript Promise Chain

```json
{
  "assignmentId": 46,
  "studentId": 3,
  "studentPrompt": "Eine Aufgabe über Promise Chaining in JavaScript mit fetch API",
  "categoryId": 6,
  "programmingLanguageId": 2
}
```

### Beispiel 6: Python List Comprehension

```json
{
  "assignmentId": 47,
  "studentId": 3,
  "studentPrompt": "Erstelle eine Aufgabe über List Comprehensions in Python mit Filtern und Mapping",
  "categoryId": 7,
  "programmingLanguageId": 3
}
```

---

## ?? Workflow 2: C# Code Bewerter

### Test-URL (Development)
```
POST http://localhost:5678/webhook-test/evaluate-assignment
```

### Beispiel 1: Bubble Sort - Gute Lösung (Score: ~95)

```json
{
  "assignmentId": 42,
  "submittedCode": "public int[] BubbleSort(int[] array)\n{\n    if (array == null || array.Length <= 1)\n        return array;\n\n    int n = array.Length;\n    for (int i = 0; i < n - 1; i++)\n    {\n        bool swapped = false;\n        for (int j = 0; j < n - i - 1; j++)\n        {\n            if (array[j] > array[j + 1])\n            {\n                // Swap elements\n                int temp = array[j];\n                array[j] = array[j + 1];\n                array[j + 1] = temp;\n                swapped = true;\n            }\n        }\n        // Optimization: If no swap occurred, array is sorted\n        if (!swapped)\n            break;\n    }\n    return array;\n}",
  "description": "Implementieren Sie den Bubble Sort Algorithmus in C#.\n\nAnforderungen:\n1. Die Funktion heißt BubbleSort\n2. Parameter: int[] array\n3. Rückgabe: int[] (sortiertes Array)\n4. Implementieren Sie den klassischen Bubble Sort mit verschachtelten Schleifen\n5. Optimieren Sie mit einem 'swapped' Flag\n\nBeispiel:\nInput: [64, 34, 25, 12, 22, 11, 90]\nOutput: [11, 12, 22, 25, 34, 64, 90]",
  "programmingLanguageId": 1
}
```

### Beispiel 2: Bubble Sort - Einfache Lösung (Score: ~70)

```json
{
  "assignmentId": 42,
  "submittedCode": "public int[] BubbleSort(int[] array)\n{\n    int n = array.Length;\n    for (int i = 0; i < n - 1; i++)\n    {\n        for (int j = 0; j < n - i - 1; j++)\n        {\n            if (array[j] > array[j + 1])\n            {\n                int temp = array[j];\n                array[j] = array[j + 1];\n                array[j + 1] = temp;\n            }\n        }\n    }\n    return array;\n}",
  "description": "Implementieren Sie den Bubble Sort Algorithmus in C#.\n\nAnforderungen:\n1. Die Funktion heißt BubbleSort\n2. Parameter: int[] array\n3. Rückgabe: int[] (sortiertes Array)\n4. Implementieren Sie den klassischen Bubble Sort mit verschachtelten Schleifen\n5. Optimieren Sie mit einem 'swapped' Flag\n\nBeispiel:\nInput: [64, 34, 25, 12, 22, 11, 90]\nOutput: [11, 12, 22, 25, 34, 64, 90]",
  "programmingLanguageId": 1
}
```

### Beispiel 3: Fibonacci - Perfekte Lösung (Score: ~100)

```json
{
  "assignmentId": 43,
  "submittedCode": "public int Fibonacci(int n)\n{\n    if (n < 0)\n        throw new ArgumentException(\"n must be non-negative\", nameof(n));\n    \n    if (n <= 1)\n        return n;\n    \n    return Fibonacci(n - 1) + Fibonacci(n - 2);\n}",
  "description": "Implementieren Sie eine rekursive Funktion zur Berechnung der Fibonacci-Folge.\n\nAnforderungen:\n1. Funktionsname: Fibonacci\n2. Parameter: int n (Position in der Folge)\n3. Rückgabe: int (Fibonacci-Zahl an Position n)\n4. Verwenden Sie Rekursion\n5. Berücksichtigen Sie die Basisfälle (n = 0 und n = 1)\n\nBeispiele:\n- Fibonacci(0) = 0\n- Fibonacci(1) = 1\n- Fibonacci(5) = 5\n- Fibonacci(10) = 55",
  "programmingLanguageId": 1
}
```

### Beispiel 4: Fibonacci - Ohne Error Handling (Score: ~85)

```json
{
  "assignmentId": 43,
  "submittedCode": "public int Fibonacci(int n)\n{\n    if (n <= 1)\n        return n;\n    \n    return Fibonacci(n - 1) + Fibonacci(n - 2);\n}",
  "description": "Implementieren Sie eine rekursive Funktion zur Berechnung der Fibonacci-Folge.\n\nAnforderungen:\n1. Funktionsname: Fibonacci\n2. Parameter: int n (Position in der Folge)\n3. Rückgabe: int (Fibonacci-Zahl an Position n)\n4. Verwenden Sie Rekursion\n5. Berücksichtigen Sie die Basisfälle (n = 0 und n = 1)\n\nBeispiele:\n- Fibonacci(0) = 0\n- Fibonacci(1) = 1\n- Fibonacci(5) = 5\n- Fibonacci(10) = 55",
  "programmingLanguageId": 1
}
```

### Beispiel 5: LINQ Filter - Gute Lösung (Score: ~90)

```json
{
  "assignmentId": 44,
  "submittedCode": "using System.Linq;\n\npublic class Product\n{\n    public string Name { get; set; }\n    public decimal Price { get; set; }\n}\n\npublic IEnumerable<Product> FilterAndSortProducts(List<Product> products)\n{\n    if (products == null)\n        throw new ArgumentNullException(nameof(products));\n    \n    return products\n        .Where(p => p.Price > 50)\n        .OrderBy(p => p.Name)\n        .ToList();\n}",
  "description": "Implementieren Sie eine Methode die eine Liste von Produkten filtert und sortiert.\n\nAnforderungen:\n1. Verwenden Sie LINQ\n2. Filtern Sie Produkte mit Preis > 50€\n3. Sortieren Sie nach Name (alphabetisch)\n4. Rückgabe: IEnumerable<Product>\n5. Validieren Sie den Input\n\nBeispiel:\nInput: [{Name: \"Laptop\", Price: 899}, {Name: \"Mouse\", Price: 25}, {Name: \"Keyboard\", Price: 79}]\nOutput: [{Name: \"Keyboard\", Price: 79}, {Name: \"Laptop\", Price: 899}]",
  "programmingLanguageId": 1
}
```

### Beispiel 6: JavaScript Promise - Mittelmäßige Lösung (Score: ~65)

```json
{
  "assignmentId": 46,
  "submittedCode": "function fetchUserData(userId) {\n  return fetch(`https://api.example.com/users/${userId}`)\n    .then(response => response.json())\n    .then(user => {\n      return fetch(`https://api.example.com/posts?userId=${user.id}`);\n    })\n    .then(response => response.json())\n    .then(posts => {\n      return { user, posts };\n    });\n}",
  "description": "Implementieren Sie eine Funktion die User-Daten und deren Posts von einer API lädt.\n\nAnforderungen:\n1. Verwenden Sie die fetch API\n2. Promise Chaining\n3. Erst User laden, dann deren Posts\n4. Rückgabe: Promise mit { user, posts }\n5. Error Handling implementieren\n\nBeispiel:\nInput: userId = 1\nOutput: { user: {...}, posts: [...] }",
  "programmingLanguageId": 2
}
```

---

## ?? cURL Kommandos

### Workflow 1: Aufgabe generieren

```bash
curl -X POST http://localhost:5678/webhook-test/generate-assignment \
  -H "Content-Type: application/json" \
  -d '{
    "assignmentId": 42,
    "studentId": 1,
    "studentPrompt": "Erstelle eine Aufgabe über Sortieralgorithmen mit Bubble Sort",
    "categoryId": 2,
    "programmingLanguageId": 1
  }'
```

### Workflow 2: Code bewerten

```bash
curl -X POST http://localhost:5678/webhook-test/evaluate-assignment \
  -H "Content-Type: application/json" \
  -d '{
    "assignmentId": 42,
    "submittedCode": "public int[] BubbleSort(int[] array)\n{\n    int n = array.Length;\n    for (int i = 0; i < n - 1; i++)\n    {\n        for (int j = 0; j < n - i - 1; j++)\n        {\n            if (array[j] > array[j + 1])\n            {\n                int temp = array[j];\n                array[j] = array[j + 1];\n                array[j + 1] = temp;\n            }\n        }\n    }\n    return array;\n}",
    "description": "Implementieren Sie den Bubble Sort Algorithmus...",
    "programmingLanguageId": 1
  }'
```

---

## ?? Postman Collection

Importiere diese Collection in Postman für einfaches Testen:

```json
{
  "info": {
    "name": "N8N Programming Trainer Workflows",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Generate Assignment",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"assignmentId\": 42,\n  \"studentId\": 1,\n  \"studentPrompt\": \"Erstelle eine Aufgabe über Sortieralgorithmen mit Bubble Sort\",\n  \"categoryId\": 2,\n  \"programmingLanguageId\": 1\n}"
        },
        "url": {
          "raw": "http://localhost:5678/webhook-test/generate-assignment",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5678",
          "path": ["webhook-test", "generate-assignment"]
        }
      }
    },
    {
      "name": "Evaluate Assignment",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"assignmentId\": 42,\n  \"submittedCode\": \"public int[] BubbleSort(int[] array)\\n{\\n    int n = array.Length;\\n    for (int i = 0; i < n - 1; i++)\\n    {\\n        for (int j = 0; j < n - i - 1; j++)\\n        {\\n            if (array[j] > array[j + 1])\\n            {\\n                int temp = array[j];\\n                array[j] = array[j + 1];\\n                array[j + 1] = temp;\\n            }\\n        }\\n    }\\n    return array;\\n}\",\n  \"description\": \"Implementieren Sie den Bubble Sort Algorithmus...\",\n  \"programmingLanguageId\": 1\n}"
        },
        "url": {
          "raw": "http://localhost:5678/webhook-test/evaluate-assignment",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5678",
          "path": ["webhook-test", "evaluate-assignment"]
        }
      }
    }
  ]
}
```

---

## ?? Erwartete Responses

### Erfolgreiche Response (beide Workflows)

```json
{
  "executionId": "abc123-execution-id",
  "status": "running",
  "assignmentId": 42,
  "message": "Assignment generation workflow started"
}
```

### Fehler Response

```json
{
  "success": false,
  "assignmentId": 42,
  "error": "Fehler beim Parsen der AI Response: ...",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## ?? Tipps für Tests

1. **Teste erst den "Generate" Workflow** bevor du "Evaluate" testest
2. **Verwende Test-URLs** (`/webhook-test/...`) für manuelle Tests
3. **Prüfe n8n Executions** nach jedem Test um Fehler zu sehen
4. **Starte mit einfachen Prompts** und steigere die Komplexität
5. **Teste verschiedene Programmiersprachen** (ID 1-5)
6. **Teste Edge Cases** (leerer Code, sehr langer Code, ungültige Syntax)
