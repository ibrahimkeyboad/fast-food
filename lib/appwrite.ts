import { CreateUserPrams, GetMenuParams, SignInParams } from '@/type';
import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  platform: 'com.mrkeyboard.fastfood',
  databaseId: '69510635001a49028eaf',
  bucketId: '6953c94900257c3f212f',
  userCollectionId: 'user',
  categoriesCollectionId: 'category',
  menucollectionId: 'menu',
  customizationsCollectionId: 'customizations',
  menuCustomizationsCollectionId: 'menu_customizations',
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatar = new Avatars(client);

export async function createUser({ email, password, name }: CreateUserPrams) {
  try {
    const newAccount = await account.create({ userId: ID.unique(), email, password, name });

    if (!newAccount) throw Error;

    await signIn({ email, password });
    const avatarUrl = avatar.getInitialsURL(name);

    const newUser = await databases.createDocument({
      databaseId: appwriteConfig.databaseId,
      documentId: ID.unique(),
      collectionId: appwriteConfig.userCollectionId,
      data: {
        accountId: newAccount.$id,
        name,
        email,
        avatar: avatarUrl,
      },
    });

    return newUser;
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function signIn({ email, password }: SignInParams) {
  try {
    const session = await account.createEmailPasswordSession({ email, password });

    return session;
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.userCollectionId,
      queries: [Query.equal('accountId', currentAccount.$id)],
    });

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function getMenu({ category, query }: GetMenuParams) {
  try {
    const queries: string[] = [];

    if (category) {
      queries.push(Query.equal('categories', category));
    }

    if (query) {
      queries.push(Query.search('name', query));
    }

    const menus = databases.listDocuments({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.menucollectionId,
      queries,
    });

    return (await menus).documents;
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function getCategories() {
  try {
    const categories = await databases.listDocuments({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.categoriesCollectionId,
    });

    return categories.documents;
  } catch (error) {
    throw new Error(error as string);
  }
}
