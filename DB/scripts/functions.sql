CREATE OR REPLACE FUNCTION fn_generate_slug(p_title TEXT) RETURNS TEXT AS $$
BEGIN RETURN LOWER(REGEXP_REPLACE(p_title, '[^a-zа-яё0-9\s]', '', 'gi')); END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION fn_reading_time(p_content TEXT) RETURNS INTEGER AS $$
BEGIN RETURN GREATEST(1, CEIL(LENGTH(p_content)::float / 1000.0)); END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION fn_search_articles(p_query TEXT, p_limit INT DEFAULT 10)
RETURNS TABLE(id INT, title TEXT, slug TEXT, author TEXT) AS $$
BEGIN
  RETURN QUERY SELECT a.id, a.title, a.slug, u.full_name
  FROM articles a JOIN users u ON a.author_id = u.id
  WHERE a.status = 'published' AND (a.title ILIKE '%'||p_query||'%' OR a.content ILIKE '%'||p_query||'%')
  ORDER BY a.published_at DESC LIMIT p_limit;
END; $$ LANGUAGE plpgsql;