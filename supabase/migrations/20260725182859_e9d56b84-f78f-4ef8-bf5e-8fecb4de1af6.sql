DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role, sandbox_exec;
GRANT CREATE ON SCHEMA public TO postgres, service_role;
GRANT ALL ON SCHEMA public TO postgres;

-- Recreate helper used to apply migrations from sandbox
CREATE OR REPLACE FUNCTION public._mig_exec(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$ BEGIN EXECUTE sql; END; $$;
GRANT EXECUTE ON FUNCTION public._mig_exec(text) TO sandbox_exec, service_role;