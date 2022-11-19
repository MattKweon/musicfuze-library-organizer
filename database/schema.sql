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
	"trackId" int NOT NULL UNIQUE
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



CREATE TABLE "public"."playlist" (
	"playlistId" serial NOT NULL,
	"userId" int NOT NULL,
	"name" TEXT NOT NULL,
	CONSTRAINT "playlist_pk" PRIMARY KEY ("playlistId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "tracks" ADD CONSTRAINT "tracks_fk0" FOREIGN KEY ("artistId") REFERENCES "artists"("artistId");
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_fk1" FOREIGN KEY ("albumId") REFERENCES "albums"("albumId");

ALTER TABLE "library" ADD CONSTRAINT "library_fk0" FOREIGN KEY ("userId") REFERENCES "accounts"("userId");
ALTER TABLE "library" ADD CONSTRAINT "library_fk1" FOREIGN KEY ("trackId") REFERENCES "tracks"("trackId");



ALTER TABLE "playlist" ADD CONSTRAINT "playlist_fk0" FOREIGN KEY ("userId") REFERENCES "accounts"("userId");
