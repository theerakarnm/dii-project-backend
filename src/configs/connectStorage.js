import dotenv from 'dotenv';
import { SupabaseStorageClient } from '@supabase/storage-js';
dotenv.config();

const STORAGE_URL = 'https://oijsgpmyxcrqexaewofb.supabase.co/storage/v1';
const SERVICE_KEY = process.env.SERVICE_KEY_SUPABASE;

const storageClient = new SupabaseStorageClient(STORAGE_URL, {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
});

export default storageClient;
