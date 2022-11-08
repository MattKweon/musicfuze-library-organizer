set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."accounts" (
	"accountId" serial NOT NULL,
	"username" TEXT NOT NULL,
	"hashedPassword" TEXT NOT NULL,
	"savedSongs" int NOT NULL,
	CONSTRAINT "accounts_pk" PRIMARY KEY ("accountId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."tracks" (
	"trackId" int NOT NULL,
	"name" TEXT NOT NULL,
	"artist" TEXT NOT NULL,
	"artistPictureUrl" TEXT NOT NULL,
	"album" TEXT NOT NULL,
	"albumCoverUrl" TEXT NOT NULL,
	CONSTRAINT "tracks_pk" PRIMARY KEY ("trackId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."playlists" (
	"playlistId" serial NOT NULL,
	"name" TEXT NOT NULL,
	"accountId" int NOT NULL,
	CONSTRAINT "playlists_pk" PRIMARY KEY ("playlistId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."playlistTracks" (
	"playlistId" int NOT NULL,
	"trackId" serial NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."library" (
	"accountId" int NOT NULL,
	"trackId" int NOT NULL
) WITH (
  OIDS=FALSE
);





ALTER TABLE "playlists" ADD CONSTRAINT "playlists_fk0" FOREIGN KEY ("accountId") REFERENCES "accounts"("accountId");

ALTER TABLE "playlistTracks" ADD CONSTRAINT "playlistTracks_fk0" FOREIGN KEY ("playlistId") REFERENCES "playlists"("playlistId");
ALTER TABLE "playlistTracks" ADD CONSTRAINT "playlistTracks_fk1" FOREIGN KEY ("trackId") REFERENCES "tracks"("trackId");

ALTER TABLE "library" ADD CONSTRAINT "library_fk0" FOREIGN KEY ("accountId") REFERENCES "accounts"("accountId");
ALTER TABLE "library" ADD CONSTRAINT "library_fk1" FOREIGN KEY ("trackId") REFERENCES "tracks"("trackId");
