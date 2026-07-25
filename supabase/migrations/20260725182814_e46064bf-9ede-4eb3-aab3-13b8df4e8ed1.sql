CREATE OR REPLACE FUNCTION public._mig_exec(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$ BEGIN EXECUTE sql; END; $$;
GRANT EXECUTE ON FUNCTION public._mig_exec(text) TO PUBLIC;