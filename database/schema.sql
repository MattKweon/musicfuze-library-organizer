set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."accounts" (
	"userId" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	CONSTRAINT "accounts_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."tracks" (
	"trackId" int NOT NULL,
	"title" TEXT NOT NULL,
	"artistId" int NOT NULL,
	"albumId" int NOT NULL,
	CONSTRAINT "tracks_pk" PRIMARY KEY ("trackId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."library" (
	"userId" int NOT NULL,
	"trackId" int NOT NULL,
	"artistId" int NOT NULL,
	"albumId" int NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."artists" (
	"artistId" int NOT NULL,
	"name" TEXT NOT NULL,
	"pictureUrl" TEXT NOT NULL,
	CONSTRAINT "artists_pk" PRIMARY KEY ("artistId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."albums" (
	"albumId" int NOT NULL,
	"title" TEXT NOT NULL,
	"coverUrl" TEXT NOT NULL,
	CONSTRAINT "albums_pk" PRIMARY KEY ("albumId")
) WITH (
  OIDS=FALSE
);





ALTER TABLE "library" ADD CONSTRAINT "library_fk0" FOREIGN KEY ("userId") REFERENCES "accounts"("userId");
ALTER TABLE "library" ADD CONSTRAINT "library_fk1" FOREIGN KEY ("trackId") REFERENCES "tracks"("trackId");
