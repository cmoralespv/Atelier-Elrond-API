CREATE TABLE reviews (
  id  serial  PRIMARY KEY,
  product_Id  serial  NOT NULL,
  rating  smallint,
  date  bigint  NOT NULL,
  summary  varchar(60)  NOT NULL,
  body  varchar(1000)  NOT NULL,
  recommend  boolean  NOT NULL  DEFAULT FALSE,
  reported  boolean  NOT NULL  DEFAULT FALSE,
  reviewer_name  varchar(60)  NOT NULL,
  reviewer_email  varchar(60)  NOT NULL,
  response  varchar(1000)  NOT NULL,
  helpfulness  integer  NOT NULL  DEFAULT 0,
  photos  text  NOT NULL  DEFAULT ''
)


CREATE TABLE characteristics (
  id  serial  PRIMARY KEY,
  product_id  serial  NOT NULL,
  name  varchar(60)  NOT NULL
)


CREATE TABLE characteristic_reviews (
  id  serial  PRIMARY KEY,
  characteristic_id  serial  REFERENCES characteristics (id)  ON DELETE CASCADE,
  review_id  serial REFERENCES reviews (id)  ON DELETE CASCADE,
  value  smallint
)


CREATE TABLE reviews_photos.csv (
  id serial PRIMARY KEY,
  review_id  serial  REFERENCES reviews (id)  ON DELETE CASCADE,
  url  varchar(300)  NOT NULL
)


CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id)
CREATE UNIQUE INDEX characteristics_pkey ON public.characteristics USING btree (id)
CREATE UNIQUE INDEX characteristic_reviews_pkey ON public.characteristic_reviews USING btree (id)
CREATE UNIQUE INDEX reviews_photos_pkey ON public.reviews_photos USING btree (id)