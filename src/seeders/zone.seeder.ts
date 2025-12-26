import mongoose from 'mongoose';
import { Zone } from '../app/modules/zoone/zone.model';
import { ZonePricing } from '../app/modules/zoonePricing/zonePricing.model';
import config from '../config';

/**
 * Zone Data - Based on international shipping zones
 * Zone 1: North America
 * Zone 2: Europe
 * Zone 3: Asia Pacific
 * Zone 4: Middle East & Africa
 * Zone 5: South America
 */
const zonesData = [
    {
        id: 1,
        name: 'North America',
        countries: ['US', 'CA', 'MX'],
        isActive: true,
    },
    {
        id: 2,
        name: 'Europe',
        countries: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'PL', 'AT', 'CH'],
        isActive: true,
    },
    {
        id: 3,
        name: 'Asia Pacific',
        countries: ['CN', 'JP', 'KR', 'SG', 'HK', 'TW', 'AU', 'NZ', 'TH', 'MY', 'ID', 'PH', 'VN', 'IN', 'BD'],
        isActive: true,
    },
    {
        id: 4,
        name: 'Middle East & Africa',
        countries: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'IL', 'TR', 'EG', 'ZA', 'KE', 'NG'],
        isActive: true,
    },
    {
        id: 5,
        name: 'South America',
        countries: ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY'],
        isActive: true,
    },
];

/**
 * Zone Pricing Data
 * Prices are in USD
 * Format: fromZone -> toZone with standard and express options
 */
const zonePricingData = [
    // Zone 1 (North America) pricing
    {
        title: 'North America to North America - Standard',
        fromZone: 1,
        toZone: 1,
        shippingType: 'standard' as const,
        price: 15.99,
        duration: '3-5 business days',
        description: 'Standard shipping within North America',
    },
    {
        title: 'North America to North America - Express',
        fromZone: 1,
        toZone: 1,
        shippingType: 'express' as const,
        price: 29.99,
        duration: '1-2 business days',
        description: 'Express shipping within North America',
    },
    {
        title: 'North America to Europe - Standard',
        fromZone: 1,
        toZone: 2,
        shippingType: 'standard' as const,
        price: 35.99,
        duration: '7-10 business days',
        description: 'Standard shipping from North America to Europe',
    },
    {
        title: 'North America to Europe - Express',
        fromZone: 1,
        toZone: 2,
        shippingType: 'express' as const,
        price: 65.99,
        duration: '3-5 business days',
        description: 'Express shipping from North America to Europe',
    },
    {
        title: 'North America to Asia Pacific - Standard',
        fromZone: 1,
        toZone: 3,
        shippingType: 'standard' as const,
        price: 42.99,
        duration: '10-15 business days',
        description: 'Standard shipping from North America to Asia Pacific',
    },
    {
        title: 'North America to Asia Pacific - Express',
        fromZone: 1,
        toZone: 3,
        shippingType: 'express' as const,
        price: 79.99,
        duration: '4-7 business days',
        description: 'Express shipping from North America to Asia Pacific',
    },
    {
        title: 'North America to Middle East & Africa - Standard',
        fromZone: 1,
        toZone: 4,
        shippingType: 'standard' as const,
        price: 45.99,
        duration: '12-18 business days',
        description: 'Standard shipping from North America to Middle East & Africa',
    },
    {
        title: 'North America to Middle East & Africa - Express',
        fromZone: 1,
        toZone: 4,
        shippingType: 'express' as const,
        price: 85.99,
        duration: '5-8 business days',
        description: 'Express shipping from North America to Middle East & Africa',
    },
    {
        title: 'North America to South America - Standard',
        fromZone: 1,
        toZone: 5,
        shippingType: 'standard' as const,
        price: 38.99,
        duration: '8-12 business days',
        description: 'Standard shipping from North America to South America',
    },
    {
        title: 'North America to South America - Express',
        fromZone: 1,
        toZone: 5,
        shippingType: 'express' as const,
        price: 72.99,
        duration: '4-6 business days',
        description: 'Express shipping from North America to South America',
    },

    // Zone 2 (Europe) pricing
    {
        title: 'Europe to North America - Standard',
        fromZone: 2,
        toZone: 1,
        shippingType: 'standard' as const,
        price: 36.99,
        duration: '7-10 business days',
        description: 'Standard shipping from Europe to North America',
    },
    {
        title: 'Europe to North America - Express',
        fromZone: 2,
        toZone: 1,
        shippingType: 'express' as const,
        price: 67.99,
        duration: '3-5 business days',
        description: 'Express shipping from Europe to North America',
    },
    {
        title: 'Europe to Europe - Standard',
        fromZone: 2,
        toZone: 2,
        shippingType: 'standard' as const,
        price: 12.99,
        duration: '3-5 business days',
        description: 'Standard shipping within Europe',
    },
    {
        title: 'Europe to Europe - Express',
        fromZone: 2,
        toZone: 2,
        shippingType: 'express' as const,
        price: 24.99,
        duration: '1-2 business days',
        description: 'Express shipping within Europe',
    },
    {
        title: 'Europe to Asia Pacific - Standard',
        fromZone: 2,
        toZone: 3,
        shippingType: 'standard' as const,
        price: 39.99,
        duration: '10-14 business days',
        description: 'Standard shipping from Europe to Asia Pacific',
    },
    {
        title: 'Europe to Asia Pacific - Express',
        fromZone: 2,
        toZone: 3,
        shippingType: 'express' as const,
        price: 74.99,
        duration: '4-6 business days',
        description: 'Express shipping from Europe to Asia Pacific',
    },
    {
        title: 'Europe to Middle East & Africa - Standard',
        fromZone: 2,
        toZone: 4,
        shippingType: 'standard' as const,
        price: 32.99,
        duration: '8-12 business days',
        description: 'Standard shipping from Europe to Middle East & Africa',
    },
    {
        title: 'Europe to Middle East & Africa - Express',
        fromZone: 2,
        toZone: 4,
        shippingType: 'express' as const,
        price: 62.99,
        duration: '3-5 business days',
        description: 'Express shipping from Europe to Middle East & Africa',
    },
    {
        title: 'Europe to South America - Standard',
        fromZone: 2,
        toZone: 5,
        shippingType: 'standard' as const,
        price: 44.99,
        duration: '12-16 business days',
        description: 'Standard shipping from Europe to South America',
    },
    {
        title: 'Europe to South America - Express',
        fromZone: 2,
        toZone: 5,
        shippingType: 'express' as const,
        price: 82.99,
        duration: '5-8 business days',
        description: 'Express shipping from Europe to South America',
    },

    // Zone 3 (Asia Pacific) pricing
    {
        title: 'Asia Pacific to North America - Standard',
        fromZone: 3,
        toZone: 1,
        shippingType: 'standard' as const,
        price: 43.99,
        duration: '10-15 business days',
        description: 'Standard shipping from Asia Pacific to North America',
    },
    {
        title: 'Asia Pacific to North America - Express',
        fromZone: 3,
        toZone: 1,
        shippingType: 'express' as const,
        price: 81.99,
        duration: '4-7 business days',
        description: 'Express shipping from Asia Pacific to North America',
    },
    {
        title: 'Asia Pacific to Europe - Standard',
        fromZone: 3,
        toZone: 2,
        shippingType: 'standard' as const,
        price: 40.99,
        duration: '10-14 business days',
        description: 'Standard shipping from Asia Pacific to Europe',
    },
    {
        title: 'Asia Pacific to Europe - Express',
        fromZone: 3,
        toZone: 2,
        shippingType: 'express' as const,
        price: 76.99,
        duration: '4-6 business days',
        description: 'Express shipping from Asia Pacific to Europe',
    },
    {
        title: 'Asia Pacific to Asia Pacific - Standard',
        fromZone: 3,
        toZone: 3,
        shippingType: 'standard' as const,
        price: 18.99,
        duration: '5-8 business days',
        description: 'Standard shipping within Asia Pacific',
    },
    {
        title: 'Asia Pacific to Asia Pacific - Express',
        fromZone: 3,
        toZone: 3,
        shippingType: 'express' as const,
        price: 34.99,
        duration: '2-4 business days',
        description: 'Express shipping within Asia Pacific',
    },
    {
        title: 'Asia Pacific to Middle East & Africa - Standard',
        fromZone: 3,
        toZone: 4,
        shippingType: 'standard' as const,
        price: 36.99,
        duration: '9-13 business days',
        description: 'Standard shipping from Asia Pacific to Middle East & Africa',
    },
    {
        title: 'Asia Pacific to Middle East & Africa - Express',
        fromZone: 3,
        toZone: 4,
        shippingType: 'express' as const,
        price: 69.99,
        duration: '4-6 business days',
        description: 'Express shipping from Asia Pacific to Middle East & Africa',
    },
    {
        title: 'Asia Pacific to South America - Standard',
        fromZone: 3,
        toZone: 5,
        shippingType: 'standard' as const,
        price: 48.99,
        duration: '14-20 business days',
        description: 'Standard shipping from Asia Pacific to South America',
    },
    {
        title: 'Asia Pacific to South America - Express',
        fromZone: 3,
        toZone: 5,
        shippingType: 'express' as const,
        price: 89.99,
        duration: '6-9 business days',
        description: 'Express shipping from Asia Pacific to South America',
    },

    // Zone 4 (Middle East & Africa) pricing
    {
        title: 'Middle East & Africa to North America - Standard',
        fromZone: 4,
        toZone: 1,
        shippingType: 'standard' as const,
        price: 46.99,
        duration: '12-18 business days',
        description: 'Standard shipping from Middle East & Africa to North America',
    },
    {
        title: 'Middle East & Africa to North America - Express',
        fromZone: 4,
        toZone: 1,
        shippingType: 'express' as const,
        price: 87.99,
        duration: '5-8 business days',
        description: 'Express shipping from Middle East & Africa to North America',
    },
    {
        title: 'Middle East & Africa to Europe - Standard',
        fromZone: 4,
        toZone: 2,
        shippingType: 'standard' as const,
        price: 33.99,
        duration: '8-12 business days',
        description: 'Standard shipping from Middle East & Africa to Europe',
    },
    {
        title: 'Middle East & Africa to Europe - Express',
        fromZone: 4,
        toZone: 2,
        shippingType: 'express' as const,
        price: 64.99,
        duration: '3-5 business days',
        description: 'Express shipping from Middle East & Africa to Europe',
    },
    {
        title: 'Middle East & Africa to Asia Pacific - Standard',
        fromZone: 4,
        toZone: 3,
        shippingType: 'standard' as const,
        price: 37.99,
        duration: '9-13 business days',
        description: 'Standard shipping from Middle East & Africa to Asia Pacific',
    },
    {
        title: 'Middle East & Africa to Asia Pacific - Express',
        fromZone: 4,
        toZone: 3,
        shippingType: 'express' as const,
        price: 71.99,
        duration: '4-6 business days',
        description: 'Express shipping from Middle East & Africa to Asia Pacific',
    },
    {
        title: 'Middle East & Africa to Middle East & Africa - Standard',
        fromZone: 4,
        toZone: 4,
        shippingType: 'standard' as const,
        price: 22.99,
        duration: '6-10 business days',
        description: 'Standard shipping within Middle East & Africa',
    },
    {
        title: 'Middle East & Africa to Middle East & Africa - Express',
        fromZone: 4,
        toZone: 4,
        shippingType: 'express' as const,
        price: 42.99,
        duration: '2-4 business days',
        description: 'Express shipping within Middle East & Africa',
    },
    {
        title: 'Middle East & Africa to South America - Standard',
        fromZone: 4,
        toZone: 5,
        shippingType: 'standard' as const,
        price: 52.99,
        duration: '15-22 business days',
        description: 'Standard shipping from Middle East & Africa to South America',
    },
    {
        title: 'Middle East & Africa to South America - Express',
        fromZone: 4,
        toZone: 5,
        shippingType: 'express' as const,
        price: 95.99,
        duration: '7-10 business days',
        description: 'Express shipping from Middle East & Africa to South America',
    },

    // Zone 5 (South America) pricing
    {
        title: 'South America to North America - Standard',
        fromZone: 5,
        toZone: 1,
        shippingType: 'standard' as const,
        price: 39.99,
        duration: '8-12 business days',
        description: 'Standard shipping from South America to North America',
    },
    {
        title: 'South America to North America - Express',
        fromZone: 5,
        toZone: 1,
        shippingType: 'express' as const,
        price: 74.99,
        duration: '4-6 business days',
        description: 'Express shipping from South America to North America',
    },
    {
        title: 'South America to Europe - Standard',
        fromZone: 5,
        toZone: 2,
        shippingType: 'standard' as const,
        price: 45.99,
        duration: '12-16 business days',
        description: 'Standard shipping from South America to Europe',
    },
    {
        title: 'South America to Europe - Express',
        fromZone: 5,
        toZone: 2,
        shippingType: 'express' as const,
        price: 84.99,
        duration: '5-8 business days',
        description: 'Express shipping from South America to Europe',
    },
    {
        title: 'South America to Asia Pacific - Standard',
        fromZone: 5,
        toZone: 3,
        shippingType: 'standard' as const,
        price: 49.99,
        duration: '14-20 business days',
        description: 'Standard shipping from South America to Asia Pacific',
    },
    {
        title: 'South America to Asia Pacific - Express',
        fromZone: 5,
        toZone: 3,
        shippingType: 'express' as const,
        price: 91.99,
        duration: '6-9 business days',
        description: 'Express shipping from South America to Asia Pacific',
    },
    {
        title: 'South America to Middle East & Africa - Standard',
        fromZone: 5,
        toZone: 4,
        shippingType: 'standard' as const,
        price: 53.99,
        duration: '15-22 business days',
        description: 'Standard shipping from South America to Middle East & Africa',
    },
    {
        title: 'South America to Middle East & Africa - Express',
        fromZone: 5,
        toZone: 4,
        shippingType: 'express' as const,
        price: 97.99,
        duration: '7-10 business days',
        description: 'Express shipping from South America to Middle East & Africa',
    },
    {
        title: 'South America to South America - Standard',
        fromZone: 5,
        toZone: 5,
        shippingType: 'standard' as const,
        price: 25.99,
        duration: '6-10 business days',
        description: 'Standard shipping within South America',
    },
    {
        title: 'South America to South America - Express',
        fromZone: 5,
        toZone: 5,
        shippingType: 'express' as const,
        price: 48.99,
        duration: '2-4 business days',
        description: 'Express shipping within South America',
    },
];

/**
 * Seed Zones and Zone Pricing
 */
export const seedZonesAndPricing = async () => {
    try {
        console.log('🌍 Starting Zone and Zone Pricing seeding...');

        // Connect to database if not connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(config.database_url as string);
            console.log('✅ Database connected');
        }

        // Clear existing data
        console.log('🗑️  Clearing existing zones and pricing...');
        await Zone.deleteMany({});
        await ZonePricing.deleteMany({});
        console.log('✅ Existing data cleared');

        // Seed Zones
        console.log('📍 Seeding zones...');
        const createdZones = await Zone.insertMany(zonesData);
        console.log(`✅ ${createdZones.length} zones created successfully`);

        // Seed Zone Pricing
        console.log('💰 Seeding zone pricing...');
        const createdPricing = await ZonePricing.insertMany(zonePricingData);
        console.log(`✅ ${createdPricing.length} zone pricing records created successfully`);

        console.log('\n🎉 Seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Zones: ${createdZones.length}`);
        console.log(`   - Zone Pricing: ${createdPricing.length}`);
        console.log(`   - Total Countries: ${zonesData.reduce((acc, zone) => acc + zone.countries.length, 0)}`);

        return {
            zones: createdZones,
            pricing: createdPricing,
        };
    } catch (error) {
        console.error('❌ Error seeding zones and pricing:', error);
        throw error;
    }
};

/**
 * Run seeder if executed directly
 */
if (require.main === module) {
    seedZonesAndPricing()
        .then(() => {
            console.log('✅ Seeding process completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Seeding process failed:', error);
            process.exit(1);
        });
}
