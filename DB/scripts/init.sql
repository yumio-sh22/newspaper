-- =====================================================
-- Инициализация БД для курсовой работы: "Газета"
-- Автор: Мартинсон Д.В.
-- Группа: БИВТ-24-5
-- =====================================================

-- 1. Создание роли 
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'newspaper_user') THEN
    CREATE ROLE newspaper_user WITH LOGIN PASSWORD 'DemoPass123!';
  END IF;
END $$;

-- 2. Создание БД
-- CREATE DATABASE newspaper_db OWNER newspaper_user;

-- 3. Подключение к БД и выдача прав
\c newspaper_db
GRANT ALL ON SCHEMA public TO newspaper_user;

-- 4. Последовательное выполнение скриптов структуры
\i tables.sql
\i functions.sql
\i procedures.sql
\i views.sql
\i triggers.sql

-- 5. Полные права на все объекты
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO newspaper_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO newspaper_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO newspaper_user;
GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA public TO newspaper_user;

-- 6. Демо-данные для проверки приложения
-- ️ Пароли хешированы (bcrypt, rounds=12). 
-- Для теста используйте: Demo123! (для admin) и Author123! (для author)
INSERT INTO users (email, password_hash, full_name, role) VALUES 
  ('admin@gazeta.demo', '$2b$12$9Xj8k7mNqL5pR2vT6wY8zO3aB4cD5eF6gH7iJ8kL9mN0pQ1rS2tU3', 'Администратор', 'admin'),
  ('author@gazeta.demo', '$2b$12$4A5bC6dE7fG8hI9jK0lM1nO2pQ3rS4tU5vW6xY7zA8bC9dE0fG1h', 'Тестовый Автор', 'author')
ON CONFLICT (email) DO NOTHING;

INSERT INTO categories (name, description) VALUES
  ('Новости', 'Актуальные события'),
  ('Аналитика', 'Экспертные материалы'),
  ('Обзоры', 'Оценки и рецензии')
ON CONFLICT (name) DO NOTHING;

