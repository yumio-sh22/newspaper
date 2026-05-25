CREATE OR REPLACE VIEW v_published_articles AS
SELECT a.id, a.title, a.slug, a.content, a.published_at, u.full_name AS author_name
FROM articles a JOIN users u ON a.author_id = u.id
WHERE a.status = 'published' ORDER BY a.published_at DESC;

CREATE OR REPLACE VIEW v_author_stats AS
SELECT u.id, u.full_name, COUNT(a.id) AS total_articles, 
       COUNT(a.id) FILTER (WHERE a.status = 'published') AS published_articles
FROM users u LEFT JOIN articles a ON u.id = a.author_id GROUP BY u.id, u.full_name;

CREATE OR REPLACE VIEW v_category_activity AS
SELECT c.id, c.name, COUNT(ac.article_id) AS article_count
FROM categories c LEFT JOIN article_categories ac ON c.id = ac.category_id GROUP BY c.id, c.name;