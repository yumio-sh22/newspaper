CREATE OR REPLACE PROCEDURE sp_publish_article(p_article_id INT, p_editor_id INT)
LANGUAGE plpgsql AS $$
DECLARE v_role VARCHAR;
BEGIN
  SELECT role INTO v_role FROM users WHERE id = p_editor_id;
  IF v_role NOT IN ('editor','admin') THEN RAISE EXCEPTION 'Нет прав на публикацию'; END IF;
  UPDATE articles SET status='published', published_at=NOW(), updated_at=NOW() WHERE id = p_article_id AND status='draft';
  IF NOT FOUND THEN RAISE EXCEPTION 'Статья не найдена или уже опубликована'; END IF;
END; $$;

CREATE OR REPLACE PROCEDURE sp_archive_old_articles(p_days INT DEFAULT 180)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE articles SET status='archived', updated_at=NOW()
  WHERE status='published' AND published_at < NOW() - (p_days || ' days')::INTERVAL;
END; $$;

CREATE OR REPLACE PROCEDURE sp_assign_categories(p_article_id INT, p_cat_ids INT[])
LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM article_categories WHERE article_id = p_article_id;
  INSERT INTO article_categories (article_id, category_id) SELECT p_article_id, unnest(p_cat_ids);
END; $$;