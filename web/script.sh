#!/bin/bash

openssl genrsa -out ca.key 2048
openssl req -new -x509 -days 365 -key ca.key -subj "/C=CA/ST=Quebec/L=Sherbrooke/O=JDIS/CN=10.44.88.221" -out ca.crt

openssl req -newkey rsa:2048 -nodes -keyout server.key -subj "/C=CA/ST=Quebec/L=Sherbrooke/O=JDIS/CN=10.44.88.221" -out server.csr
openssl x509 -req -extfile <(printf "subjectAltName=IP:10.44.88.221") -days 365 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt
