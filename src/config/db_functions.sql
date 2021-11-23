-- QUERY FOR METADATA
SELECT
  json_build_object('product_id', ${product_id}::text,
    'ratings', (select json_object_agg(rating, count)
      FROM (select distinct rating, count(rating)
        FROM reviews
        WHERE product_id = ${product_id}
        group by rating) AS counts),
    'recommended', (select json_build_object(
      'false', getRecommendedCount(${product_id}, false),
      'true', getRecommendedCount(${product_id}, true))),
    'characteristics', (select json_object_agg(name, json_build_object(
      'id', characteristics.id,
      'value', getAverage(id)))
        FROM characteristics
        WHERE product_id = ${product_id}))


-- FUNCTION (GET NUMBER OF RECOMMENDATIONS FOR THE PRODUCT)
drop function getRecommendedCount;
create or replace function getRecommendedCount(product int, choice bool)

returns int
as
$$
declare totalFalse int;

begin
	select count(recommend) into totalFalse
	from reviews
	where product_id = product and recommend = choice;
   return totalFalse;
end;
$$ language plpgsql;


-- FUNCTION  (GET AVERAGE RATING PER CHARACTERISTIC)
drop function getAverage;
create or replace function getAverage(characteristic int)

returns text
as
$$
declare average text;

begin
select avg(value)::text into average
from characteristic_reviews
where characteristic_id = characteristic;
return average;
end;
$$ language plpgsql;


-- FUNCTION  (GET THE NUMBER OF RATINGS RECEIVED PER CHARACTERISTIC)
drop function getRatingsCount;
create or replace function getRatingsCount(product int, target int)

returns int
as
$$
declare score int;

begin
	select count(rating) into score
	from reviews
	where product_id = product and rating = target;
   return score;
end;
$$ language plpgsql;


--WITH review AS (
--  INSERT INTO reviews
--    (product_id , rating , summary, body, recommend, reviewer_name, reviewer_email)
--  VALUES
--    (1, 5, 'Kinda dig it', 'This is what you make me do more than 100 times a day', true, 'goat', 'goat')
--  RETURNING review_id)
--INSERT INTO reviews_photos
--    (review_id, url)
--SELECT review_id, url
--FROM review
--CROSS JOIN UNNEST (ARRAY [
--	  'https://images.unsplash.com/photo-1636711158106-78e8d929df94',
--      'https://images.unsplash.com/photo-1636711158106-78e8d929df95]']) AS t (url);



-- WITH review AS (
--   INSERT INTO reviews
--     (product_id , rating , summary, body, recommend, reviewer_name, reviewer_email)
--   VALUES
--     (1, 4, 'will it work, I new it would. Im sarting to love this stuff', 'But I also get tired of so much work I always have to be doing for this', true, 'goat2', 'goat@goat.com')
--   RETURNING review_id),
-- photos AS (
--   INSERT INTO reviews_photos
--     (review_id, url)
--   SELECT review_id, url
--   FROM review
--   CROSS JOIN UNNEST (ARRAY [
--     'https://images.unsplash.com/photo-1636711158106-78e8d929df94',
--     'https://images.unsplash.com/photo-1636711158106-78e8d929df95]']::text[]) AS t (url)
--   RETURNING id)
-- INSERT INTO characteristic_reviews
--   (review_id, characteristic_id, value)
--   SELECT review_id, characteristic_id, value
--   FROM review
--   CROSS JOIN (SELECT
--     json_data.key::integer AS characteristic_id,
--     json_data.value::text::smallint AS value
--     FROM json_each('{"135219": 1, "135220": 1, "135221": 1, "135222": 1}') AS json_data) as t;



-- INDEXING (REVIEWS TABLE)
CREATE INDEX product_id_index ON reviews (product_id);
create index rating_index on reviews (rating);
create index recommend_index on reviews (recommend);
create index reported_index on reviews (reported);


-- INDEXING (CHARACTERISTIC_REVIEWS TABLE)
CREATE INDEX characteristic_id_char_rev_index ON characteristic_reviews (characteristic_id);
CREATE INDEX review_id_char_rev_index ON characteristic_reviews (review_id);
CREATE INDEX value_char_rev_index ON characteristic_reviews (value);


-- INDEXING (CHARACTERISTICS TABLE)
create index product_id_char_index on characteristics (product_id);
create index name__char_index on characteristics (name);