CREATE OR REPLACE FUNCTION fn_set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_articles_updated BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE FUNCTION fn_block_delete_published() RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'published' THEN RAISE EXCEPTION 'Нельзя удалять опубликованные статьи'; END IF;
  RETURN OLD;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_block_delete BEFORE DELETE ON articles FOR EACH ROW EXECUTE FUNCTION fn_block_delete_published();

CREATE TABLE audit_log (id SERIAL PRIMARY KEY, action TEXT, table_name TEXT, record_id INT, changed_at TIMESTAMP DEFAULT NOW());
CREATE OR REPLACE FUNCTION fn_log_article_insert() RETURNS TRIGGER AS $$
BEGIN INSERT INTO audit_log (action, table_name, record_id) VALUES ('INSERT', 'articles', NEW.id); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_log_article AFTER INSERT ON articles FOR EACH ROW EXECUTE FUNCTION fn_log_article_insert();