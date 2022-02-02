create database if not exists NearbyStays;
use NearbyStays
create table if not exists hotels (
  id int auto_increment primary key,
  usertype varchar(80),
  name varchar(80),
  guestid int foreign key references guests,
  reservationid int foreign key references reservations(id),
  time timestamp
);

create table if not exists guests (
  id int auto_increment primary key,
  name varchar(80),
  phone int,
  email varchar(80),
  reservationid int foreign key references reservations(id),
  hotelid int foreign key references hotels(id),
  time timestamp
);

create table if not exists reservations (
  id int auto_increment primary key,
  amount int,
  hotelid int foreign key references hotels(id),
  guestid int foreign key references guests(id),
  searchid int foreign key references searchs(id),
  checkin date,
  checkout date,
  time timestamp
);
