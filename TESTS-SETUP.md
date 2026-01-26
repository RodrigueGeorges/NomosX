# 🧪 Configuration Tests NomosX

**Status actuel** : ❌ Aucun test configuré  
**Recommandation** : ✅ Installer Jest + React Testing Library

---

## 📊 État actuel

D'après l'audit, le projet obtient **6/10** en testabilité :
- ❌ Pas de tests unitaires
- ❌ Pas de framework de test installé
- ❌ Pas de script `npm test`
- ✅ Code modulaire et testable (architecture propre)

---

## 🚀 Installation Rapide

### Étape 1 : Installer les dépendances

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

### Étape 2 : Configuration Jest

Créer `jest.config.mjs` :

```javascript
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
}

export default createJestConfig(config)
```

### Étape 3 : Setup Jest

Créer `jest.setup.js` :

```javascript
import '@testing-library/jest-dom'
```

### Étape 4 : Ajouter scripts dans package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 🎯 Tests Prioritaires

### 1. Tests Agents (HAUTE PRIORITÉ)

#### `lib/agent/__tests__/scout.test.ts`

```typescript
import { scout } from '../pipeline-v2';

describe('SCOUT Agent', () => {
  it('should collect sources from multiple providers', async () => {
    const result = await scout('carbon tax', ['openalex'], 5);
    
    expect(result.found).toBeGreaterThan(0);
    expect(result.sourceIds).toBeInstanceOf(Array);
  });

  it('should handle provider failures gracefully', async () => {
    const result = await scout('test', ['invalid-provider'], 5);
    
    expect(result.errors).toBeDefined();
    expect(result.found).toBe(0);
  });
});
```

#### `lib/agent/__tests__/citation-guard.test.ts`

```typescript
import { citationGuard } from '../pipeline-v2';

describe('CITATION GUARD', () => {
  it('should pass when all citations are valid', () => {
    const analysis = {
      summary: 'Research shows [SRC-1] and [SRC-2] agree.',
    };
    
    const result = citationGuard(analysis, 3);
    
    expect(result.ok).toBe(true);
    expect(result.usedCount).toBe(2);
    expect(result.invalid).toEqual([]);
  });

  it('should fail when citation index is out of bounds', () => {
    const analysis = {
      summary: 'Research shows [SRC-5] is important.',
    };
    
    const result = citationGuard(analysis, 3);
    
    expect(result.ok).toBe(false);
    expect(result.invalid).toContain(5);
  });

  it('should fail when no citations present', () => {
    const analysis = {
      summary: 'Research shows things.',
    };
    
    const result = citationGuard(analysis, 3);
    
    expect(result.ok).toBe(false);
  });
});
```

### 2. Tests Validation Env (`lib/__tests__/env.test.ts`)

```typescript
import { z } from 'zod';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should validate required environment variables', () => {
    process.env.DATABASE_URL = 'postgresql://test';
    process.env.OPENAI_API_KEY = 'sk-test';
    
    expect(() => require('../env')).not.toThrow();
  });

  it('should throw when DATABASE_URL is missing', () => {
    delete process.env.DATABASE_URL;
    
    expect(() => require('../env')).toThrow();
  });
});
```

### 3. Tests Composants (`components/__tests__/DomainSelector.test.tsx`)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import DomainSelector from '../DomainSelector';

describe('DomainSelector', () => {
  it('should render all domains', () => {
    const mockOnChange = jest.fn();
    
    render(
      <DomainSelector
        selected={[]}
        onChange={mockOnChange}
        mode="multiple"
        compact
      />
    );
    
    expect(screen.getByText('Économie')).toBeInTheDocument();
    expect(screen.getByText('Sciences')).toBeInTheDocument();
  });

  it('should toggle domain selection', () => {
    const mockOnChange = jest.fn();
    
    render(
      <DomainSelector
        selected={[]}
        onChange={mockOnChange}
        mode="multiple"
        compact
      />
    );
    
    fireEvent.click(screen.getByText('Économie'));
    
    expect(mockOnChange).toHaveBeenCalledWith(['economie']);
  });
});
```

### 4. Tests Utils (`lib/__tests__/domains.test.ts`)

```typescript
import { getDomainBySlug, getDomainsBySlugs } from '../domains';

describe('Domain Utils', () => {
  it('should find domain by slug', () => {
    const domain = getDomainBySlug('economie');
    
    expect(domain).toBeDefined();
    expect(domain?.name).toBe('Économie');
    expect(domain?.color).toBe('#4C6EF5');
  });

  it('should return undefined for invalid slug', () => {
    const domain = getDomainBySlug('invalid');
    
    expect(domain).toBeUndefined();
  });

  it('should find multiple domains by slugs', () => {
    const domains = getDomainsBySlugs(['economie', 'ecologie']);
    
    expect(domains).toHaveLength(2);
    expect(domains[0].slug).toBe('economie');
    expect(domains[1].slug).toBe('ecologie');
  });
});
```

---

## 🎯 Tests API Routes

### `app/api/__tests__/domains.test.ts`

```typescript
import { GET } from '../domains/route';

describe('GET /api/domains', () => {
  it('should return domains distribution', async () => {
    const req = new Request('http://localhost:3000/api/domains');
    const response = await GET(req);
    const data = await response.json();
    
    expect(data.domains).toBeInstanceOf(Array);
    expect(data.total).toBeGreaterThanOrEqual(0);
  });

  it('should return domains sorted by sourceCount', async () => {
    const req = new Request('http://localhost:3000/api/domains');
    const response = await GET(req);
    const data = await response.json();
    
    if (data.domains.length > 1) {
      expect(data.domains[0].sourceCount).toBeGreaterThanOrEqual(
        data.domains[1].sourceCount
      );
    }
  });
});
```

---

## 📊 Objectifs de Couverture

| Catégorie          | Cible    | Priorité |
|--------------------|----------|----------|
| Agents (lib/agent) | >70%     | 🔴 HIGH  |
| Utils (lib/)       | >80%     | 🟡 MED   |
| Composants         | >60%     | 🟡 MED   |
| API Routes         | >50%     | 🟢 LOW   |
| **Global**         | **>60%** | **-**    |

---

## 🚀 Commandes

```bash
# Lancer tous les tests
npm test

# Mode watch (relance auto)
npm run test:watch

# Avec coverage
npm run test:coverage

# Tests spécifiques
npm test -- scout.test.ts

# Tests par pattern
npm test -- --testPathPattern=agent
```

---

## 📈 Résultats Attendus

Après installation complète :

```bash
$ npm run test:coverage

 PASS  lib/agent/__tests__/citation-guard.test.ts
 PASS  lib/__tests__/domains.test.ts
 PASS  components/__tests__/DomainSelector.test.tsx
 
Test Suites: 3 passed, 3 total
Tests:       12 passed, 12 total
Coverage:    62.4% (target: >60%)
Time:        4.328s
```

---

## 🔧 Intégration CI/CD

### GitHub Actions (`.github/workflows/test.yml`)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm install
      - run: npm run prisma:gen
      - run: npm test
      - run: npm run build
```

---

## ✅ Checklist Installation

- [ ] Installer dépendances (`npm install -D jest ...`)
- [ ] Créer `jest.config.mjs`
- [ ] Créer `jest.setup.js`
- [ ] Ajouter scripts `package.json`
- [ ] Créer premier test (`citation-guard.test.ts`)
- [ ] Lancer `npm test`
- [ ] Vérifier coverage `npm run test:coverage`
- [ ] Configurer CI/CD (optionnel)

---

## 🎓 Bonnes Pratiques

1. **Nommage** : `*.test.ts` ou `*.spec.ts`
2. **Organisation** : `__tests__/` dans chaque dossier
3. **Coverage** : >60% pour prod, >80% pour agents critiques
4. **Mocks** : Mocker Prisma avec `jest-mock-extended`
5. **Async** : Toujours `await` les agents
6. **Cleanup** : `afterEach` pour reset DB/mocks

---

## 📚 Ressources

- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

**Prêt à installer ?** Lancez :

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

Puis créez les fichiers de config et commencez par tester le **CITATION GUARD** (le plus critique) ! 🎯
