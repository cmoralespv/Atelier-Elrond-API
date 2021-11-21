-- Gets the True and False counts if a product was recommended

-- drop function getRecommendedCount;
-- create or replace function getRecommendedCount(product int, choice bool)

-- returns int
-- as
-- $$
-- declare totalFalse int;

-- begin
-- 	select count(recommend) into totalFalse
-- 	from reviews
-- 	where product_id = product and recommend = choice;
--    return totalFalse;
-- end;
-- $$ language plpgsql;



-- Calculate the Average value of Reviews per characteristic

-- drop function getAverage;
-- create or replace function getAverage(characteristic int)

-- returns float(4)
-- as
-- $$
-- declare average float(4);

-- begin
--  select avg(value) into average
--  from characteristic_reviews
--  where characteristic_id = characteristic;
--  return average;
-- end;
-- $$ language plpgsql;


-- Gets the ratings count for each of the rating value in a product

--drop function getRatingsCount;
--create or replace function getRatingsCount(product int, target int)
--
--returns int
--as
--$$
--declare score int;
--
--begin
--	select count(rating) into score
--	from reviews
--	where product_id = product and rating = target;
--    return score;
--end;
--$$ language plpgsql;