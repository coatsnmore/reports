# {{title}}

## Pet Population Analysis

Our comprehensive survey reveals interesting patterns in pet ownership.

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
# Install dependencies
npm install

# Generate report
npm run generate
```
