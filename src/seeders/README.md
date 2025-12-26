# Database Seeders

এই ফোল্ডারে database seeding scripts রয়েছে যা দিয়ে আপনি initial data populate করতে পারবেন।

## Zone Seeder

Zone এবং Zone Pricing data seed করার জন্য।

### কি Data Seed হবে:

#### 🌍 Zones (৫টি):
1. **Zone 1 - North America** (US, CA, MX)
2. **Zone 2 - Europe** (GB, DE, FR, IT, ES, NL, BE, SE, NO, DK, FI, PL, AT, CH)
3. **Zone 3 - Asia Pacific** (CN, JP, KR, SG, HK, TW, AU, NZ, TH, MY, ID, PH, VN, IN, BD)
4. **Zone 4 - Middle East & Africa** (AE, SA, QA, KW, BH, OM, IL, TR, EG, ZA, KE, NG)
5. **Zone 5 - South America** (BR, AR, CL, CO, PE, VE, EC, UY)

#### 💰 Zone Pricing (৫০টি):
- প্রতিটি zone থেকে প্রতিটি zone এ shipping price
- দুই ধরনের shipping: **Standard** এবং **Express**
- সব price USD তে
- Delivery duration সহ

### কিভাবে Run করবেন:

#### Option 1: NPM Script (সহজ)
```bash
npm run seed:zones
```

#### Option 2: Direct Command
```bash
ts-node-dev src/seeders/zone.seeder.ts
```

#### Option 3: Yarn
```bash
yarn seed:zones
```

### ⚠️ গুরুত্বপূর্ণ নোট:

1. **Data Clear হবে**: এই seeder run করলে আগের সব zone এবং zone pricing data **delete** হয়ে যাবে এবং নতুন data insert হবে।

2. **Database Connection**: Seeder automatically আপনার `.env` file থেকে database connection নিবে।

3. **Production এ সাবধান**: Production database এ run করার আগে নিশ্চিত হয়ে নিন যে আপনি existing data হারাতে চান কিনা।

### Output Example:

```
🌍 Starting Zone and Zone Pricing seeding...
✅ Database connected
🗑️  Clearing existing zones and pricing...
✅ Existing data cleared
📍 Seeding zones...
✅ 5 zones created successfully
💰 Seeding zone pricing...
✅ 50 zone pricing records created successfully

🎉 Seeding completed successfully!

📊 Summary:
   - Zones: 5
   - Zone Pricing: 50
   - Total Countries: 57
```

### Pricing Structure:

#### Within Same Zone (সবচেয়ে সস্তা):
- Standard: $12.99 - $25.99
- Express: $24.99 - $48.99

#### Between Different Zones:
- Standard: $32.99 - $53.99
- Express: $62.99 - $97.99

### Delivery Times:

- **Same Zone Standard**: 3-10 business days
- **Same Zone Express**: 1-4 business days
- **Cross Zone Standard**: 7-22 business days
- **Cross Zone Express**: 3-10 business days

---

## ভবিষ্যতে আরো Seeders যোগ করা যাবে:

যদি আপনার অন্য data seed করার দরকার হয়, তাহলে এই folder এ নতুন seeder file তৈরি করতে পারবেন:

```typescript
// Example: user.seeder.ts
import { User } from '../app/modules/user/user.model';

export const seedUsers = async () => {
  // Your seeding logic
};
```

এবং `package.json` এ script যোগ করুন:
```json
"seed:users": "ts-node-dev src/seeders/user.seeder.ts"
```
