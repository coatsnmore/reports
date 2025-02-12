# Report Generator

A Node.js program that generates reports with Mermaid diagrams from JSON input.

## Features

- Converts JSON data into formatted Markdown reports
- Generates multiple types of Mermaid diagrams
- Supports PDF output
- Handles complex data relationships

## Architecture

```mermaid
classDiagram
    class ReportGenerator {
        +generateReport()
        +processInput()
        +renderDiagrams()
        +createPDF()
    }
    class InputProcessor {
        +parseJSON()
        +validateData()
    }
    class DiagramRenderer {
        +createFlowchart()
        +createPieChart()
        +createGantt()
        +createSequence()
    }
    class PDFGenerator {
        +convertMarkdown()
        +applyStyles()
        +savePDF()
    }
    ReportGenerator --> InputProcessor
    ReportGenerator --> DiagramRenderer
    ReportGenerator --> PDFGenerator
```

## Example Diagrams

### Flow Charts

```mermaid
graph TD
    A[Start] --> B{Pet Type?}
    B -->|Dog| C[Daily Walks]
    B -->|Cat| D[Litter Box]
    B -->|Fish| E[Tank Maintenance]
    C --> F[Exercise Complete]
    D --> F
    E --> F
```

### Pie Charts

```mermaid
pie title Pet Ownership Distribution
    "Dogs" : 24
    "Cats" : 21
    "Fish" : 18
    "Birds" : 11
    "Other" : 26
```

### Gantt Charts

```mermaid
gantt
    title Pet Care Schedule
    dateFormat  YYYY-MM-DD
    section Daily Tasks
    Feed Pets           :a1, 2024-01-01, 1d
    Clean Litter Box    :a2, after a1, 1d
    Walk Dogs          :a3, after a2, 1d
    
    section Weekly Tasks
    Deep Clean         :2024-01-01, 7d
    Grooming          :2024-01-03, 3d
```

### Sequence Diagrams

```mermaid
sequenceDiagram
    participant O as Owner
    participant P as Pet
    participant V as Vet
    
    O->>P: Feed
    P->>O: Show affection
    O->>V: Schedule checkup
    V->>P: Examine
    V->>O: Provide health report
```

## Usage

1. Install dependencies:
```bash
npm install
```

2. Create your input JSON file:
```json
{
  "title": "Pet Report",
  "data": {
    "pets": [
      {
        "type": "Dog",
        "count": 24
      },
      {
        "type": "Cat",
        "count": 21
      }
    ]
  }
}
```

3. Run the generator:
```bash
npm run generate
```

## Customization

You can customize the report by:
- Modifying the input JSON structure
- Editing the Markdown templates
- Adjusting the Mermaid diagram styles
- Configuring PDF output settings

## Contributing

Contributions welcome! Please read the contributing guidelines first.

## License

MIT
