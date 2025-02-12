# {{title}}

## Pet Population Analysis

Our comprehensive survey reveals interesting patterns in pet ownership.

### Population Distribution
```mermaid
pie title {{chart.title}}
    "Dogs" : {{data.Dogs}}
    "Cats" : {{data.Cats}}
    "Fish" : {{data.Fish}}
    "Birds" : {{data.Birds}}
    "Hamsters" : {{data.Hamsters}}
    "Rabbits" : {{data.Rabbits}}
    "Guinea Pigs" : {{data.Guinea Pigs}}
    "Reptiles" : {{data.Reptiles}}
    "Ferrets" : {{data.Ferrets}}
    "Hedgehogs" : {{data.Hedgehogs}}
```

### Pet Care Complexity
```mermaid
graph TD
    A[Pet Selection] --> B{Care Level}
    B -->|Basic| C[Easy Care]
    B -->|Moderate| D[Medium Care]
    B -->|Complex| E[Advanced Care]
    
    C --> F[Fish]
    C --> G[Hamsters]
    C --> H[Guinea Pigs]
    
    D --> I[Cats]
    D --> J[Dogs]
    D --> K[Rabbits]
    
    E --> L[Birds]
    E --> M[Reptiles]
    E --> N[Ferrets]
    
    style C fill:#e1f5fe
    style D fill:#fff3e0
    style E fill:#fbe9e7
```

### Pet Maintenance Cost
```mermaid
graph LR
    A[Cost Categories] --> B[Low Cost]
    A --> C[Medium Cost]
    A --> D[High Cost]
    
    B --> E["Fish ($)"]
    B --> F["Hamsters ($)"]
    
    C --> G["Cats ($$)"]
    C --> H["Birds ($$)"]
    C --> I["Rabbits ($$)"]
    
    D --> J["Dogs ($$$)"]
    D --> K["Reptiles ($$$)"]
    
    style B fill:#c8e6c9
    style C fill:#fff9c4
    style D fill:#ffccbc
```

### Typical Lifespan Ranges
```mermaid
gantt
    title Pet Lifespan Expectations
    dateFormat X
    axisFormat %s Years
    
    section Small Pets
    Hamsters    : 0, 3
    Guinea Pigs : 0, 8
    Rabbits     : 0, 12
    
    section Common Pets
    Cats        : 0, 18
    Dogs        : 0, 15
    Birds       : 0, 20
    
    section Other Pets
    Fish        : 0, 10
    Reptiles    : 0, 25
    Ferrets     : 0, 8
```

{{conclusion}}

## Data Analysis Examples

### Python
```python
def analyze_pet_distribution(pets):
    total = sum(pets.values())
    percentages = {pet: (count/total * 100) for pet, count in pets.items()}
    most_popular = max(pets.items(), key=lambda x: x[1])
    return f"Among {total:,} pets surveyed, {most_popular[0]} are most popular with {percentages[most_popular[0]]:.1f}% of the total."
```

### JavaScript
```javascript
function calculatePetStats(petData) {
    const total = Object.values(petData).reduce((sum, count) => sum + count, 0);
    const stats = Object.entries(petData).map(([pet, count]) => ({
        pet,
        percentage: (count / total * 100).toFixed(1),
        count: count.toLocaleString()
    }));
    
    return stats.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
}
```

### Java
```java
public class PetAnalytics {
    public static Map<String, Double> calculateMarketShare(Map<String, Integer> petCounts) {
        int total = petCounts.values().stream().mapToInt(Integer::intValue).sum();
        
        return petCounts.entrySet().stream()
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                e -> (e.getValue() * 100.0) / total,
                (v1, v2) -> v1,
                TreeMap::new
            ));
    }
}
```

## Developer Notes

```bash
# Clone this Repository
git clone https://github.com/coatsnmore/reports.git

# Install dependencies
npm install

# Generate report
npm run generate
```
