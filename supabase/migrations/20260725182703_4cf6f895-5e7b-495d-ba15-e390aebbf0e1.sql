-- Reset public schema to allow full re-apply of migrations
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT CREATE ON SCHEMA public TO postgres, service_role;

-- Then all statements from chunk 0 below
-- (loaded from /tmp/mig_0.sql)
