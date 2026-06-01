import { supabase } from '../lib/supabaseClient';

const TABLE_NAME = 'contests';

export async function fetchContests() {
  ensureSupabase();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, title, deadline, official_url, memo, created_at, updated_at')
    .order('deadline', { ascending: true });

  if (error) throw error;
  return data.map(fromRow);
}

export async function createContest(contest) {
  ensureSupabase();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(toRow(contest))
    .select('id, title, deadline, official_url, memo, created_at, updated_at')
    .single();

  if (error) throw error;
  return fromRow(data);
}

export async function createContests(contests) {
  ensureSupabase();

  if (contests.length === 0) return [];

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(contests.map(toRow))
    .select('id, title, deadline, official_url, memo, created_at, updated_at');

  if (error) throw error;
  return data.map(fromRow);
}

export async function updateContest(id, contest) {
  ensureSupabase();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({ ...toRow(contest), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, title, deadline, official_url, memo, created_at, updated_at')
    .single();

  if (error) throw error;
  return fromRow(data);
}

export async function deleteContest(id) {
  ensureSupabase();

  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
  if (error) throw error;
}

function toRow(contest) {
  return {
    title: contest.title,
    deadline: contest.deadline,
    official_url: contest.officialUrl,
    memo: contest.memo || '',
  };
}

function fromRow(row) {
  return {
    id: row.id,
    title: row.title,
    deadline: row.deadline,
    officialUrl: row.official_url,
    memo: row.memo || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase 환경변수가 설정되지 않았습니다.');
  }
}
