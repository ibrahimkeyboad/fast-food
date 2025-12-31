import { ID } from 'react-native-appwrite';
import dummyData from './data';
import { appwriteConfig, databases, storage } from './appwrite';

// Interfaces
interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: 'topping' | 'side' | 'size' | 'crust' | string;
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[];
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  const list = await databases.listDocuments(appwriteConfig.databaseId, collectionId);
  // Loop sequentially to avoid overwhelming the network
  for (const doc of list.documents) {
    await databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id);
  }
}

async function clearStorage(): Promise<void> {
  const list = await storage.listFiles(appwriteConfig.bucketId);
  for (const file of list.files) {
    await storage.deleteFile(appwriteConfig.bucketId, file.$id);
  }
}

// FIX: This function now simply returns the URL instead of trying to upload it.
// Trying to upload a remote URL as a local file causes "Network Request Failed" in RN.
async function uploadImageToStorage(imageUrl: string) {
  return imageUrl;
}

async function seed(): Promise<void> {
  try {
    console.log('🌱 Starting seed...');

    // 1. Clear all previous data
    console.log('Cleaning DB...');
    await clearAll(appwriteConfig.categoriesCollectionId);
    await clearAll(appwriteConfig.customizationsCollectionId);
    await clearAll(appwriteConfig.menucollectionId);
    await clearAll(appwriteConfig.menuCustomizationsCollectionId);
    await clearStorage();

    // 2. Create Categories
    console.log('Seeding Categories...');
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.categoriesCollectionId,
        ID.unique(),
        cat
      );
      categoryMap[cat.name] = doc.$id;
    }

    // 3. Create Customizations
    console.log('Seeding Customizations...');
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.customizationsCollectionId,
        ID.unique(),
        {
          name: cus.name,
          price: cus.price,
          type: cus.type,
        }
      );
      customizationMap[cus.name] = doc.$id;
    }

    // 4. Create Menu Items
    console.log('Seeding Menu...');
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
      // Just use the URL directly
      const imageUrl = await uploadImageToStorage(item.image_url);

      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.menucollectionId,
        ID.unique(),
        {
          name: item.name,
          description: item.description,
          image_url: imageUrl,
          price: item.price,
          rating: item.rating,
          calories: item.calories,
          protein: item.protein,
          categories: categoryMap[item.category_name],
        }
      );

      menuMap[item.name] = doc.$id;

      // 5. Create Relationships
      for (const cusName of item.customizations) {
        if (customizationMap[cusName]) {
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCustomizationsCollectionId,
            ID.unique(),
            {
              menu: doc.$id,
              customizations: customizationMap[cusName],
            }
          );
        }
      }
    }

    console.log('✅ Seeding complete.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

export default seed;
