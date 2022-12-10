import {
  Share,
  ShareInsert,
  ShareUpdate,
  ShareWithUsername,
} from '../types/types';
import { supabase } from '../utils/supabase';

const SHARE_TABLE_NAME = 'Share';
export const getShareToTweet = async () => {
  const { data, error } = await supabase
    .from(SHARE_TABLE_NAME)
    .select()
    .eq('tweetable', true)
    .eq('tweeted', false)
    .limit(1);

  if (error) {
    throw error;
  }

  return data[0] as Share;
};

export const getRecentShares = async (
  limit: number = 20
): Promise<ShareWithUsername[]> => {
  const res = await supabase
    .from(SHARE_TABLE_NAME)
    .select(
      `id, createdAt, link, title, description, imageUrl, tweetable, discordUserId,
        user:discordUserId(username)`
    )
    .eq('emailable', true)
    .limit(limit)
    .order('createdAt', { ascending: false });

  if (res.error) {
    throw res.error;
  }

  return res.data as ShareWithUsername[];
};

export const markShareAsTweeted = async (id: string): Promise<Share> => {
  const res = await supabase
    .from(SHARE_TABLE_NAME)
    .update({ tweeted: true })
    .eq('id', id)
    .select();

  if (res.error) {
    throw res.error;
  }

  return res.data[0] as Share;
};

export const updateShare = async (
  id: string,
  shareUpdate: ShareUpdate
): Promise<Share> => {
  const res = await supabase
    .from(SHARE_TABLE_NAME)
    .update(shareUpdate)
    .eq('id', id)
    .select();

  if (res.error) {
    throw res.error;
  }

  return res.data[0] as Share;
};

export const markShareAsEmailed = async (id: string): Promise<Share> => {
  return await updateShare(id, { emailed: true });
};

export const createShare = async (
  share: ShareInsert
): Promise<ShareWithUsername> => {
  const res = await supabase
    .from(SHARE_TABLE_NAME)
    .insert(share)
    .select(
      `id, createdAt, link, title, description, imageUrl, tweetable, 
    user:discordUserId(username)`
    );
  if (res.error) {
    throw res.error;
  }

  return res.data[0] as ShareWithUsername;
};
